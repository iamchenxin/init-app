// @flow

import {
  pageInfoFromArray,
  edgesFromArray,
  decodeConnectionArgs,
  edge,
  connection,
  connectionField,
  idField,
  nodeInterface,
  nodeInterfaceField,
  nodableType,
//  nonNullList,
//  nonNullListnonNull,
//  pluralIdentifyingRootField,
  mutation,
  encodeId,
} from 'relayql';

import type {
//   mutationFn,
  ObjectMap,
} from 'relayql';

import {
//  GraphQLInterfaceType,
  GraphQLNonNull,
//  GraphQLID,
//  GraphQLScalarType,
  GraphQLObjectType,
//  GraphQLList,
  GraphQLString,
  GraphQLSchema,
//  GraphQLEnumType
} from 'graphql';

// import type {
//   GraphQLResolveInfo,
//   GraphQLFieldConfig,
//   GraphQLIsTypeOfFn,
//   GraphQLType,
//   GraphQLNullableType,
// } from 'flow-graphql';

import { getDb } from './db.js';
import type { Item, SearchResult } from './db.js';
const db = getDb();

const nodeItf = nodeInterface.maker( source => {
  switch (source._nodeInfo.type) {
    case 'Item':
      return itemType;
    default:
      return itemType;
  }
});

const itemType = nodableType.spec({
  name: 'Item',
  description: 'A item (name, content)',
  fields: () => ({
    id: idField.maker(),
    name: {
      type: GraphQLString,
      description: 'the name of a content',
    },
    content: {
      type: GraphQLString,
      description: 'the content',
    },
  }),
  interfaces: [nodeItf],
});

const itemEdge = edge.maker(itemType);
const itemConnection = connection.maker(itemEdge);

const itemBookType = nodableType.spec({
  name: 'ItemBook',
  description: 'mainupulate items',
  fields: () => ({
    id: idField.maker(source => encodeId('ItemBook', '1')),
    byName: {
      type: itemType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_, args: { name: string }): Promise<Item|null> => {
        console.log('...');
        console.log(args);
        return db.getByName(args.name);
      },
    },
  }),
  interfaces: [nodeItf],
});

const searchResultType = nodableType.spec({
  name: 'SearchResult',
  description: 'the results for a name search',
  fields: () => ({
    id: idField.maker(), // should be the results id, for refetch!
    results: connectionField.spec({
      type: itemConnection,
      args: 'all',
      resolve: (source: SearchResult, args) => {
        const item_list = source.results;
        console.log(` itemsType : \n ${String(source)}`);
        const range = decodeConnectionArgs(args, item_list.length);
        const edges = edgesFromArray(item_list, range);
        const pageInfo = pageInfoFromArray(edges, range, item_list.length);
        return {
          pageInfo: pageInfo,
          edges:edges,
        };
      },
    }),
  }),
  interfaces: [nodeItf],
});


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    book: {
      type: itemBookType,
      resolve: () => {
        console.log('in queryType');
        return '1';
      },
    },
    nameSeach: {
      type: searchResultType,
      args: {
        text: {
          type: GraphQLString,
        },
      },
      resolve: (_, args: { text: string|null}): Promise< SearchResult > => {
        console.log(args);
        return db.searchName(args.text);
      },
    },
    node: nodeInterfaceField.maker(nodeItf, (_nodeInfo) => {
      return db.getByName(_nodeInfo.serverId);
    }),
  }),
});

const setItem = mutation.maker({
  name: 'SetItem',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  payloadFields: {
    item: {
      type: itemType,
      resolve: payload => {
        console.log(payload);
        return payload.item;
      },
    },
  },
  mutateAndGetPayload: function(input): Promise<ObjectMap> {
    const {name, content} = input;

    return db.setItem(name, content)
    .then( item => ({
      item:item,
    }));

  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    setItem: setItem,
  }),
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

export {
  schema,
};
