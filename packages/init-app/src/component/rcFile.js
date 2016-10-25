// @flow
const base = require('../../config/base.js');
import { resolveToHome } from '../utils/tools.js';
import { pro } from 'flow-dynamic';

type RcFile = {
  cacheDir: string,
};

function getDefaultRc(rcPath): RcFile {
  try {
    // Flow do not allow dynamic require, so use FlowFixMe to get a any type
    /* $FlowFixMe - or Adding module.ignore_non_literal_requires=true to the [options] */
    const rc:any = require(rcPath);
    rc.cacheDir = rc.cacheDir ? rc.cacheDir : resolveToHome('./.init-app/cache');
    // and use flow-dynamic to check the rc to a fixed type
    return {
      cacheDir: pro.isString(rc.cacheDir),
    };
  } catch (e) {
    throw new Error(`rcFile broken!\n ${e.message}`);
  }
}

module.exports = getDefaultRc(base.paths.rcFile);
