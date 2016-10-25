/* @flow
 *
**/
const fs = require('fs-extra');
const util = require('util');
const base = require('../../config/base.js');
const path = require('path');

function log() {
  console.log.apply(null, arguments);
}

function format(v: mixed): string {
  return util.inspect(v, {depth: null});
}

function print() {
  for (const v of arguments) {
    log(format(v));
  }
}

type ObjectMap = {
  [key: string]: mixed
};

function pathMustbeExist(path: string, eMsg?: string): string {
  if ( !fs.existsSync(path) ) {
    const defaultMsg = `${path} do not exist!`;
    throw new Error(eMsg ? eMsg : defaultMsg);
  }
  mustbe(fs.existsSync(path), true);
  return path;
}

function mustbe<T>(value: mixed, shouldBe: T, err?: Error): T {
  if ( value != shouldBe ) {
    const defaultErr = new Error(
      `result(${format(value)}) shoulde be (${format(shouldBe)})`);
    throw err ? err : defaultErr;
  }
  return shouldBe;
}

function mapFromKeys(keys?: Array<string>): {[key: string]: number} {
  const ob = {};
  if ( keys == null ) {
    return ob;
  }
  for (const key of keys) {
    ob[key] = ob[key] ? (ob[key] + 1) : 0;
  }
  return ob;
}

function replaceAt(str: string, repStr: string, idx: number): string {
  return str.substring(0, idx) + repStr + str.substring(idx + 1, str.length);
}

function resolveToHome(relativePath: string): string {
  mustbe(relativePath.length > 0, true);
  if ( '~' == relativePath[0]) {
    relativePath = replaceAt(relativePath, '.', 0);
  }
  return path.resolve(base.paths.home, relativePath);
}

function absolutePath(rPath: string): string {
  mustbe(rPath.length > 0, true);
  if ( '~' == rPath[0] ) {
    return resolveToHome(rPath);
  }
  return path.resolve(rPath);
}

export {
  log,
  format,
  print,
  pathMustbeExist,
  mustbe,
  mapFromKeys,
  absolutePath,
  resolveToHome,
};

export type {
  ObjectMap,
};
