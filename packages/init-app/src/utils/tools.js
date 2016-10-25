/* @flow
 *
**/
const fs = require('fs-extra');
const util = require('util');
const base = require('../../config/base.js');
const path = require('path');
import {RepoFileError} from './error.js';

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
  mustbe(fs.existsSync(path), true);
  return path;
}

function mustbe<T>(value: mixed, shouldBe: T, err?: Error): T {
  if ( value != shouldBe ) {
    const defaultErr = new Error(
      `value(${format(value)}) shoulde be (${format(shouldBe)})`);
    throw err ? err : defaultErr;
  }
  return shouldBe;
}

function mustNot<T>(value: T, notBe: mixed, err?: Error): T {
  if ( value == notBe ) {
    const defaultErr = new Error(
      `value(${format(value)}) most not be (${format(notBe)})`);
    throw err ? err : defaultErr;
  }
  return value;
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

function copyR(dst: string, src: string) {
//  console.log(`src:(${src}) =>  (${dst})`);
  const srcStat = fs.statSync(src);
  if ( srcStat.isFile() ) {
    mkdirR(path.dirname(dst));
    const srcF = fs.createReadStream(src);
    srcF.pipe( fs.createWriteStream(dst));
  } else if (srcStat.isDirectory()) {

    mkdirR(dst);
    fs.readdirSync(src).map( subPath => {
      copyR(path.resolve(dst, subPath), path.resolve(src, subPath));
    });

  } else {
    throw new RepoFileError(`${dst} & ${src} should be File`);
  }
}

function mkdirR(dstABS: string): boolean {
  if (fs.existsSync(dstABS)) {
    if ( fs.statSync(dstABS).isDirectory()) {
      return true;
    } else {
      throw new RepoFileError(`"${dstABS}", should be a dir`);
    }
  }
  const parent = path.dirname(dstABS);
  mkdirR(parent);
  fs.mkdirSync(dstABS);
  return true;
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
  copyR,
  mkdirR,
};

export type {
  ObjectMap,
};
