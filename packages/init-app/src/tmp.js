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

ts();
