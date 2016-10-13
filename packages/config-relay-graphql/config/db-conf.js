// @flow
const pg = require('pg');

const pool = new pg.Pool({
  user: 'iamchenxin',
  password: '135790',
  host: 'localhost',
  database: 'nwordt1',
  max: 10,
  idleTimeoutMillis: 1000,
});

module.exports = {
  pool,
};
