#!/usr/bin/env babel-node
/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import 'babel-polyfill';
import fs from 'fs';
import path from 'path';
import { schema } from './schema';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';
import { paths } from '../config/base.js';

console.log(__dirname);
function updateSchema() {
  // Save JSON of full schema introspection for Babel Relay Plugin to use
  graphql(schema, introspectionQuery)
  .then( result => {
    if (result.errors) {
      console.error(
        'ERROR introspecting schema: ',
        JSON.stringify(result.errors, null, 2)
      );
    } else {
      const schemaPath = path.join(paths.data, './schema.json');
      console.log(schemaPath);
      fs.writeFileSync(
        schemaPath,
        JSON.stringify(result, null, 2)
      );
    }
  }).then( r => {
    // Save user readable type system shorthand of schema
    fs.writeFileSync(
      path.join(paths.data, './schema.graphql'),
      printSchema(schema, 'hierarchy')
    );
  }).catch( e => {
    throw e;
  });
}
updateSchema();
// // Save JSON of full schema introspection for Babel Relay Plugin to use
// (async () => {
//   const result = await (graphql(schema, introspectionQuery));
//   if (result.errors) {
//     console.error(
//       'ERROR introspecting schema: ',
//       JSON.stringify(result.errors, null, 2)
//     );
//   } else {
//     fs.writeFileSync(
//       path.join(__dirname, './schema.json'),
//       JSON.stringify(result, null, 2)
//     );
//   }
// })();
//
// // Save user readable type system shorthand of schema
// fs.writeFileSync(
//   path.join(__dirname, './schema.graphql'),
//   printSchema(schema, 'hierarchy')
// );
