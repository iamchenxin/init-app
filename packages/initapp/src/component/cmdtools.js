// @flow
const fs = require('fs-extra');
const path = require('path');
const proc = require('child_process');
const paths = require('../../config/config.js').paths;
import {
  mustbe,
  mapFromKeys,
  pathMustbeExist,
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
  const stat = testPackageName(packageName);
  switch ( stat ) {
    case 'npm':
      return installFromNPM(packageName);
    case 'local':
      return installFromLocal(packageName);
  }
  return Promise.reject('not a valid package name|path: ${packageName}');
}

type PackageLocation = 'npm'|'local'|'unknown';
function testPackageName(packageName: string): PackageLocation {
  const npm_exp = /^[a-zA-z_]\w+@{0,1}[\w\.]*$/;
  const local_exp = /^[\.\/~].+/;
  if ( packageName.match(npm_exp) ) {
    return 'npm';
  } else if (packageName.match(local_exp)) {
    return 'local';
  }
  return 'unknown';
}

function installFromNPM(packageName: string): Promise<string> {
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

function installFromLocal(packagePath: string): Promise<string> {
  return new Promise(function(resolve, reject) {
    const fullPath = path.resolve(packagePath);
    pathMustbeExist(path.resolve(fullPath, 'package.json'),
      `${fullPath} is not a valid npm package. Must have a package.json in it`);
    resolve(fullPath);
  });
}

export {
  cpDir,
  installPackage,
  testPackageName,
};
export type {
  IappConfig,
};
