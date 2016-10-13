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

  // HotServer(web_port: number, api_port?: number): void,
  HotServer(web_port, api_port) {
    const api_proxy = api_port ? { '/graphql': `http://localhost:${api_port}` }
      : undefined;
    const server = new WebpackDevServer(this.compiler, {
      contentBase: './src',
      proxy: api_proxy,
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
