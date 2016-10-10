const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const log = require('./log.js').log;
const config = require('./webpack.config.js');

const webCompiler = webpack(config.dev);

function build() {
  webCompiler.run( function(err, stats) {
    if (err) {
      throw new Error(err);
    }
    log('[webpack]', String(stats));
  });
}

function watch() {
  webCompiler.watch({
    aggregateTimeout: 300, // wait so long for more changes
    poll: true, // use polling instead of native watchers
  }, function(err, stats) {
    if (err) { throw new Error('webpack', err);}
    log('[webpack]', stats.toString());
  });
}

const GRAPHQL_PORT = 8080;

function devServer(port) {
  const server = new WebpackDevServer(webCompiler, {
    contentBase: './src',
    proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
    hot: true,
    publicPath: config.dev.output.publicPath,
    watchOptions: {
      ignored: /node_modules/,
    },
    stats: {colors: true},
  });

  server.listen(port, (err, result) => {
    if ( err ) {
      log(err);
    }
    log(`Dev Server Start at ${port}`);
  });
}

module.exports = {
  build: build,
  watch: watch,
  devServer: devServer,
};
