// @flow
import { Git } from './git.js';
const path = require('path');
const fs = require('fs');
const COPY = 1;
const IGNORE = 2;
const CHECK = 4;
const RENAME = ':rename';
const FILES = ':files';

type DefaultRepo = {
  url: string,
  repoName: string,
  options: Array<CopyOptions>,
};

type CopyOptions = {
  path: string,
  package: {
    [key: string]:$Shape<PackageOptions>,
  },
};

type PackageOptions = {
  'rename'?: string,
  files?:{
    // string = copy and rename!
    // 1 ,2 ,4 = COPY, IGNORE , CHECK
    //
    [key: string]: PackageOptions_re|1|2|4|string,
  },
};
type PackageOptions_re = {
  'rename'?: string,
  files?:{
    // string = copy and rename!
    // 1 ,2 ,4 = COPY, IGNORE , CHECK
    //
    [key: string]: PackageOptions|1|2|4|string,
  },
};

async function copy(dstPath:string, srcRepo: DefaultRepo) {
  const git = new Git(srcRepo.url);
  const repoPath = await git.getRepo();

  for (const option of srcRepo.options) { // mutil - CopyOptions
    let srcPath = path.resolve(repoPath, option.path);
    for (const pkgName in option.package) { // mutil - package
      srcPath = path.resolve(srcPath, pkgName);
      copyByOption(dstPath, srcPath, option.package[pkgName]);
    }
  }
}

function copyByOption(dstPath:string, srcPath: string,pkg: PackageOptions) {
  for (const fileName in pkg.files) {
    let dstName:string = fileName;
    const fileNameValue = pkg.files[fileName];
    switch (typeof fileNameValue) {
      case 'object': // it is a dir
        const subSrc = path.resolve(srcPath, fileName);
        let subDst = path.resolve(dstPath, fileName);
        if (fileNameValue.rename) {
          subDst = path.resolve(dstPath, fileNameValue.rename);
        }
        // make an empty dir when 'data': {}
        if( fs.exists(subDst) == false) {
          fs.mkdirSync(subDst);
        }
        copyByOption(subDst, subSrc, fileNameValue);
        break;
      case 'string': // rename then pass to copy('number')
        dstName = fileNameValue;
      case 'number': // COPY|CHECK|IGNORE
        const stat = (typeof fileNameValue == 'number')?fileNameValue: COPY;
        if( COPY == stat) {
          fsCopy( path.resolve(dstPath, dstName),
            path.resolve(srcPath, fileName));
        }
        break;
      default:
        throw new Error('copyByOption broken PackageOptions');
    }

  }

}

function fsCopy(dst, src) {
  const stat = fs.statSync(src);
  if( stat.isFile() ){
    const srcF = fs.createReadStream(src);
    srcF.pipe( fs.createWriteStream(dst));
  } else if (stat.isDirectory()) {

    if( fs.existsSync(dst) == false) {

      fs.mkdirSync(dst);
    }
    fs.readdirSync(src).map( subPath => {
      fsCopy(path.resolve(dst, subPath), path.resolve(src, subPath));
    });
  } else {
    throw new Error('fsCopy should be File|Path');
  }
}

export {
  copy,
};
