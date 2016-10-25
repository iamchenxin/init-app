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
        '.babelrc': '.babelrc',
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
function buildPackage(packageJson, packageJson_ad, appName) {
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

    const pkg = {
      name: appName,
      version: "0.1.0",
      "description": "none",
      "author": getUser(),
      main: p1.main?p1.main:'',
      files: p1.files?p1.files:[],
      scripts: p1.scripts?p1.scripts:{},
  //    dependencies:
    }

  } catch (e) {
      throw new Error('buildPackage wrong');
  }

}

type Dep = {
  [key: string]: mixed,
};
// merge dependencies & devDependencies
function mergeDep(deps: Array<Dep>, excludePkgs: Array<string>) {
  const exclude = arrayToMap(excludePkgs);
  const newDep = {};
  for (const dep of deps) {
    for (var key in dep) {
      if(exclude.get(key)!=true){
        newDep[key] = dep[key];
      }
    }
  }
  return newDep;
}

function arrayToMap(ar: Array<string>): Map<string, boolean> {
  const map:Map<string, boolean> = new Map();
  for (const v of ar) {
    map.set(v, true);
  }
  return map;
}

function getUser() {
  return process.env['USER'];
}


module.exports = options;
