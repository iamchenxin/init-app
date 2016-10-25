const path = require('path');
// Because this is a independent config file , so do not refer to other files.
const home = process.env.HOME ? process.env.HOME : process.cwd();

module.exports = {
  cacheDir: path.resolve(home, './.init-app/cache'),
  extRepoConfs: path.resolve(home, './.init-app/repoconfs'),
};
