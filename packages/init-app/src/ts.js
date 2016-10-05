import 'babel-polyfill';

import {
  cpDir
} from './copy.js';


cpDir(
  '/home/iamchenxin/project/config/init-app/packages/init-app/scripts',
  '/home/iamchenxin/tmp/dk',
  {
    ignore: ['__tests__'],
  }
);
