import 'babel-polyfill';
import { print } from '../scripts/log.js';
import {
  cpDir,
  initApp,
} from './copy.js';



function ts() {
  const r = cpDir(
    '/home/iamchenxin/project/config/init-app/packages/init-app',
    '/home/iamchenxin/tmp/dk2',
    {
      ignore: ['__tests__', '__mocks__', 'node_modules'],
    }
  );
  console.log('rrr');
  print(r);
}

function ts2() {
  const r = initApp('config-relay-react', '/home/iamchenxin/tmp/dk3',
    {
      ignore: ['__tests__', '__mocks__', 'node_modules'],
    });
  r.then(rt => {
    console.log('rrr');
    print(rt);
  });
}

ts2();
