// @flow
import type { CopyConfig, AppInfo  } from '../util/repofile.js';

const COPY = 1;
const MKDIR = 2;
const CHECK = 4;

const copy: CopyConfig = {
  gitUrl: 'https://github.com/iamchenxin/init-app.git',
  commandName: 'lerna-conf',
  script: newPackage,
  files: {
    './packages/config-relay-graphql':{
      dest:'.',
      'files': {
        '.babelrc': '.babelrc',
        '.flowconfig': COPY,
        'gulpfile.js': COPY,
  //      'package.json': COPY,
        'config': COPY,
        'data': MKDIR,
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

const update: CopyConfig = {
  gitUrl: 'https://github.com/iamchenxin/init-app.git',
  commandName: 'lerna-conf',
  script: updatePackage,
  files: {
    './packages/config-relay-graphql':{
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


function newPackage(appInfo: AppInfo) {
  try {

    const pJson = appInfo.packageJsonSrc('./packages/config-relay-graphql/package.json');
    const pJson_ad = appInfo.packageJsonSrc('./package.json');

    const newDep = appInfo.mergeDep([pJson, pJson_ad]);
    const newDevDep = appInfo.mergeDevDep([pJson, pJson_ad], ['lerna']);

    const newPkg = {
      name: appInfo.appName,
      version: '0.1.0',
      'description': 'none',
      'author': getUser(),
      main: pJson.main ? pJson.main : '',
      files: pJson.files ? pJson.files : [],
      scripts: pJson.scripts ? pJson.scripts : {},
      dependencies: newDep,
      devDependencies: newDevDep,
    };

    appInfo.writeToDest('package.json', JSON.stringify(newPkg, null, 2));

  } catch (e) {
    throw new Error('buildPackage wrong');
  }
}

function updatePackage(appInfo: AppInfo) {
  const srcJson = appInfo.packageJsonSrc('./packages/config-relay-graphql/package.json');
  const srcJson_ad = appInfo.packageJsonSrc('./package.json');

  const appJson = appInfo.packageJsonDest('./package.json');
  appJson.dependencies = appInfo.mergeDep([srcJson, srcJson_ad, appJson]);
  appJson.devDependencies = appInfo.mergeDevDep( [srcJson, srcJson_ad, appJson],
    ['lerna']);

  appInfo.writeToDest('./package.json', JSON.stringify(appJson, null, 2));
}



function getUser() {
  return process.env['USER'];
}


module.exports = {
  copy,
  update,
};
