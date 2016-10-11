/*
 * @flow
*/

import React from 'react';
import Relay from 'react-relay';
import Box from './component/box.js';

function App(props: {nameSeach: Object} ) {
  console.log('hello!');
  console.dir(props.nameSeach);
  return (
    <div>
      app
      <Box nameSeach={props.nameSeach} />
    </div>
  );
}

const RelayApp = Relay.createContainer(App, {
  fragments: {
    nameSeach: () => Relay.QL`
      fragment on SearchResult{
        results(first: 3){
          edges{
            node{
              name
              content
              id
            }
          }
        }
      }
    `,
  },
});

class AppHomeRoute extends Relay.Route {
  static queries = {
    nameSeach: () => Relay.QL`
      query {
        nameSeach(text: "")
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}


export {
  RelayApp,
  AppHomeRoute,
};
