import { copyR, mkdirR, arrayToMap, log } from '../utils/tools.js';
const base = require('../../config/base.js');
const fs = require('fs');
const iapprc = require('../template/iapprc.js');
const { rcDir, rcFile, rcFileTpl } = base.paths;
const { cacheDir, extRepoConfs} = iapprc;

function makeRCFold() {
  mkdirR_Unexist(rcDir, `Config Fold already exist! ${rcDir}`);
  mkdirR_Unexist(cacheDir, `Cache Fold already exist! ${cacheDir}`);
  mkdirR_Unexist(extRepoConfs, `RepoConfs Fold already exist! ${extRepoConfs}`);

  log(`Copy ${rcFileTpl} to ${rcFile}`);
  copyR(rcFile, rcFileTpl);
//  log(`Copy ${rcFileTpl} to ${rcFile}`);
}

function mkdirR_Unexist(dirPath: string, msg: string) {
  if ( fs.existsSync(rcDir)) {
    log(msg);
  } else {
    mkdirR(rcDir);
    log(`${rcDir} --> is Maked`);
  }
}

makeRCFold();
