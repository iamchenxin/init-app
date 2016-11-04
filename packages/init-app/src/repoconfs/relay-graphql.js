// @flow
import type { RepoConfig, AppTool  } from '../component/repofile.js';

const COPY = 1;
const MKDIR = 2;
//const CHECK = 4;

function newPackage(appTool: AppTool) {
  try {
    appTool.mergePackageJson(
      // src package.json , the first is the main json (will be the default value)
      ['./packages/config-relay-graphql/package.json', './package.json'],
      './package.json', // dest save path
      [], // dependencies to excluded.
      ['lerna'] // devDependencies to excluded.
    );
  } catch (e) {
    throw new Error('buildPackage wrong');
  }
}

const copy: RepoConfig = {
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

const update: RepoConfig = {
  gitUrl: 'https://github.com/iamchenxin/init-app.git',
  commandName: 'lerna-conf',
  script: (appTool: AppTool) => {
    appTool.updatePackageJson(
      // src package.json , the first is the main json (will be the default value)
      ['./packages/config-relay-graphql/package.json', './package.json'],
      './package.json', // dest save path
      [], // dependencies to excluded.
      ['lerna'] // devDependencies to excluded.
    );
  },
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

module.exports = {
  copy,
  update,
};
