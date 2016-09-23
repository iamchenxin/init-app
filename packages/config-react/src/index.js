import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

console.log('Webpack is doing its thing;...');

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}

// if (module.hot) {
//   module.hot.accept('./App.js', function() {
//     const AppH = require('./App.js');
//     ReactDOM.render(
//       <AppH />,
//       document.getElementById('root')
//     );
//   });
// }
