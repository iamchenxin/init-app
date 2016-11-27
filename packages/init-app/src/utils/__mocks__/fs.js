// @flow
const { fs, _fsRecorder} = require.requireActual('../fs.js');

// ..........
class FS_Mock {
  mkdirSync: (path: string, mode?: number) => void;
  existsSync: (path: string) => boolean;
  statSync: Function;
  readdirSync: (path: string) => Array<string>;
  writeFileSync: ( filename: string, data: Buffer | string,
    options?: Object | string ) => void;
  readFileSync: Function;
  copyFile: typeof fs.copyFile;
  mkdirR: typeof fs.mkdirR;
  copyR: typeof fs.copyR;
  constructor() {
    this.mkdirSync = _fsRecorder.mock(fs.mkdirSync, 'mkdirSync_mock');
    this.existsSync = _fsRecorder.mock(fs.existsSync, 'existsSync_mock');
    this.statSync = _fsRecorder.mock(fs.statSync, 'statSync_mock');
    this.readdirSync = _fsRecorder.mock(fs.readdirSync, 'readdirSync_mock');
    this.writeFileSync = _fsRecorder.mock(fs.writeFileSync, 'writeFileSync_mock');
    this.readFileSync = _fsRecorder.mock(fs.readFileSync, 'readFileSync_mock');

    this.copyFile = _fsRecorder.mock(fs.copyFile, 'copyFile_mock');
    this.mkdirR = _fsRecorder.mock(fs.mkdirR, 'mkdirR_mock');
    this.copyR = _fsRecorder.mock(fs.copyR, 'copyR_mock');
  }
}

const fs_mock = new FS_Mock();

module.exports = {
  fs: fs_mock,
  FS: FS_Mock,
  _fsRecorder,
};
