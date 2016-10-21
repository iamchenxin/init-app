// @flow
import {
  cpDir,
//  installPackage,
} from './component/cmdtools.js';

function ts() {
  const modifiedFiles = cpDir(
    '/home/iamchenxin/project/config/init-app/packages/initapp',
    '/home/iamchenxin/project/config/initapp',
    {
      ignore: ['lib', 'node_modules'],
    }
  );
  console.dir(modifiedFiles);
}

async function as() {
  return new Promise(function(resolve, reject) {
    setTimeout( () => {
      resolve('heheh');
    }, 2000);
  });
}

async function as2() {
  console.log('---------');
  const v = await as();
  console.log(v);
}

as2();
