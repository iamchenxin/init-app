// @flow
const paths = require('../config/paths.js');
var webpack = require('webpack');

const config_dev = {
  devtool: 'eval', //   devtool:'source-map',
  entry:[
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000', //?http://localhost:3000
    'webpack/hot/only-dev-server',
    paths.appEntry,
  ],
  output:{
    path:paths.appBuild,
    filename: 'bundle.js',
    publicPath: '/',
//    pathinfo: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module:{
    loaders:[
      {
        loader:'babel-loader',
        test: /\.jsx?$/,  //!!! must be .jsx? to test js and jsx
        exclude:/node_modules/,
        query:{
          babelrc: false,
          presets: [
            'react', 'es2015', 'stage-0',
          ],
          'plugins': [
            'react-hot-loader/babel',
          ],
        },
      },
    ],
  },
};



module.exports = {
  dev: config_dev,
};
