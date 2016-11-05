/* @flow
 *
**/

const path = require('path');
const fs = require('fs');
const semver = require('semver');
//import {RepoFileError} from '../utils/error.js';
import { copyR, mkdirR, arrayToMap, mustNot } from '../utils/tools.js';
import { getRepo } from './git.js';
import type { GitLocal } from './git.js';
import { pro } from 'flow-dynamic';


function propsMinus(A: Object, B: Object): Object {
  const minusAB = {};
  for (const key in A) {
    if (B.hasOwnProperty(key) == false) {
      minusAB[key] = A[key];
    }
  }
  return minusAB;
}
function propsUnion(objs: Array<Object>): Object {
  return Object.assign({}, ...objs);
}

export type RepoFile = {
  copy: RepoConfig,
  update: RepoConfig,
};

export type RepoConfig = {
  gitUrl: string,
  commandName: string,
  script?: (appTool: AppTool) => void,
  files: RcFiles,
};

type AppInfo = {
  tag: string|null,
  commit: string,
  confname: string
};

class AppTool {
  destABS: string;
  srcABS: string;
  appName: string;
  confName: string
  gitlocal: GitLocal;
  mergeDep: (pJsons: Array<Object>, excludePkgs?: Array<string>) => Dep;
  mergeDevDep: (pJsons: Array<Object>, excludePkgs?: Array<string>) => Dep;
  constructor(destABS: string, appName: string, confName: string,
  gitlocal: GitLocal) {
    this.destABS = destABS;
    this.srcABS = gitlocal.repoPath;
    this.appName = appName;
    this.confName = confName;
    this.gitlocal = gitlocal;
  }
  getUser() {
    return process.env['USER'];
  }
  jsonSrc(relativePath: string): Object {
    return JSON.parse( fs.readFileSync(
      path.resolve(this.srcABS, relativePath), 'utf8') );
  }
  jsonDest(relativePath: string): Object {
    return JSON.parse( fs.readFileSync(
      path.resolve(this.destABS, relativePath), 'utf8') );
  }
  writeToDest(relativePath: string, data: string) {
    return fs.writeFileSync(path.resolve(this.destABS, relativePath),
          data);
  }
  writeJsonToDest(relativePath: string, data: Object) {
    return fs.writeFileSync(path.resolve(this.destABS, relativePath),
          JSON.stringify(data, null, 2));
  }
  buildAppInfo() {
    mustNot(null, this.gitlocal.commit, 'gitlocal.commit should not be null');
    return {
      tag: this.gitlocal.tag,
      commit: this.gitlocal.commit,
      confname: this.confName,
    };
  }
  readAppInfo(pJson: Object): AppInfo {
    const nullString = pro.nullable(pro.isString);
    const isString = pro.isString;
    const info = pJson.iappinfo;
    return {
      tag: nullString(info.tag),
      commit: isString(info.commit),
      confname: isString(info.confname),
    };
  }
  createPackageJson(srcJson: Object): Object {
    return {
      name: this.appName,
      version: '0.1.0',
      'description': 'none',
      'author': this.getUser(),
      main: srcJson.main ? srcJson.main : '',
      files: srcJson.files ? srcJson.files : [],
      scripts: srcJson.scripts ? srcJson.scripts : {},
      dependencies: srcJson.dependencies,
      devDependencies: srcJson.devDependencies,
      iappinfo: this.buildAppInfo(),
    };
  }
  // -----------------------

  mergeDep(pJsons: Array<Object>,
  excludePkgs?: Array<string>): Dep {
    const deps = pJsons.map(pj => pj.dependencies);
    return _mergeDep(deps, excludePkgs);
  }

  mergeDevDep(pJsons: Array<Object>,
  excludePkgs?: Array<string>): Dep {
    const deps = pJsons.map(pj => pj.devDependencies);
    return _mergeDep(deps, excludePkgs);
  }



  // -------------- compelex functions
  mergePackageJson(
    jsonSrcPaths: Array<string>,
    jsonDestPath: string,
    depExcludes: Array<string>,
    devDepExcludes: Array<string>
  ) {
    const jsons = jsonSrcPaths.map( jpath => this.jsonSrc(jpath));
    const newDep = this.mergeDep(jsons, depExcludes);
    const newDevDep = this.mergeDevDep(jsons, devDepExcludes);
    const mainJson = jsons[0];
    mainJson.dependencies = newDep;
    mainJson.devDependencies = newDevDep;
    const newPkg = this.createPackageJson(mainJson);
    this.writeJsonToDest(jsonDestPath, newPkg);
  }

  async updatePackageJson(
    jsonSrcPaths: Array<string>,
    jsonDestPath: string,
    depExcludes: Array<string>,
    devDepExcludes: Array<string>
  ) {
    const srcJsons = jsonSrcPaths.map( jpath => this.jsonSrc(jpath));
    const destJson = this.jsonDest(jsonDestPath);
    const oldInfo = this.readAppInfo(destJson);
    const oldSrcJsons_ =  jsonSrcPaths.map( jpath => {
      return this.gitlocal._getHistoryFile(oldInfo.commit, jpath)
      .then( str => JSON.parse(str));
    });
    const oldSrcJsons = await Promise.all(oldSrcJsons_);

    const depToRemove = getRemovePkgs(oldSrcJsons, srcJsons, 'dependencies');
    const devDepToRm = getRemovePkgs(oldSrcJsons, srcJsons, 'devDependencies');


    destJson.dependencies = this.mergeDep([...srcJsons, destJson],
      [...depExcludes, ...depToRemove]);
    destJson.devDependencies = this.mergeDevDep([...srcJsons, destJson],
      [...devDepExcludes, ...devDepToRm]);
    destJson.iappinfo = this.buildAppInfo();
    this.writeJsonToDest(jsonDestPath, destJson);

    function getRemovePkgs(oldJsons: Object[], newJsons: Object[],
    arg: 'dependencies'|'devDependencies'): Array<string> {
      const unUsed = oldJsons.map( (oldj, index) => {
        return propsMinus(oldj[arg], newJsons[index][arg]);
      });
      const toRemove = propsUnion(unUsed);
      return Object.keys(toRemove);
    }
  }
}

