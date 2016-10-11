// @flow
import React from 'react';
import Relay from 'react-relay';

class Box extends React.Component {
  render() {
    //console.dir(this.props);
    return (
      <div>
        hehe.thia is a new !!~~~~
        {(() => {
          return this.props.nameSeach.results.edges.map(edge => {
            console.dir(edge.node);
            return (<div> {edge.node.id} </div> );
          });
        })()}
      </div>
    );
  }
}

export default Relay.createContainer(Box, {
  fragments: {
    nameSeach: () => Relay.QL`
      fragment on SearchResult{
        results(first: 3){
          edges{
            node{
              name
              id
              content
            }
          }
        }
      }
    `,
  },
});
