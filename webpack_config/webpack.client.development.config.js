const path = require('path');
const webpack = require('webpack');
const webpackClientDefaultConfig = require('./webpack.client.default.config');
const deepMerge = require('./deepMerge');

module.exports = deepMerge(webpackClientDefaultConfig, {
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './app/main.js',
  ],
  output: {
    path: path.resolve('./build'),
    filename: 'client_build.js',
    publicPath: '/',
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [{
      // css-loader - interprets @import and url() like requires
      // style-loader - adds css to the dom by injecting a style tag
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    }, {
      // scss styles are loaded with modules local scope
      test: /\.scss$/,
      loader: 'style-loader!css-loader?modules&localIdentName=[local]---[hash:base64:5]!sass-loader',
    }],
  },
});
