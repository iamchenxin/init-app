// @flow
import { spawn, exec } from '../utils/child-process.js';
//import type { Exec, ExecOutPut } from '../utils/child-process.js';
import { RepoFileError } from '../utils/error.js';
import { log, mustbe } from '../utils/tools.js';
const fs = require('fs');
const path = require('path');
const rcFile = require('./rcfile.js');

type GetRepoOptions = {
  tag?: string,
};

class Git {
  url: string;
  cacheDir: string;
  repoName: string;
  repoPath: string;
  constructor(url: string, repoName: string, repoPath: string, cacheDir: string) {
    this.url = url;
    this.cacheDir = cacheDir;
    this.repoName = repoName;
    this.repoPath = repoPath;
  }

  _checkoutTagBr(repoPath: string, tagOrBr: string): Promise<string> {
    const subArg = isTag(tagOrBr) ? tagOrBr : `origin/${tagOrBr}`;
    process.stdout.write(`Checkout ${subArg}\n`);
    return spawn('git', ['checkout', subArg], {cwd: repoPath})
    .then( _ => repoPath );
  }

  _getRepoPath() {
    if (this.repoPath) {
      return this.repoPath;
    }
    log(`Repository(${this.repoName}) did not update yet, get repo from cache`);

    const repoPath = path.resolve(this.cacheDir, this.repoName);
    mustbe(true,
      fs.existsSync(repoPath) && fs.statSync(repoPath).isDirectory(),
      new Error(`The cached repo(${repoPath}) do not exist`));
    return repoPath;
  }

  _getHistoryFile(commit: string, filePath: string): Promise<string> {
    log(` cwd: ${this._getRepoPath()}`);
    return exec(`git show ${commit}:${filePath}`, {
      cwd: this._getRepoPath(),
      maxBuffer: 1024 * 1024,
    }).then( ([stdout, stderr]) => {
      if (stderr.length > 0) {
        throw new Error( stderr );
      }
      if ( stdout instanceof Buffer) {
        return stdout.toString();
      }
      return stdout;
    });
  }

}

async function getRepo(url: string, option?: GetRepoOptions): Promise<Git> {
  const cache = rcFile.cacheDir;
  const repoName = getRepoName(url);
  const tagOrBranch = ( option && option.tag ) ? option.tag : 'master';

  let localPath: string|null = await findRepoInDir(repoName, cache);
  if (null == localPath) {
    localPath = await _clone();
  } else {
    await _fetch(localPath);
  }

  const gitlocal = new Git(url, repoName, localPath, cache);
  gitlocal._checkoutTagBr(localPath, tagOrBranch);
  return gitlocal;

  // return the repository' path
  function _clone(): Promise<string> {
    return spawn('git', ['clone', url,
    path.resolve(cache, repoName)])
    .then( _ => {
      return findRepoInDir(repoName, cache)
      .then( repoPath => {
        if (repoPath) {
          return repoPath;
        }
        throw new RepoFileError(
          `After clone\n` +
          `url: ${url}\n` +
          `cache: ${cache}\n` +
          `repo: ${repoName}\n` +
          'can not find repo in cache');
      });
    });
  }

  function _fetch(repoPath: string): Promise<string> {
    console.log('Fetch');
    return spawn('git', ['fetch', 'origin'], {cwd: repoPath})
    .then( _ => repoPath );
  }
}

function isTag(tagOrBr: string): boolean {
  const reg = /^[v]?\d+\./;
  return reg.test(tagOrBr);
}

// https://github.com/iamchenxin/flow-dynamic.git
function getRepoName(gitUrl: string): string {
  const reg = /\/([\w\-_]+?)(.git)?$/;
  const rt = gitUrl.match(reg);
  if ( null == rt ) {
    throw new RepoFileError(`(${gitUrl}) is not a valid git path`);
  }
  return rt[1];
}

function findRepoInDir(repoName: string, dirPath: string): Promise<string|null> {
  return new Promise(function(resolve, reject) {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        return reject(err);
      }
      const rt = files.filter( file => file == repoName);
      if ( 1 === rt.length ) {
        return resolve(path.resolve(dirPath, repoName));
      } else {
        return resolve(null);
      }
    });
  });
}

export {
  getRepoName,
  getRepo,
};

export type {
  Git as GitLocal,
};
