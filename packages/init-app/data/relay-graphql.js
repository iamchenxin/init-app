const a = {
  url: 'https://github.com/iamchenxin/init-app.git',
  repoName: 'init-app',

}

const COPY = 'copy';
const IGNORE = 'ignore';
const CHECK = 'check';
const RENAME = ':rename';
const FILES = ':files';
function getCp(appName) {
  const cp = {
    path: './init-app/packages',
    package:{
      'config-relay-graphql':{
        ':rename':`./${appName}`,
        ':files': {
          '.babelrc': COPY,
          '.flowconfig': COPY,
          'gulpfile.js': COPY,
          'package.json': CHECK,

          'config': COPY,

          'data':{}, // just mk an empty dirPath

          'src': COPY,
        },
      },
    },
  };
  const additional = {
    path: '.',
    package:{
      ':self': {
        ':rename': '.',
        ':files': {
          '.eslintignore': COPY,
          '.eslintrc.js': COPY,
          '.gitignore': COPY,
          'package.json': CHECK,
        },
      },
    },
  };
}

function buildPackage() {

}

const cp = {
  './init-app/packages/config-relay-graphql':{
    ':rename':'./'
  }
}
