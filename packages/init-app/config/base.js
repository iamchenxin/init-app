// @flow
const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd());
function resolveAppRoot(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.

// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders

// We will export `nodePaths` as an array of absolute paths.
// It will then be used by Webpack configs.
// Jest doesn’t need this because it already handles `NODE_PATH` out of the box.

var nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .map(resolveAppRoot);

const home = process.env.HOME ? process.env.HOME : process.cwd();

const paths = {
  packageJson: resolveAppRoot('package.json'),
  nodeModules: resolveAppRoot('node_modules'),
  ownNodeModules: resolveAppRoot('node_modules'),
  babelrc: resolveAppRoot('.babelrc'),
  nodePaths: nodePaths,
  home: home,
  appRoot: appDirectory,
  // ---
  src: resolveAppRoot('src'),
  dst: resolveAppRoot('lib'),
  rcDir: path.resolve(home, './.init-app'),
  rcFile: path.resolve(home, './.init-app/iapprc.js'),
  rcFileTpl: resolveAppRoot('./lib/template/iapprc.js'),
};

// test config.
const testDir_mock = path.resolve(paths.appRoot, 'tpjest');
function toTestDir(relativePath) {
  return path.resolve(testDir_mock, relativePath);
}
const testAppDir_mock = toTestDir('./app');
const rcDir_mock = toTestDir('./.init-app');
const rcFile_mock = toTestDir('./.init-app/iapprc.js');
const test_mock = {
  base:{
    testDir: testDir_mock,
    testAppDir:testAppDir_mock,
    rcDir: rcDir_mock,
    rcFile: rcFile_mock,
  },
  rcfile: {
    cacheDir: path.resolve(rcDir_mock, 'cache'),
    extRepoConfs: path.resolve(rcDir_mock, 'repoconfs'),
    singleRepo: 'init-ts',
    multiRepo: 'relay-graphql',
  }
};

module.exports = {
  paths: paths,
  test_mock: test_mock,
};
