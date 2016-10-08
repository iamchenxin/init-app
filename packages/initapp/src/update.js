/* @flow
 *
**/
const fs = require('fs-extra');
const path = require('path');
import {
  cpDir,
  installPackage,
} from './component/cmdtools.js';
import { updatePackageJson } from './component/updatepackage.js';

async function update(srcName: string, _dstDir: string) {
  const dstDir = path.resolve(_dstDir); // make sure it is absolute path
  const srcPath = await installPackage(srcName);
  const modifiedFiles = cpDir(srcPath, dstDir, {
    ignore: ['__tests__', '__mocks__', 'node_modules', 'src', 'package.json'],
  });
  const appJSONPath = path.resolve(dstDir, 'package.json');
  const newPackageJSON = updatePackageJson(
    fs.readJsonSync(appJSONPath),
    fs.readJsonSync(path.resolve(srcPath, 'package.json'))
  );
  fs.writeJsonSync(appJSONPath, newPackageJSON);
  return modifiedFiles;
}

export {
  update,
};
