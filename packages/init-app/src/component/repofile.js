/* @flow
 *
**/

const path = require('path');
const fs = require('fs');
const semver = require('semver');
//import {RepoFileError} from '../utils/error.js';
import { copyR, mkdirR, arrayToMap } from '../utils/tools.js';

export type RepoFile = {
  copy: CopyConfig,
  update: CopyConfig,
};

export type CopyConfig = {
  gitUrl: string,
  commandName: string,
  script?: (appInfo: AppInfo) => void,
  files: RcFiles,
};

class AppInfo {
  destABS: string;
  srcABS: string;
  appName: string;
  mergeDep: (pJsons: Array<Object>, excludePkgs?: Array<string>) => Dep;
  mergeDevDep: (pJsons: Array<Object>, excludePkgs?: Array<string>) => Dep;
  constructor(destABS: string, srcABS: string, appName: string) {
    this.destABS = destABS;
    this.srcABS = srcABS;
    this.appName = appName;
  }
  packageJsonSrc(relativePath: string): Object {
    return JSON.parse( fs.readFileSync(
      path.resolve(this.srcABS, relativePath), 'utf8') );
  }
  packageJsonDest(relativePath: string): Object {
    return JSON.parse( fs.readFileSync(
      path.resolve(this.destABS, relativePath), 'utf8') );
  }
  writeToDest(relativePath: string, data: string) {
    return fs.writeFileSync(path.resolve(this.destABS, relativePath),
          data);
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

export class RepoCopy {
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

  async copy(opts: CopyConfig): Promise<void> {
    const topLevelDir: ResolvedDirFile = {
      stat: 'dir',
      destABS: this.destRoot,
      srcABS: this.srcRoot,
      files: opts.files,
    };
    mkdirR(this.destRoot);
    for (var fileName in topLevelDir.files) {
      const topSubFile = this._resolveSubFile(topLevelDir, fileName);
      if (topSubFile.stat === 'dir') { // top level must be dir
        this._copyDir(topSubFile);
      } else {
        throw new Error('top level must be a dir');
      }
    }
    const done = opts.script; // for flow
    if ( done != null ) {
      const arg = new AppInfo(this.destRoot,
        this.srcRoot, path.basename(this.destRoot));
      const rt = await done(arg);
    }
    return;
  }
// class end
}

export type {
  AppInfo,
};
