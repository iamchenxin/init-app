// @flow
import type { CopyConfig  } from '../util/repofile.js';

const COPY = 1;
const MKDIR = 2;
const CHECK = 4;

const options: CopyConfig = {
  gitUrl: 'https://github.com/iamchenxin/init-app.git',
  commandName: 'lerna-conf',
  files: {
    './packages/config-relay-graphql':{
      dest:'.',
      'files': {
        '.babelrc': COPY,
        '.flowconfig': COPY,
        'gulpfile.js': COPY,
        'package.json': COPY,
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
        'package.json': COPY,
      },
    },
  }
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




module.exports = options;
