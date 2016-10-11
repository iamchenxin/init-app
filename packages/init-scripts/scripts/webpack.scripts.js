const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const log = require('./log.js').log;

class WebCompiler {
  constructor(webpackConfig) {
    this.compiler = webpack(webpackConfig);
    this.config = webpackConfig;
  }

  // build to a bundle
  build() {
    this.compiler.run( function(err, stats) {
      if (err) {
        throw new Error(err);
      }
      log('[webpack]', String(stats));
    });
  }

  watch() {
    this.compiler.watch({
      aggregateTimeout: 300, // wait so long for more changes
      poll: true, // use polling instead of native watchers
    }, function(err, stats) {
      if (err) { throw new Error('webpack', err);}
      log('[webpack]', stats.toString());
    });
  }

  HotServer(web_port, api_port) {
    const server = new WebpackDevServer(this.compiler, {
      contentBase: './src',
      proxy: {'/graphql': `http://localhost:${api_port}`},
      hot: true,
      publicPath: this.config.output.publicPath,
      watchOptions: {
        ignored: /node_modules/,
      },
      stats: {colors: true},
    });

    server.listen(web_port, (err, result) => {
      if ( err ) {
        log(err);
      }
      log(`Dev Server Start at ${web_port}`);
    });
  }
}

module.exports = {
  WebCompiler: WebCompiler,
};
