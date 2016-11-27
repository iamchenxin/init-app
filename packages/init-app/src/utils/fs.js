/* @flow
 *
**/
const node_fs = require('fs');
const path = require('path');
import {RepoFileError} from './error.js';

// $PropertyType<T, 'x'>
// type StatSync = $Type<node_fs.statSync>;

class FS {
  _ori_fs: typeof node_fs;
  mkdirSync: (path: string, mode?: number) => void;
  existsSync: (path: string) => boolean;
  statSync: typeof node_fs.statSync;
  readdirSync: (path: string) => Array<string>;
  writeFileSync: ( filename: string, data: Buffer | string,
    options?: Object | string ) => void;
  readFileSync: typeof node_fs.readFileSync;
  constructor(ori_fs: typeof node_fs) {
    if ( ori_fs == null) {
      throw new Error('invalid fs');
    }
    this._ori_fs = ori_fs;
    this.mkdirSync = ori_fs.mkdirSync;
    this.existsSync = ori_fs.existsSync;
    this.statSync = ori_fs.statSync;
    this.readdirSync = ori_fs.readdirSync;
    this.writeFileSync = ori_fs.writeFileSync;
    this.readFileSync = ori_fs.readFileSync;
  }

  copyFile(destABS: string, srcABS: string): void {
    return this.writeFileSync(destABS,
      this.readFileSync(srcABS));
  }

  //  make dir recursivly
  mkdirR(dstABS: string): boolean {
    if (this.existsSync(dstABS)) {
      if ( this.statSync(dstABS).isDirectory()) {
        return true;
      } else {
        throw new RepoFileError(`"${dstABS}", should be a dir`);
      }
    }
    const parent = path.dirname(dstABS);
    this.mkdirR(parent);
    this.mkdirSync(dstABS);
    return true;
  }

  // ToDo: should allow copy file -> dir
  copyR(dst: string, src: string) {
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

const fs = new FS(node_fs);

// for mocks
type CmdList = Array< {
  cmd: string,
  args: string[],
  result: mixed,
}>;

type FlattedCmd = {
  [cmd: string] : Array<{
    result: mixed,
    order: number, // the called indexes.
  }>, // value is calls
};
type ArgsToCmd = Map<string, FlattedCmd>; // key is flatted Args.

class FsRecorder {
  cmdList: CmdList|null;
  argsTocmd: ArgsToCmd|null;
  constructor() {
    this.cmdList = null;
    this.argsTocmd = null;
  }

  clean() {
    this.cmdList = null;
    this.argsTocmd = null;
  }

  pushCommand(cmd: string, args: string[], result: mixed ) { // cause ...args can not be typed
    if ( null == this.cmdList ) {
      this.cmdList = [];
    }
    const cmdlist = this.cmdList; // const to declare will not modify this value.
    cmdlist.push({
      cmd, args, result,
    });
    const cmdOrder = cmdlist.length;

    if ( null == this.argsTocmd ) {
      this.argsTocmd = new Map();
    }
    const argsTocmd = this.argsTocmd;
    const flattedArgs = args.join(',');
    const oldFcmd = argsTocmd.get(flattedArgs);
    if ( oldFcmd ) {
      const calls = oldFcmd[cmd];
      if ( calls ) {
        calls.push({
          order: cmdOrder,
          result: result,
        });
      } else {
        oldFcmd[cmd] = [{
          order: cmdOrder,
          result: result,
        }];
      }
    } else {
      argsTocmd.set(flattedArgs, {
        [cmd]: [{
          order: cmdOrder,
          result: result,
        }],
      });
    }

    return cmdlist.length;
  }

  getArgsMap() {
    return this.argsTocmd;
  }

  mock<FN: Function>(fn: FN, fnName: string): FN {
    const rFn: any = (...args) => {
      const result = (fn: any).apply(this, args);
      this.pushCommand(fnName, args, result);
      return result;
    };
    // $FlowFixMe: do not allow this ?
    Object.defineProperty(rFn, 'name', { writable: true });
    rFn.name = fnName;
    return rFn;
  }
}

const fsRecorder = new FsRecorder();

module.exports = {
  fs: fs,
  FS: FS,
  _fsRecorder: fsRecorder,
};
