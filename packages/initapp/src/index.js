#! /usr/bin/env node
/* @flow
 * use `npm link` to link to global bin folder
**/
import 'babel-polyfill';
const yargs = require('yargs');
import {
  initApp,
} from './init.js';

function commandList() {
  const init = {
    command: 'init <appName>',
    describe: 'init an App by given package',
    builder: function(subYargs) {
      return subYargs.usage('usage: $0 init <AppName>')
      .demand(1);
    },
    handler: function(argv) {
      initApp(argv.package, argv.appName, {
        ignore: ['__tests__', '__mocks__', 'node_modules'],
      });
    },
  };

  const update = {
    command: 'update <appName>',
    describe: 'update the configs of an app by given package',
    builder: function(subYargs) {
      return subYargs.usage('usage: $0 update <AppName>')
      .demand(1);
    },
    handler: function(argv) {
      console.log('not implement');
    },
  };

  yargs.command(init).command(update)
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

commandList();
