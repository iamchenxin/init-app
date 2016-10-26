/* @flow */
import { SpawnError } from './error.js';
//import { promisify } from './promise.js';
//const colors = require('colors/safe');
const child = require('child_process');

type OnData = (chunk: string) => void;

type SpawnOptions = {
  cwd?: string,
  env?: Object,
  stdio?: string | Array<any>,
  detached?: boolean,
  uid?: number,
  gid?: number,
  display?: 'ignore'|'show'|OnData,
};

// git use readline to display compelex output,
// seems readline will handle all of stdio. not sure how to listen it.
// so  readline set to -> 'inherit'. (just pass through)
function spawn(
  command: string,
  args: Array<string>,
  opts: $Shape<SpawnOptions> = {},
): Promise<number> {
  // set default value for opts
  opts.display = opts.display ? opts.display : 'show';
  //
  opts.stdio = 'ignore';
  const onData = (typeof opts.display == 'function') ? opts.display : null;

  if (typeof opts.display == 'function') {
    opts.stdio = ['inherit', 'pipe', 'pipe'];
  } else if (opts.display == 'show') {
    opts.stdio = ['inherit', 'inherit', 'inherit'];
  }

  return new Promise(function(resolve, reject) {


    const cproc = child.spawn(command, args, opts );

// process data ..
    if ( onData != null) {
      cproc.stdout.on('data', chunk => onData(chunk.toString()) );
      cproc.stdout.on('end', () => {
    //    process.stdout.write(colors.yellow('finish\n'));
      });
    }

//  process error
    let procErr:null|Error = null;
    let stderrMsg:string|null = null;
    cproc.on('error', (error: Error) => {
      procErr = error;
    });

    if ( cproc.stderr != null) {
      cproc.stderr.on('data', chunk => {
        stderrMsg += chunk.toString();
      });
    }

//  reject & resolve
    cproc.on('close', (code, signal) => {

      let errorMsg = procErr ?
        `Process: ${procErr.message}\n` : '';
      errorMsg += stderrMsg ?
        `stderr: ${stderrMsg}\n` : '';

      if ( code != 0 )  {
        const err = new SpawnError([
          'Command failed.',
          `Exit code: ${code}`,
          `Command: ${command}`,
          `Arguments: ${args.join(' ')}`,
          `Directory: ${opts.cwd || process.cwd()}`,
          `Error:\n${errorMsg}`,
        ].join('\n'));
        err.EXIT_CODE = code;
        reject(err);
      } else {
        resolve(code);
      }
    });
  });
}

export {
  spawn,
};
