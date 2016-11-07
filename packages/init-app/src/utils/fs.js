/* @flow
 *
**/
const node_fs = require('fs');
const path = require('path');
import {RepoFileError} from './error.js';

const lfs = {
  mkdirSync: node_fs.mkdirSync,
  existsSync: node_fs.existsSync,
  statSync: node_fs.statSync,
  readdirSync: node_fs.readdirSync,
  writeFileSync: node_fs.writeFileSync,
  readFileSync: node_fs.readFileSync,
  // custom
  copyFile: copyFile,
  mkdirR: mkdirR,
  copyR: copyR,
  sss:'REAL!!!',
};

function copyFile(destABS: string, srcABS: string): void {
  return lfs.writeFileSync(destABS,
    lfs.readFileSync(srcABS));
}

//  make dir recursivly
function mkdirR(dstABS: string, env?: any): boolean {
//  console.log(lfs);
  if ( env == null ) {
    env = lfs;
  }
//  console.log(env);
  if (env.existsSync(dstABS)) {
    if ( env.statSync(dstABS).isDirectory()) {
      return true;
    } else {
      throw new RepoFileError(`"${dstABS}", should be a dir`);
    }
  }
  const parent = path.dirname(dstABS);
  mkdirR(parent, env);
  env.mkdirSync(dstABS);
  return true;
}

// ToDo: should allow copy file -> dir
function copyR(dst: string, src: string) {
//  console.log(`src:(${src}) =>  (${dst})`);
  const srcStat = lfs.statSync(src);
  if ( srcStat.isFile() ) {
    lfs.mkdirR(path.dirname(dst));
    lfs.copyFile(dst, src);
  } else if (srcStat.isDirectory()) {

    lfs.mkdirR(dst);
    lfs.readdirSync(src).map( subPath => {
      lfs.copyR(path.resolve(dst, subPath), path.resolve(src, subPath));
    });

  } else {
    throw new RepoFileError(`${dst} & ${src} should be File`);
  }
}
// $PropertyType<T, 'x'>
// type StatSync = $Type<node_fs.statSync>;

class FS {
  mkdirSync: (path: string, mode?: number) => void;
  existsSync: (path: string) => boolean;
  statSync: typeof node_fs.statSync;
  readdirSync: (path: string) => Array<string>;
  writeFileSync: ( filename: string, data: Buffer | string,
    options?: Object | string ) => void;
  readFileSync: typeof node_fs.readFileSync;
  constructor() {
    this.mkdirSync = node_fs.mkdirSync;
    this.existsSync = node_fs.existsSync;
    this.statSync = node_fs.statSync;
    this.readdirSync = node_fs.readdirSync;
    this.writeFileSync = node_fs.writeFileSync;
    this.readFileSync = node_fs.readFileSync;
  }

  copyFile(destABS: string, srcABS: string): void {
    return this.writeFileSync(destABS,
      this.readFileSync(srcABS));
  }

  //  make dir recursivly
  mkdirR(dstABS: string): boolean {
  //  console.log(lfs);
  //  console.log(env);
    if (this.existsSync(dstABS)) {
      if ( this.statSync(dstABS).isDirectory()) {
        return true;
      } else {
        throw new RepoFileError(`"${dstABS}", should be a dir`);
      }
    }
    const parent = path.dirname(dstABS);
    mkdirR(parent);
    this.mkdirSync(dstABS);
    return true;
  }

  // ToDo: should allow copy file -> dir
  copyR(dst: string, src: string) {
  //  console.log(`src:(${src}) =>  (${dst})`);
    const srcStat = this.statSync(src);
    if ( srcStat.isFile() ) {
      this.mkdirR(path.dirname(dst));
      this.copyFile(dst, src);
    } else if (srcStat.isDirectory()) {

      this.mkdirR(dst);
      this.readdirSync(src).map( subPath => {
        this.copyR(path.resolve(dst, subPath), path.resolve(src, subPath));
      });

    } else {
      throw new RepoFileError(`${dst} & ${src} should be File`);
    }
  }

}

const fs = new FS();

const fsRecorder = {
  cmdList: {},
  argsTocmd: {},
  clean: () => {},
};

module.exports = {
  fs: fs,
  FS: FS,
  fsRecorder,
};
