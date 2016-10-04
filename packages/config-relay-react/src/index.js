import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Relay from 'react-relay';
import {RelayApp, AppHomeRoute} from './App.js';

console.log('Webpack is doing its thing;...');

ReactDOM.render(
  <AppContainer>
    <Relay.Renderer
      environment={Relay.Store}
      Container={RelayApp}
      queryConfig={new AppHomeRoute()}
    />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./App');
    ReactDOM.render(
      <AppContainer>
        <Relay.Renderer
          environment={Relay.Store}
          Container={NextApp.RelayApp}
          queryConfig={new NextApp.AppHomeRoute()}
        />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
