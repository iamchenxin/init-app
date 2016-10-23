// @flow

import { spawn} from '../util/child-process.js';
const stream = require('stream');
const child = require('child_process');
import { Git } from '../util/git.js';
import { copy } from '../util/copybyoptions.js';
const relayRepo = require('../data/relay-graphql.js');
import { PkgCopy } from '../util/repofile.js';
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
  const appName = 'hehe';
  const destDir = '/home/iamchenxin/tmp/ts2';
  const git = new Git(
    relayRepo.gitUrl,
    '/home/iamchenxin/tmp/cache',
  );
  const repo = await git.getRepo();
  console.log(repo);
  const cp = new PkgCopy(path.resolve(destDir,appName), repo);
//  fs.mkdirSync(path.resolve(destDir,appName));
  cp.copy(relayRepo);
}
ts6();