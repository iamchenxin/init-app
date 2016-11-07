/* @flow
 *
**/
const fs = require('./fs').fs;
const util = require('util');
const base = require('../../config/base.js');
const path = require('path');


function log() {
  console.log.apply(null, arguments);
}

function warn() {
  console.warn.apply(null, arguments);
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
  mustbe(true, fs.existsSync(path));
  return path;
}

function mustbe<T>(shouldBe: T, value: mixed, errMsg?: Error|string): T {
  if ( value != shouldBe ) {
    let err = new Error(
      `value(${format(value)}) shoulde be (${format(shouldBe)})`);
    if ( typeof errMsg == 'string') {
      err = new Error(errMsg);
    }
    if ( errMsg instanceof Error) {
      err = errMsg;
    }
    throw err;
  }
  return shouldBe;
}

function mustNot<T, N>(notBe: N, value: T|N, errMsg?: Error|string): T {
  if ( value == notBe ) {
    let err = new Error(
      `value(${format(value)}) most not be (${format(notBe)})`);
    if ( typeof errMsg == 'string') {
      err = new Error(errMsg);
    }
    if ( errMsg instanceof Error) {
      err = errMsg;
    }
    throw err;
  }
  return (value: any);
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

function arrayToMap(ar?: Array<string>): Map<string, boolean> {
  const map:Map<string, boolean> = new Map();
  if (ar == null) { return map; }
  for (const v of ar) {
    map.set(v, true);
  }
  return map;
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
  warn,
  format,
  print,
  pathMustbeExist,
  mustbe,
  mustNot,
  mapFromKeys,
  arrayToMap,
  absolutePath,
  resolveToHome,
};

export type {
  ObjectMap,
};
