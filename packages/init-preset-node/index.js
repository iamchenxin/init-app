/* current version node v6.8.1
 * http://node.green/
*/

// trailing commas, will add in Nodejs7
const syntaxTrailingFunctionCommas = require('babel-plugin-syntax-trailing-function-commas');
// will add in Nodejs7
const transformAsyncToGenerator = require('babel-plugin-transform-async-to-generator');
//
const transformCommonjs = require('babel-plugin-transform-es2015-modules-commonjs');
// strip Flow Types
const transformFlowStripTypes = require('babel-plugin-transform-flow-strip-types');

module.exports = {
  plugins: [
    syntaxTrailingFunctionCommas,
    transformAsyncToGenerator,
    transformCommonjs,
    transformFlowStripTypes,
  ],
};
