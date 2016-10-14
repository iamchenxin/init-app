/* @flow
**
*/

const { paths } = require('../../config/base.js');

import fs from 'fs-extra';
import { pro } from 'flow-dynamic';
const { isString } = pro;


class RcFile {
  cachePath: string;

  constructor(filePath) {
    try {
      const rcjson = fs.readJsonSync(filePath);
      this.cachePath = isString(rcjson.cachePath);
    } catch ( e ) {
      throw new Error(`error config file in ${filePath}`);
    }
  }

}

let rcFile: RcFile|null = null;
function getRcFile(): RcFile {
  if (rcFile == null) {
    rcFile = new RcFile(paths.rcFile);
  }
  return rcFile;
}

export {
  getRcFile,
};
