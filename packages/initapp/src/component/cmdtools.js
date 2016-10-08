// @flow
const fs = require('fs-extra');
const path = require('path');
const proc = require('child_process');
const paths = require('../../config/config.js').paths;
import {
  mustbe,
  mapFromKeys,
} from './simpletools.js';

type IappConfig = {
  ignore?: Array<string>,
  include?: Array<string>,
};

function cpDir(srcPath: string, dst: string, config: IappConfig) {
  mustbe(fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory(), true);
  const dstPath = path.normalize(dst);
  fs.mkdirsSync(dstPath);
  const ignoreMap = mapFromKeys(config.ignore);
  return _cpDir(srcPath, dstPath);

// ------------- function
  function _cpDir(srcDir: string, dstDir: string) {
    const dirs = fs.readdirSync(srcDir);
    return dirs.map( fileName => {
      const subSrcPath = path.resolve(srcDir, fileName);
      const subDstPath = path.resolve(dstDir, fileName);
      const srcRelative = path.relative(srcDir, subSrcPath);
      const srcStat = fs.statSync(subSrcPath);

      let result = `!unknown ERROR! --- ${fileName}`;
      if ( ignoreMap.hasOwnProperty(srcRelative) ||
        ignoreMap.hasOwnProperty(fileName)  ) {
        result = `!ignore ---  ${fileName}`;
      } else if ( srcStat.isFile() ) {
        fs.copySync(subSrcPath, subDstPath);
        result = fileName;
      } else if ( srcStat.isDirectory() ) {
        result = _cpDir(subSrcPath, subDstPath);
      }
      return result;
    });
  }
}

// packageName is as the same as in npm, like package package@latest
// return the installed package's full path.
function installPackage(packageName: string): Promise<string> {
  return new Promise(function(resolve, reject) {
    const args = [
      'install', '--save-dev', '--save-exact', packageName,
    ];
    const npmInstall = proc.spawn('npm', args, {stdio: 'inherit'});
    npmInstall.on('close', code => {
      if (code !== 0) {
        reject('`npm ' + args.join(' ') + '` failed');
      }
      const pureName = packageName.split('@')[0];
      const packagePath = path.resolve(paths.nodeModules, pureName);
      resolve(packagePath);
    });
  });
}

export {
  cpDir,
  installPackage,
};
export type {
  IappConfig,
};
