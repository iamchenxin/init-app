#! /usr/bin/env node
/* @flow
 * use `npm link` to link to global bin folder
**/
import 'babel-polyfill';
const yargs = require('yargs');
import { initApp } from './init.js';
import { update } from './update.js';
process.on('unhandledRejection', (reason, promise) => {

  console.log(`Unhandled Rejection.
reason: ${reason}
\nAt Promise:`, promise);
  throw reason;

//  console.log(`Unhandled Rejection. \n reason: ${reason}`);
  // application specific logging, throwing an error, or other logic here
});


function commandList() {
  const initCMD = {
    command: 'init <appName>',
    describe: 'init an App by given package',
    builder: function(subYargs) {
      return subYargs.usage('usage: $0 init <AppName>')
      .demand(1);
    },
    handler: function(argv) {
      console.log(`Init a new App(${argv.appName})`);
      console.log(`With Package: ${argv.package}`);
      initApp(argv.package, argv.appName)
      .then( result => {
        console.dir(result);
      });
    },
  };

  const updateCMD = {
    command: 'update <appDir>',
    describe: 'update the configs of an app by given package',
    builder: function(subYargs) {
      return subYargs.usage('usage: $0 update <appDir>')
      .demand(1);
    },
    handler: function(argv) {
      console.log('update app config ...');
      update(argv.package, argv.appDir)
      .then( result => {
        console.dir(result);
      });
    },
  };

  yargs.command(initCMD).command(updateCMD)
  .option('package', {
    alias: 'p',
    describe: 'offical package',
    choices: ['config-react', 'config-relay-react'],
//    demand: true,
    type: 'string',
  })
  .option('custompackage', {
    alias: 'c',
    describe: 'custom package location',
//    demand: true,
    type: 'string',
  })
  .global('package')
  .global('custompackage')
  .help()
  .alias('h', 'help')
  .completion('completion')
  .recommendCommands()
  .argv;
}

commandList();
