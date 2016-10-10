// @flow
import {
  cpDir,
  installPackage,
} from './component/cmdtools.js';

function ts() {
  const modifiedFiles = cpDir(
    '/home/iamchenxin/project/config/init-app/packages/config-relay-react',
    '/home/iamchenxin/project/config/init-config/packages/config-relay-react',
    {
      ignore: ['lib', 'node_modules'],
    }
  );
  console.dir(modifiedFiles);
}

ts();
