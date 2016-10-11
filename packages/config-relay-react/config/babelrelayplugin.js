const getBabelRelayPlugin = require('babel-relay-plugin');
const paths = require('./base.js').paths;

const schema = require(paths.schema);

const plugin = getBabelRelayPlugin(schema.data);

module.exports = plugin;
