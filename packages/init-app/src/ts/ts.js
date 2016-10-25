// @flow
/* eslint-disable */

import { spawn} from '../utils/child-process.js';
const stream = require('stream');
const child = require('child_process');
import { Git } from '../component/git.js';

const relayRepo = require('../data/relay-graphql.js');
import { RepoCopy } from '../component/repofile.js';
const path = require('path');

function ts() {

  const myw = new stream.Writable({
    write(chunk, encoding, done) {
      console.log(' iam here');
      done();
    },
  });

  spawn('git', ['clone','https://github.com/iamchenxin/ww.git','/home/iamchenxin/tmp/gt2'],
  //{ stdout: data => console.log(`DATA:\n ${data}`) },
  )
  .then(result => {
    console.log('~~~~~~~~finish');
  });
}

function ts2() {
  console.log('ts2');
  child.spawn('git', ['clone','https://github.com/iamchenxin/ww.git','/home/iamchenxin/tmp/gt2'], {stdio:['inherit', 'inherit', 'inherit']});
//  child.spawn('ls',['-a'],{stdio:'inherit'});
}

function ts3() {
//  console.log('ts3');
  spawn('git', ['clone','--depth' ,'2' ,'https://github.com/iamchenxin/ww.git','/home/iamchenxin/tmp/gt2'])
  .then (code => {
    console.log(code);
  })
  .catch(e => {
    console.log(e);
  });
//  child.spawn('ls',['-a'],{stdio:'inherit'});
}

function ts4() {
  const git = new Git(
    'https://github.com/iamchenxin/ww.git',
    '/home/iamchenxin/tmp/cache',
  );
  const repoP = git.getRepo({tagOrBr: 'v0.0.1'});
  repoP.then( path => console.log(path));
}

function ts5() {
//  copy('/home/iamchenxin/tmp/ts', relayRepo);
}
const fs = require('fs');
async function ts6() {
  const appName = 'man';
  const destDir = '/home/iamchenxin/tmp/ts88';
  const git = new Git(
    relayRepo.copy.gitUrl,
    '/home/iamchenxin/tmp/cache',
  );
  const repo = await git.getRepo();
  console.log(repo);
  const cp = new RepoCopy(path.resolve(destDir, appName), repo);
  cp.copy(relayRepo.copy);
}
ts6();
