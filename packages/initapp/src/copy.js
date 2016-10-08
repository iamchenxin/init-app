// @flow
const fs = require('fs-extra');
const path = require('path');
const proc = require('child_process');
const semver = require('semver');
const paths = require('../config/config.js').paths;
import { print } from '../scripts/log.js';

type CopyConfig = {
  ignore?: Array<string>,
  include?: Array<string>,
};

function mustbeExist(path: string ): string {
  if ( !fs.existsSync(path) ) {
    throw new Error('un');
  }
  mustbe(fs.existsSync(path), true);
  return path;
}

function mustbe<T>(result: T, shouldBe: T): T {
  if ( result != shouldBe ) {
    throw new Error('un');
  }
  return result;
}

function mapFromKeys(keys?: Array<string>): {[key: string]: number} {
  const ob = {};
  if ( keys == null ) {
    return ob;
  }
  for (const key of keys) {
    ob[key] = ob[key] ? (ob[key] + 1) : 0;
  }
  return ob;
}

async function initApp(packageName: string, dst: string, config: CopyConfig) {
  const srcPath = await installPackage(packageName);
  return cpDir(srcPath, dst, config);
}

function cpDir(srcPath: string, dst: string, config: CopyConfig) {
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

// packageName is the same as in npm, like package package@latest
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
  initApp,
  cpDir,
};
