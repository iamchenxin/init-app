#! /usr/bin/env node
/* @flow
 * use `npm link` to link to global bin folder
**/
// import 'babel-polyfill'; // nodejs v6 do not need this!
const yargs = require('yargs');
import { init, update } from './command/commands.js';
import { getConfNames } from './component/confloader.js';
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
    describe: 'init an App by a given git repo',
    builder: function(subYargs) {
      return subYargs.usage('usage: $0 init <AppName>')
      .demand(1);
    },
    handler: function(argv) {
      console.log(`Init a new App(${argv.appName})`);
      console.log(`With Package: ${argv.repo}`);
      init(argv.appName, {
        repoName: argv.repo,
      }).then( result => {
        console.dir(result);
      });
    },
  };

  const updateCMD = {
    command: 'update <appDir>',
    describe: 'update the configs of an app by given git repo',
    builder: function(subYargs) {
      return subYargs.usage('usage: $0 update <appDir>')
      .demand(1);
    },
    handler: function(argv) {
      console.log('update app config ...');
      update(argv.appDir, {
        repoName: argv.repo,
      }).then( result => {
        console.dir(result);
      });
    },
  };

  yargs.command(initCMD).command(updateCMD)
  .option('reponame', {
    alias: 'r',
    describe: 'offical repo name',
    choices: getConfNames(),
//    demand: true,
    type: 'string',
  })
  .option('conf', {
    alias: 'c',
    describe: 'repo config file path, directly load by path',
//    demand: true,
    type: 'string',
  })
  .global('repo')
  .global('conf')
  .help()
  .alias('h', 'help')
  .completion('completion')
  .recommendCommands()
  .wrap(null)
//  .wrap(yargs.terminalWidth())
  .argv;
}

commandList();
