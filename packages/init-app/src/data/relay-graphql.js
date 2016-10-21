// @flow


const COPY = 1;
const TOUCH = 2;
const CHECK = 4;
const RENAME = ':rename';
const FILES = ':files';
type CopyOptions = {
  path: string,
  package: {
    [key: string]:$Shape<PackageOptions>,
  },
};

type PackageOptions = {
  'rename'?: string,
  files?:{
    // string = copy and rename!
    // 1 ,2 ,4 = COPY, TOUCH , CHECK
    //
    [key: string]: PackageOptions_re|1|2|4|string,
  },
};

type PackageOptions_re = {
  'rename'?: string,
  files?:{
    // string = copy and rename!
    // 1 ,2 ,4 = COPY, TOUCH , CHECK
    //
    [key: string]: PackageOptions|1|2|4|string,
  },
};

function getCp(appName) {
  const cp:CopyOptions = {
    path: './packages',
    package:{
      'config-relay-graphql':{
        'rename': appName,
        'files': {
          '.babelrc': COPY,
          '.flowconfig': COPY,
          'gulpfile.js': COPY,
          'package.json': CHECK,

          'config': COPY,

          'data':{ // just mk an empty dirPath
          // none rename means keeps old name.
          },

          'src': COPY,
        },
      },
    },
  };
  const additional:CopyOptions = {
    path: '.',
    package:{
      '.': {
        'rename': '.',
        'files': {
          '.eslintignore': COPY,
          '.eslintrc.js': COPY,
          '.gitignore': COPY,
          'package.json': CHECK,
        },
      },
    },
  };
  return [cp, additional];
}
const fs = require('fs');
function buildPackage(packageJson, packageJson_ad) {
  try {
    const p1 = JSON.parse( fs.readFileSync(packageJson) ) ;
    const p_ad = JSON.parse( fs.readFileSync(packageJson_ad) ) ;

    const devDep_dv = p_ad.devDependencies;
    delete devDep_dv['lerna'];

    const newDevDep = Object.assign({}, p1.devDependencies);
    for (const key in devDep_dv) {
      if (newDevDep.hasOwnProperty(key)==false) {
        newDevDep[key] = devDep_dv[key];
      }
    }
  } catch (e) {
    throw new Error('buildPackage wrong');
  }

}


const repoCopy = {
  url: 'https://github.com/iamchenxin/init-app.git',
  repoName: 'init-app',
  options: getCp('testapp'),
};


module.exports = repoCopy;
