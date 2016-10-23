// @flow
/*
const cp:CopyOptions = {
  package:{
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
type CopyConfig = {
  [key: string]: PackageType,
};

type PackageType = {
  stat?: 'dir'|'file', // default is 'dir'
  dest?: string, // dest path, default is the name of this package
  relativeDir?: 'approot'|'parent', // default is parent
  files?: {
    [key: string]: PackageFileOption,
  },
};

const COPY = 1;
const MKDIR = 2;
const CHECK = 4;
type PackageFileOption =
  PackageType|
  1|2|4|  // 1 ,2 ,4 = COPY, MKDIR , CHECK
  string; // rename this file.

// dest path, default is the name of this option
// src path, default is the name of this option
type InnerPackageType = {
  stat: 'dir'|'file'|'copy'|'mkdir', // default is 'dir'
  destABS: string,
  srcABS: string,
  files?: {
    [key: string]: PackageFileOption,
  },
};


class PkgCopy {
  destRoot:string;
  srcRoot:string;
  constructor(destPath:string, srcPath: string ) {
    this.destRoot = destPath;
    this.srcRoot = srcPath;
  }
  copy(opts: CopyConfig) {
    for (const pkgName in opts) {
      this._copyPackage(opts[pkgName], pkgName, this.destRoot, this.srcRoot);
    }
  }

  _resolvePkgOption(node: PackageFileOption, upName:string,
  destUpPath: string, srcUpPath: string): InnerPackageType {
    let stat:'dir'|'file'|'copy'|'mkdir' = 'file';
    let relativeDestDir = 'parent';
    let _dest = upName;
    let _src = upName;
    const srcABS = path.resolve(srcUpPath, upName);

    switch (typeof node) {
      case 'object':
        stat = node.stat? node.stat : stat;
        relativeDestDir = node.relativeDir? node.relativeDir: relativeDestDir;
        _dest =  node.dest? node.dest : _dest;
        destUpPath = (relativeDestDir == 'parent')? destUpPath: this.destRoot;
        break;
      case 'string': // rename
        _dest = node;
        break;
      case 'number': // COPY|MKDIR|IGNORE
        if ( node == COPY ) {
          stat = 'copy';
        } else if ( node === MKDIR) {
          stat = 'mkdir';
        }
        break;
      default:
        throw new Error('pkgfile broken _getInnerPkg');
    }

    return {
      stat:stat,
      destABS: path.resolve(destUpPath, _dest),
      srcABS: srcABS,
      files: node.files,
    };
  }

  _copyPackage( pkg: PackageFileOption, upName:string, destUp: string, srcUp:string ) {
    const { destABS, srcABS, files, stat } =
      this._resolvePkgOption(pkg, upName, destUp, srcUp);
    switch (stat) {
      case 'file':
      case 'copy':
        fsCopy( destABS, srcABS);
        break;
      case 'mkdir':
        fsMkdir( destABS);
      case 'dir':
        for (const nodeName in files) {
          return this._copyPackage(files[nodeName], nodeName, destABS, srcABS);
        }
      default:
        throw new Error(`innerPkg.stat should not be ${stat}`);
    }
  }
}

function fsCopy(dst: string, src: string) {
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
