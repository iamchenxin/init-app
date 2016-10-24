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


  _resolveSubFile(up: ResolvedDirFile, subFileName: string): ResolvedFile {
    let stat: 'file'|'copy'|'mkdir' = 'file';
    let relativeDestDir = 'parent';
    let _dest = subFileName;
    let _src = subFileName;
    const srcABS = path.resolve(up.srcABS, subFileName);
    let destDir = up.destABS;
    const subFile: RcFile = up.files[subFileName];

    console.log(subFileName);
    switch (typeof subFile) {
      case 'object':
        relativeDestDir = subFile.relativeDir? subFile.relativeDir: relativeDestDir;
        _dest =  subFile.dest? subFile.dest : _dest;
        destDir = (relativeDestDir == 'parent')? up.destABS: this.destRoot;
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
    //  console.log(subFile, fileName);
        throw new Error('pkgfile broken _getInnerPkg');
    }

    return {
      stat:stat,
      destABS: path.resolve(destDir, _dest),
      srcABS: srcABS,
    };
  }

  _copyDir(up: ResolvedDirFile ) {

    for (const fileName in up.files) {
      const subFile: ResolvedFile = this._resolveSubFile(up, fileName);
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
    for (var fileName in topLevelDir.files) {
      const topSubFile = this._resolveSubFile(topLevelDir, fileName);
      if (topSubFile.stat === 'dir') { // DirPackageType
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
  const stat = fs.statSync(src);
  if( stat.isFile() ){
    const srcF = fs.createReadStream(src);
    srcF.pipe( fs.createWriteStream(dst));
  } else if (stat.isDirectory()) {
    if( fs.existsSync(dst) == false) {
      fs.mkdirSync(dst);
    }
    fs.readdirSync(src).map( subPath => {
      fsCopy(path.resolve(dst, subPath), path.resolve(src, subPath));
    });
  } else {
    throw new Error('fsCopy should be File|Path');
  }
}

function fsMkdir(dst: string) {
  fs.mkdirSync(dst);
}
