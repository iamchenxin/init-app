// @flow
/*
const cp:CopyOptions = {
  files:{
    './packages/config-relay-graphql':{
      'stat': 'dir',
      'destPath': appName,
      'files': {
        '.babelrc': COPY,
        '.flowconfig': COPY,
        'gulpfile.js': COPY,
        'package.json': CHECK,

        'config': COPY,

        'data':{ // just mk an empty dirPath
        // none rename means keeps old name.
        },

        'src': COPY,
      },
    },
  },
};
*/

const path = require('path');
const fs = require('fs');
import {RepoFileError} from './error.js';
export type CopyConfig = {
  gitUrl: string,
  commandName: string,
  files: RcFiles,
};


export type RcObjectFile = {
  stat?: 'dir'|'file', // default is 'dir'
  dest?: string, // dest path, default is the name of this package
  relativeDir?: 'approot'|'parent', // default is parent
  files?: RcFiles,
};
const COPY = 1;
const MKDIR = 2;
const CHECK = 4;
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


export class PkgCopy {
  destRoot:string;
  srcRoot:string;
  constructor(destPath:string, srcPath: string ) {
    this.destRoot = destPath;
    this.srcRoot = srcPath;
  }


  _resolveSubFile(dirFile: ResolvedDirFile, subFileName: string): ResolvedFile {
    let stat: 'file'|'copy'|'mkdir' = 'file';
    let relativeDestDir = 'parent';
    let _dest = subFileName;
    let _src = subFileName;
    const srcABS = path.resolve(dirFile.srcABS, subFileName);
    let destDir = dirFile.destABS;
    const subFile: RcFile = dirFile.files[subFileName];

    console.log(subFileName);
    switch (typeof subFile) {
      case 'object':
        relativeDestDir = subFile.relativeDir? subFile.relativeDir: relativeDestDir;
        _dest =  subFile.dest? subFile.dest : _dest;
        destDir = (relativeDestDir == 'parent')? dirFile.destABS: this.destRoot;
        const files = subFile.files; // to make flow pass.
        if ( files != null) {
          return {
            stat:'dir',
            destABS: path.resolve(destDir, _dest),
            srcABS: srcABS,
            files: files,
          }
        };
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
        throw new Error('pkgfile broken _getInnerPkg');
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
          fsCopy( subFile.destABS, subFile.srcABS);
          break;
        case 'mkdir':
          fsMkdir( subFile.destABS);
          break;
        case 'dir':
          // should cast to tail call !
          this._copyDir(subFile.files);
          break;
        default:
          throw new Error(`innerPkg.stat should not be ${subFile.stat}`);
        }
    }
  }

  copy(opts: CopyConfig) {

    const topLevelDir: ResolvedDirFile = {
      stat: 'dir',
      destABS: this.destRoot,
      srcABS: this.srcRoot,
      files: opts.files,
    };
    fsMkdir(this.destRoot);
    for (var fileName in topLevelDir.files) {
      const topSubFile = this._resolveSubFile(topLevelDir, fileName);
      if (topSubFile.stat === 'dir') { // top level must be dir
        this._copyDir(topSubFile);
      } else {
        throw new Error('top level must be dir');
      }
    }
  }
// class end
}



function fsCopy(dst: string, src: string) {
//  console.log(`src:(${src}) =>  (${dst})`);
  const srcStat = fs.statSync(src);
  if( srcStat.isFile() ){
    fsMkdir(path.dirname(dst));
    const srcF = fs.createReadStream(src);
    srcF.pipe( fs.createWriteStream(dst));
  } else if (srcStat.isDirectory()) {

    fsMkdir(dst);
    fs.readdirSync(src).map( subPath => {
      fsCopy(path.resolve(dst, subPath), path.resolve(src, subPath));
    });

  } else {
    throw new Error('fsCopy should be File|Path');
  }
}

function fsMkdir(dstABS: string): boolean {
  if (fs.existsSync(dstABS)) {
    if( fs.statSync(dstABS).isDirectory()) {
      return true;
    } else {
      throw new RepoFileError(`"${dstABS}", should be a dir`);
    }
  }
  const parent = path.dirname(dstABS);
  fsMkdir(parent);
  fs.mkdirSync(dstABS);
  return true;
}


function getAllPath(pathABS: string): Array<string> {
  const paths: string[] = [];
  let curPath = pathABS;
  while (curPath != '/') {
    curPath = path.dirname(curPath);
    paths.push(curPath);
  }
//  paths.reverse();
  return paths;
}