type Dep = {  [key: string]: string, };
// merge dependencies & devDependencies
function _mergeDep(deps: Array<Dep>, excludePkgs?: Array<string>): Dep {
  const exclude = arrayToMap(excludePkgs);
  const newDep = {};
  for (const dep of deps) {
    for (var key in dep) {
      if (exclude.get(key) != true) {
        if (newDep.hasOwnProperty(key) == false) {
          newDep[key] = dep[key];
        } else {
          if ( semver.gt(dep[key], newDep[key]) ) {
            newDep[key] = dep[key];
          }
        }
      }
    }
  }
  return newDep;
}

export type RcObjectFile = {
  stat?: 'dir'|'file', // default is 'dir'
  dest?: string, // dest path, default is the name of this package
  relativeDir?: 'approot'|'parent', // default is parent
  files?: RcFiles,
};
const COPY = 1;
const MKDIR = 2;
//const CHECK = 4;
type RcSimpleFile =
  1|2|4|  // 1 ,2 ,4 = COPY, MKDIR , CHECK
  string; // rename this file.

type RcFile = RcObjectFile|RcSimpleFile;
type RcFiles = {
  [key: string]: RcObjectFile|RcSimpleFile,
};

// below is inner type, a resolved type from Init*File.
// dest path, default is the name of this option
// src path, default is the name of this option
type ResolvedDirFile = {
  stat: 'dir',
  destABS: string,
  srcABS: string,
  files: RcFiles,
};

type ResolvedSimpleFile = {
  stat: 'file'|'copy'|'mkdir',
  destABS: string,
  srcABS: string,
};
type ResolvedFile = ResolvedDirFile|ResolvedSimpleFile;

class RepoCopy {
  destRoot: string;
  srcRoot: string;
  constructor(destPath: string, srcPath: string ) {
    this.destRoot = destPath;
    this.srcRoot = srcPath;
  }

  _resolveSubFile(dirFile: ResolvedDirFile, subFileName: string): ResolvedFile {
    let stat: 'file'|'copy'|'mkdir' = 'file';
    let relativeDestDir = 'parent';
    let _dest = subFileName;
    const srcABS = path.resolve(dirFile.srcABS, subFileName);
    let destDir = dirFile.destABS;
    const subFile: RcFile = dirFile.files[subFileName];

    console.log(subFileName);
    switch (typeof subFile) {
      case 'object':
        relativeDestDir = subFile.relativeDir ? subFile.relativeDir : relativeDestDir;
        _dest =  subFile.dest ? subFile.dest : _dest;
        destDir = (relativeDestDir == 'parent') ? dirFile.destABS : this.destRoot;
        const files = subFile.files; // to make flow pass.
        if ( files != null) {
          return {
            stat:'dir',
            destABS: path.resolve(destDir, _dest),
            srcABS: srcABS,
            files: files,
          };
        }
        break;
      case 'string': // rename
        _dest = subFile;
        break;
      case 'number': // COPY|MKDIR|IGNORE
        if ( subFile == COPY ) {
          stat = 'copy';
        } else if ( subFile === MKDIR) {
          stat = 'mkdir';
        }
        break;
      default:
        throw new Error('repo config file broken _resolveSubFile');
    }

    return {
      stat:stat,
      destABS: path.resolve(destDir, _dest),
      srcABS: srcABS,
    };
  }

  _copyDir(dirFile: ResolvedDirFile ) {
    for (const fileName in dirFile.files) {
      const subFile: ResolvedFile = this._resolveSubFile(dirFile, fileName);
      switch (subFile.stat) {
        case 'file':
        case 'copy':
          copyR( subFile.destABS, subFile.srcABS);
          break;
        case 'mkdir':
          mkdirR( subFile.destABS);
          break;
        case 'dir':
          // should cast to tail call !
          this._copyDir(subFile.files);
          break;
        default:
          throw new Error(`file.stat should not be ${subFile.stat}`);
      }
    }
  }

// class end
}

export async function repoCopy(destABS: string, opts: RepoConfig,
confName: string): Promise<void> {
  const gitlocal = await getRepo(opts.gitUrl);
  const rCopy = new RepoCopy(destABS, gitlocal.repoPath);
  const topLevelDir: ResolvedDirFile = {
    stat: 'dir',
    destABS: destABS,
    srcABS: gitlocal.repoPath,
    files: opts.files,
  };
  mkdirR(destABS);
  for (var fileName in topLevelDir.files) {
    const topSubFile = rCopy._resolveSubFile(topLevelDir, fileName);
    if (topSubFile.stat === 'dir') { // top level must be dir
      rCopy._copyDir(topSubFile);
    } else {
      throw new Error('top level must be a dir');
    }
  }
  const userScript = opts.script; // for flow
  if ( userScript != null ) {
    const arg = new AppTool(destABS,
      path.basename(destABS), confName, gitlocal);
    await userScript(arg);
  }
  return;
}

export type {
  AppTool,
};
