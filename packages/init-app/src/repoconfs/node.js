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

    '.': {
      'files': {
        '.eslintignore': COPY,
        '.eslintrc.js': COPY,
        '.gitignore': COPY,
  //      'package.json': COPY,
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
        'gulpfile.js': COPY,
  //      'package.json': COPY,
      },
    },

    '.': {
      'files': {
        '.eslintignore': COPY,
        '.eslintrc.js': COPY,
        '.gitignore': COPY,
  //      'package.json': COPY,
      },
    },
  },
};


function newPackage(appTool: AppTool) {
  try {

    const pJson = appTool.jsonSrc('./packages/config-node/package.json');
    const pJson_ad = appTool.jsonSrc('./package.json');

    const newDep = appTool.mergeDep([pJson, pJson_ad]);
    const newDevDep = appTool.mergeDevDep([pJson, pJson_ad], ['lerna']);

    const newPkg = {
      name: appTool.appName,
      version: '0.1.0',
      'description': 'none',
      'author': getUser(),
      main: pJson.main ? pJson.main : '',
      files: pJson.files ? pJson.files : [],
      scripts: pJson.scripts ? pJson.scripts : {},
      dependencies: newDep,
      devDependencies: newDevDep,
      iappinfo: appTool.buildAppInfo(),
    };

    appTool.writeToDest('package.json', JSON.stringify(newPkg, null, 2));

  } catch (e) {
    throw new Error('buildPackage wrong');
  }
}

function updatePackage(appTool: AppTool) {
  const srcJson = appTool.jsonSrc('./packages/cconfig-node/package.json');
  const srcJson_ad = appTool.jsonSrc('./package.json');

  const appJson = appTool.jsonDest('./package.json');
  appJson.dependencies = appTool.mergeDep([srcJson, srcJson_ad, appJson]);
  appJson.devDependencies = appTool.mergeDevDep( [srcJson, srcJson_ad, appJson],
    ['lerna']);

  appTool.writeJsonToDest('./package.json', appJson);
}

function getUser() {
  return process.env['USER'];
}

module.exports = {
  copy,
  update,
};
