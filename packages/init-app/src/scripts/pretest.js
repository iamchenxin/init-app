// @flow
import { init } from '../command/commands.js';
import { requireConf } from '../component/confloader.js';
// import { Git } from '../component/git.js';
import { repoCopy } from '../component/repofile.js';
import { test_mock } from '../../config/base.js';
import { mkdirR } from '../utils/tools.js';
const path = require('path');

async function prepareTest() {
  try {
    createTestDirs();
    await initRepo('single', test_mock.rcfile.singleRepo);
//    const git = new Git()

    // const mul_rt = await init('lerna', {
    //   repoName: test_mock.rcfile.multiRepo,
    //   npminstall: false,
    // });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function createTestDirs() {
  console.log(test_mock.base);
  mkdirR(test_mock.base.testDir);
  mkdirR(test_mock.base.testAppDir);
  mkdirR(test_mock.base.rcDir);

  console.log(test_mock.rcfile);
  mkdirR(test_mock.rcfile.cacheDir);
  mkdirR(test_mock.rcfile.extRepoConfs);
}

async function initRepo(appPath, repoName) {
  const confFile = requireConf(repoName, test_mock.rcfile);
  const destPath = path.resolve(test_mock.base.testAppDir, appPath);
  await repoCopy(destPath, confFile.copy, repoName, test_mock.rcfile.cacheDir);
}

prepareTest();
