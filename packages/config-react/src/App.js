import React, { Component } from 'react';
import Box from './component/box.js';

class App extends Component {
  render() {
    return (
      <div >
        <div >
          <h2>Welcome to Reat </h2>
        </div>
        <p>
          To get started, edits <code>src/App.js</code> and save to reload.
        </p>
        <Box />
      </div>
    );
  }
}


export default App;
