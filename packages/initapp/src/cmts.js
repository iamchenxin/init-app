#! /usr/bin/env node
// @flow
const yargs = require('yargs');

const cmd = {
  command: 'get <source> [proxy]',
  describe: 'make a get HTTP request',
  builder: {
    banana: {
      default: 'cool',
    },
    batman: {
      default: 'sad',
    },
  },
  handler: function(argv) {
    // do something with argv.
    console.log('got a get!');
  },
};

function mycmd() {
  const args = yargs
  .command('init <AppName>', 'init an App by given template!',
    function(yargs) {
      return yargs
      .usage('usage: $0 init <AppName> [options]')
      .demand(1);
    },
    function(argv) {
      console.log('init!');
      console.dir(argv);
    }
  )
  .command('update <AppName>', 'update an App to given template',
    function(yargs) {
      return yargs
      .usage('usage: $0 update <AppName> [options]')
      .demand(1);
    },
    function(argv) {
      console.log('update!');
      console.dir(argv);
    }
  )
  .option('package', {
    alias: 'p',
    describe: 'package location',
    demand: true,
    type: 'string',
  })
  .global('package')
  .help()
  .alias('h', 'help')
  .completion('completion')
  .recommendCommands()
  .argv;
}

function ts2() {
  const args = yargs
  .option('gall', {
    alias: 'g',
    default: true,
    describe: 'global all',
  })
  .option('lall', {
    alias: 'l',
    default: true,
    describe: 'local all',
  })
  .global('gall')
  .command(
    'get',
    'make a get HTTP request~~~',
    function(yargs) {
      return yargs.option('url', {
        alias: 'u',
        demand: true,
        describe: 'the URL to make an HTTP request to',
      });
    },
    function(argv) {
      console.log(`get : ${argv.url}`);
    }
  )
  .help()
  .alias('h', 'help')
  .completion('completion')
  .argv;
  console.dir(args);
}

function ts() {
  const args = yargs.command(cmd)
  .help()
  .completion('completion')
  .argv;

  console.log('.......');
  console.dir(args);
}

mycmd();
