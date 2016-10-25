/* @flow
**/
import type { RepoFile } from './repofile.js';

function requireConf(repoName: string): RepoFile {
  return require('../data/relay-graphql.js');
}
/*
function loadConf(repoName: string): RepoFile {


  return {
    copy: {},
    update: {},
  };
}
*/
export {
  requireConf,
//  loadConf,
};
