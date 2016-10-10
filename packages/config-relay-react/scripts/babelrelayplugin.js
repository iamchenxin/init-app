const getBabelRelayPlugin = require('babel-relay-plugin');
const paths = require('../config/config.js').paths;

const schema = require(paths.schema);

const plugin = getBabelRelayPlugin(schema.data);

module.exports = plugin;
