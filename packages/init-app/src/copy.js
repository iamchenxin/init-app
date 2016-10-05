// @flow
const fs = require('fs-extra');
const path = require('path');
const proc = require('child_process');
const semver = require('semver');
const paths = require('../config/config.js').paths;

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

async function exec(packageName: string, dst: string, config: CopyConfig) {
  const srcPath = await installPackage(packageName);
  cpDir(srcPath, dst, config);
}

function cpDir(srcPath: string, dst: string, config: CopyConfig) {
  mustbe(fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory(), true);
  // let ignoreNames = [];
  // if ( config.ignore ) {
  //   ignoreNames = config.ignore.filter( name =>
  //     name && (name[0] == '.' || name[0] == '/') );
  // }
  const dstPath = path.normalize(dst);
  fs.mkdirsSync(dstPath);
  const ignoreNameMap = mapFromKeys(config.ignore);
  console.log('to copy ...');
  console.log(srcPath, dstPath);
  _cpDir(srcPath, dstPath);

// ------------- function
  function _cpDir(srcDir: string, dstDir: string) {
    const dirs = fs.readdirSync(srcDir);
    console.dir(dirs);
    dirs.filter( fileName => ignoreNameMap.hasOwnProperty(fileName) == false)
    .map( fileName => {
      const subSrcPath = path.resolve(srcDir, fileName);
      const srcRelative = path.relative(srcDir, subSrcPath);
      if ( ignoreNameMap.hasOwnProperty(srcRelative) ) {
        return;
      }
      const subDstPath = path.resolve(dstDir, fileName);
      const srcStat = fs.statSync(subSrcPath);
      if ( srcStat.isFile() ) {
        console.log(subDstPath);
        fs.copySync(subSrcPath, subDstPath);
      } else if ( srcStat.isDirectory() ) {
        _cpDir(subSrcPath, subDstPath);
      }
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
  exec,
  cpDir,
};
