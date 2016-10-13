/* @flow */
import express from 'express';
import graphQLHTTP from 'express-graphql';
//import path from 'path';
import {schema} from './schema.js';
//const proxy = require('express-http-proxy');
const { ports } = require('../config/base.js');


// Expose a GraphQL endpoint
function QLServer(): void {
  const graphQLServer = express();
  const ghttp = graphQLHTTP({schema:schema, graphiql: true});
  //console.log(StarWarsSchema);
  graphQLServer.use('/', ghttp);
  graphQLServer.listen(ports.graphql, () => console.log(
    `GraphQL Server is now running on http://localhost:${ports.graphql}`
  ));
}

export {
  QLServer,
};

/*
query{
  nameSeach(text:""){
    id
    results(last:1){
      edges{
        node{
          id
          name
          content
        }
      },
      pageInfo{
        hasNextPage
        hasPreviousPage
      }
    }
  }
}
*/
