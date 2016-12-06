// @flow
import type { RepoConfig, AppTool  } from '../component/repofile.js';
const COPY = 1;
//const MKDIR = 2;

const copy: RepoConfig = {
  gitUrl: 'https://github.com/iamchenxin/init-app.git',
  commandName: 'lerna-conf',
  script: newPackage,
  entries: {
    './packages/config-node':{
      dest:'.',
      'files': {
        '.babelrc': '.babelrc',
        '.flowconfig': COPY,
        'gulpfile.js': COPY,
  //      'package.json': COPY,
        'config': COPY,
        'src': COPY,
      },
    },

  },
};

const update: RepoConfig = {
  gitUrl: 'https://github.com/iamchenxin/init-app.git',
  commandName: 'lerna-conf',
  script: updatePackage,
  entries: {
    './packages/config-node':{
      dest:'.',
      'files': {
        '.babelrc': '.babelrc',
        '.flowconfig': COPY,
  //      'gulpfile.js': COPY,
  //      'package.json': COPY,
      },
    },

  },
};


function newPackage(appTool: AppTool) {
  try {

    const pJson = appTool.jsonSrc('./packages/config-node/package.json');
    const newPkg = appTool.createPackageJson(pJson);

    appTool.writeToDest('package.json', JSON.stringify(newPkg, null, 2));

  } catch (e) {
    throw new Error('buildPackage wrong');
  }
}

function updatePackage(appTool: AppTool) {
  const srcJson = appTool.jsonSrc('./packages/config-node/package.json');

  const appJson = appTool.jsonDest('./package.json');
  appJson.dependencies = appTool.mergeDep([srcJson, appJson]);
  appJson.devDependencies = appTool.mergeDevDep( [srcJson, appJson],
    ['lerna']);

  appTool.writeJsonToDest('./package.json', appJson);
}


module.exports = {
  copy,
  update,
};
