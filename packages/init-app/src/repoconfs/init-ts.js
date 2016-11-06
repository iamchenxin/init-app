// this is for test only!
// import type { RepoConfig, AppTool  } from '../component/repofile.js';

const COPY = 1;

const copy = {
  gitUrl: 'https://github.com/iamchenxin/init-ts.git',
  commandName: 'single',
  entries: {
    '.': {
      'files': {
        '.gitignore': COPY,
        'README.md': COPY,
        'docs': COPY,
        'src': COPY,
      },
    },
  },
  script: (appTool) => {
    const newJ = appTool.createPackageJson(
      appTool.jsonSrc('./package.json') );
    appTool.writeJsonToDest('./package.json', newJ);
  },
};

const update = {
  gitUrl: 'https://github.com/iamchenxin/init-ts.git',
  commandName: 'single',
  entries: {
    '.': {
      'files': {
        '.gitignore': COPY,
        'README.md': COPY,
        'docs': COPY,
      },
    },
  },
  script: (appTool) => {
    const newJ = appTool.createPackageJson(
      appTool.jsonSrc('./package.json') );
    appTool.writeJsonToDest('./package.json', newJ);
  },
};

module.exports = {
  copy,
  update,
};
