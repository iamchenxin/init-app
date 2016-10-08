// @flow
const fs = require('fs-extra');
const path = require('path');
import {
  cpDir,
  installPackage,
} from './component/cmdtools.js';
import { regeneratePackageJSON } from './component/genpackage.js';

async function initApp(packageName: string, dstDir: string) {
  const srcPath = await installPackage(packageName);
  const modifiedFiles = cpDir(srcPath, dstDir, {
    ignore: ['__tests__', '__mocks__', 'node_modules'],
  });
  const packageJSONPath = path.resolve(dstDir, 'package.json');
  const content = fs.readFileSync(packageJSONPath, 'utf8');
  const newPackageJSON = regeneratePackageJSON(JSON.parse(content), {
    name: path.basename(dstDir),
    author: String(process.env['USER']),
  });
  fs.writeFileSync(packageJSONPath,
    JSON.stringify(newPackageJSON, null, 2),
    'utf8'
  );

  return modifiedFiles;
}

export {
  initApp,
};
