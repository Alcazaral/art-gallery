const path = require('path');
const webpack = require('webpack');
const StatsPlugin = require('stats-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackClientDefaultConfig = require('./webpack.client.default.config');
const deepMerge = require('./deepMerge');

module.exports = deepMerge(webpackClientDefaultConfig, {
  entry: './app/main.js',
  output: {
    path: path.resolve('./build'),
    filename: 'client_build.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true,
      },
      comments: false,
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false,
    }),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('styles.css'), // goes to build folder
  ],
  module: {
    loaders: [
      {
        // 1.- the file is read with css-loader and converted to json?
        // 2.- style-loader adds css to the dom by injecting a style tag
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader'
        ),
      }, {
        // scss styles are loaded with modules local scope
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader?modules&localIdentName=[local]---[hash:base64:5]',
            'sass-loader',
          ]
        ),
      },
    ],
  },
});
