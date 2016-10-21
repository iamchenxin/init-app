const path = require('path');
const home = process.env.HOME? process.env.HOME: process.cwd();

module.exports = {
  cacheDir: path.resolve(home, './.init-app/cache'),
};
