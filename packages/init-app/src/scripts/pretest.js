// @flow
//import { init } from '../command/commands.js';
import { requireConf } from '../component/confloader.js';
// import { Git } from '../component/git.js';
import { repoCopy } from '../component/repofile.js';
import { test_mock } from '../../config/base.js';
import { mkdirR } from '../utils/tools.js';
const path = require('path');

async function prepareTest() {
  try {
    createTestDirs();
    for (const appName in test_mock.base.testRepo) {
      const repoName = test_mock.base.testRepo[appName];
      await initRepo(appName, repoName);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function createTestDirs() {
  mkdir_log(test_mock.base.testDir);
  mkdir_log(test_mock.base.testAppDir);
  mkdir_log(test_mock.base.rcDir);

  mkdir_log(test_mock.rcfile.cacheDir);
  mkdir_log(test_mock.rcfile.extRepoConfs);

  function mkdir_log(dirPath) {
    console.log(`Make Dir: ${dirPath}`);
    mkdirR(dirPath);
  }
}

async function initRepo(appPath, repoName) {
  const confFile = requireConf(repoName, test_mock.rcfile);
  const destPath = path.resolve(test_mock.base.testAppDir, appPath);
  console.log(`\nInit Test Env:` +
    `\n[Repo]: cache->'${test_mock.rcfile.cacheDir})', repoName->'${repoName}'` +
    `\n[App]: path->'${destPath}'\n`
  );

  await repoCopy(destPath, confFile.copy, repoName, test_mock.rcfile.cacheDir);
}
prepareTest();
