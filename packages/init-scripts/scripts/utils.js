// 
var fs = require('fs');
var path = require('path');
const log = require('./log.js').log;

function rmdir(pathNames) {
  pathNames.forEach(function(pathName) {
    if (!fs.existsSync(pathName)) { return; }
    const stat = fs.statSync(pathName);
    if ( stat.isFile()) {
      rmfile(pathName);
    }
    if (stat.isDirectory()) {
      const subPaths = fs.readdirSync(pathName)
        .map(function(subPathName) {
          return path.resolve(pathName, subPathName);
        });
      rmdir(subPaths);
      fs.rmdirSync(pathName);
    }
  });
  function rmfile(name) {
    fs.unlinkSync(name);
  }
}

// Read .*rc file, like .babelrc
/*eslint consistent-return: 0*/
function readRC(filePath) {
  try {
    const buf = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(buf);
    return json;
  } catch (e) {
    log('Parse ', filePath, ' Error');
    log(e);
  }
}

module.exports = {
  rmdir: rmdir,
  readRC: readRC,
};
