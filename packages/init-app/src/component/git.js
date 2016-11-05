// @flow
import { spawn, exec } from '../utils/child-process.js';
//import type { Exec, ExecOutPut } from '../utils/child-process.js';
import { RepoFileError } from '../utils/error.js';
import { log, mustbe, mustNot, format } from '../utils/tools.js';
const fs = require('fs');
const path = require('path');
const rcFile = require('./rcfile.js');

type GetRepoOptions = {
  tag?: string,
};

type GitLog = {
  commit: string,
  Author: string,
  Date: string,
  message: string,
};

function parseGitLog(msgStr: string|Buffer): GitLog {
  msgStr = (msgStr instanceof Buffer) ? msgStr.toString() : msgStr;
  const msgs = msgStr.split('\n').filter(m => m.length > 0);
  mustbe(4, msgs.length, `GitLog: unknown format.\n ${format(msgs)}`);
  const commit = mustNot(null,
    msgs[0].match(/^commit[\W]+(\w+)/),
    `GitLog: can not find commit.\n ${format(msgs)}`
  )[1];
  const Author = mustNot(null,
    msgs[1].match(/^Author[\W]+(\w+)[ ]*(<[\w@\.]+>)?$/),
    `GitLog: can not find Author.\n ${format(msgs)}`
  )[1];
  const date = mustNot(null,
    msgs[2].match(/^Date[\W]+(\w+[^\t\v\n]+)/),
    `GitLog: can not find Date.\n ${format(msgs)}`
  )[1];
  const message = mustNot(null,
    msgs[3],
    `GitLog: These is not commit message. ${format(msgs)}`
  ).trim();

  const logMsg = {
    commit: commit,
    Author: Author,
    Date: date,
    message: message,
  };
  return logMsg;
}

class Git {
  url: string;
  cacheDir: string;
  repoName: string;
  repoPath: string;
  tag: ?string;
  commit: ?string;
  constructor(url: string, repoName: string, repoPath: string, cacheDir: string) {
    this.url = url;
    this.cacheDir = cacheDir;
    this.repoName = repoName;
    this.repoPath = repoPath;
    this.tag = null;
    this.commit = null;
  }

  async _checkoutTagBr(tagOrBr: string): Promise<string> {
    let subArg = `origin/${tagOrBr}`;
    if ( isTag(tagOrBr) ) {
      subArg = tagOrBr;
      this.tag = subArg;
    }
    log(`Checkout ${subArg}\n`);
    await exec(`git checkout ${subArg}`,
      {cwd: this.repoPath});
    const log_rt = await exec('git log -1',
      {cwd: this.repoPath});
    const gitLog = parseGitLog(log_rt[0]);
    this.commit = gitLog.commit;
    return this.repoPath;
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
  await gitlocal._checkoutTagBr( tagOrBranch);
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
  parseGitLog,
  Git,
};

export type {
  Git as GitLocal,
};
