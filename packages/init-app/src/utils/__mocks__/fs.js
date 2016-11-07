// @flow
const { fs, FS} = require.requireActual('../fs.js');

type CmdList = Array< {
  cmd: string,
  args: string[],
  result: mixed,
}>;

type FlattedCmd = {
  cmd: string,
  calls: Array<{
    result: mixed,
    order: number, // the called indexes.
  }>
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
      oldFcmd.calls.push({
        order: cmdOrder,
        result: result,
      });
    } else {
      argsTocmd.set(flattedArgs, {
        cmd: cmd,
        calls: [{
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

}

class FS_Mock {
  mkdirSync: (path: string, mode?: number) => void;
  existsSync: (path: string) => boolean;
  statSync: Function;
  readdirSync: (path: string) => Array<string>;
  writeFileSync: ( filename: string, data: Buffer | string,
    options?: Object | string ) => void;
  readFileSync: Function;
  constructor() {
    this.mkdirSync = node_fs.mkdirSync;
    this.existsSync = node_fs.existsSync;
    this.statSync = node_fs.statSync;
    this.readdirSync = node_fs.readdirSync;
    this.writeFileSync = node_fs.writeFileSync;
    this.readFileSync = node_fs.readFileSync;
  }
}
const fsRecorder = new FsRecorder();

function copyFile_mock(dst: string, src: string) {
  fsRecorder.pushCommand('copyFile', [dst, src]);
}

function mkdirSync_mock(dst: string) {
  const result = fs_real.mkdirSync(dst);
  fsRecorder.pushCommand('mkdirSync', [dst], result);
  return result;
}

function existsSync_mock(dst: string) {
  const result = fs_real.existsSync(dst);
  fsRecorder.pushCommand('existsSync', [dst], result);
  return result;
}

function statSync_mock(dst: string) {
  const result = fs_real.statSync(dst);
  fsRecorder.pushCommand('statSync', [dst], result);
  return result;
}

function readdirSync_mock(dst: string) {
  const result = fs_real.readdirSync(dst);
  fsRecorder.pushCommand('readdirSync', [dst], result);
  return result;
}

function writeFileSync_mock(dst: string) {
  const result = fs_real.writeFileSync(dst);
  fsRecorder.pushCommand('writeFileSync', [dst], result);
  return result;
}

function readFileSync_mock(dst: string) {
  const result = fs_real.readFileSync(dst);
  fsRecorder.pushCommand('readFileSync', [dst], result);
  return result;
}


function mkdirR_mock(dst: string) {
  const result = fs_real.mkdirR(dst, lfs);
  fsRecorder.pushCommand('mkdirR', [dst], result);
  return result;
}

function copyR_mock(dst: string) {
  const result = fs_real.copyR(dst);
  fsRecorder.pushCommand('copyR', [dst], result);
  return result;
}

const lfs = {
  mkdirSync: mkdirSync_mock,
  existsSync: existsSync_mock,
  statSync: statSync_mock,
  readdirSync: readdirSync_mock,
  writeFileSync: writeFileSync_mock,
  readFileSync: readFileSync_mock,
  // custom
  copyFile: copyFile_mock,
  mkdirR: mkdirR_mock,
  copyR: copyR_mock,
};

module.exports = {
  fs: lfs,
  fs_real: fs,
  fsRecorder,
};
