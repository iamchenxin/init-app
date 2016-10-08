/* @flow
 *
**/
const fs = require('fs-extra');
const util = require('util');

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

function mustbe<T>(result: T, shouldBe: T, eMsg?: string): T {
  if ( result != shouldBe ) {
    const defaultMsg = `result(${format(result)}) shoulde be (${format(shouldBe)})`;
    throw new Error(eMsg ? eMsg : defaultMsg);
  }
  return result;
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

export {
  log,
  format,
  print,
  pathMustbeExist,
  mustbe,
  mapFromKeys,
};

export type {
  ObjectMap,
};
