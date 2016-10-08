//
const util = require('util');

function log() {
  console.log.apply(null, arguments);
}

function format(v) {
  return util.inspect(v, {depth: null});
}

function print() {
  for (const v of arguments) {
    log(format(v));
  }
}

module.exports = {
  log: log,
  format: format,
  print: print,
};
