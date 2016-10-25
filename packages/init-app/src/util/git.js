// @flow
import { spawn} from '../util/child-process.js';
import {RepoFileError } from './error.js';
const fs = require('fs');
const path = require('path');
const rcFile = require('./rcFile.js');

type GetRepoOptions = {
  tagOrBr?: string,
};

class Git {
  url: string;
  cacheDir: string;
  repoName: string;
  constructor(url: string) {
    this.url = url;
    this.cacheDir = rcFile.cacheDir;
    this.repoName = getRepoName(this.url);
  }

  // return the repository' path
  _clone(): Promise<string> {
    const cache = this.cacheDir;
    return spawn('git', ['clone', this.url,
    path.resolve(this.cacheDir, this.repoName)])
    .then( _ => {
      const repoName = this.repoName;
      return findRepoInDir(repoName, cache)
      .then( repoPath => {
        if (repoPath) {
          return repoPath;
        }
        throw new RepoFileError(
          `After clone\n` +
          `url: ${this.url}\n` +
          `cache: ${cache}\n` +
          `repo: ${repoName}\n` +
          'can not find repo in cache');
      });
    });
  }

  _fetch(repoPath: string): Promise<string> {
    console.log('Fetch');
    return spawn('git', ['fetch', 'origin'], {cwd: repoPath})
    .then( _ => repoPath );
  }

  _checkoutTagBr(repoPath: string, tagOrBr: string): Promise<string> {
    const subArg = isTag(tagOrBr) ? tagOrBr : `origin/${tagOrBr}`;
    process.stdout.write(`Checkout ${subArg}\n`);
    return spawn('git', ['checkout', subArg], {cwd: repoPath})
    .then( _ => repoPath );
  }

  // return the repository' path
  getRepo(option?: GetRepoOptions): Promise<string> {
    const repoName = this.repoName;
    const cache = this.cacheDir;
    let tagOrBr: null|string = null;
    if ( option && option.tagOrBr ) {
      tagOrBr = option.tagOrBr;
    }

    return findRepoInDir(repoName, cache)
    .then( repoPath => {
      if ( null == repoPath) {
        return this._clone();
      }
      // keep update to the new version
      return this._fetch(repoPath);
    }).then( repoPath => {
      if (tagOrBr) {
        return this._checkoutTagBr(repoPath, tagOrBr);
      }
      return this._checkoutTagBr(repoPath, 'master');
    });
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
  Git,
};
