const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

// Note: path.resolve('./') resolves to root folder, don't know why

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x) => {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach((mod) => {
    nodeModules[mod] = `commonjs ${mod}`;
  });

module.exports = {
  context: path.resolve('./'),
  entry: path.resolve('./server/server.js'),
  target: 'node',
  output: {
    path: path.resolve('./build'),
    filename: 'server_build.js',
  },
  externals: nodeModules,
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.scss'],
    alias: {
      base: path.resolve('./app', 'base'),
    },
  },
  node: {
    __dirname: true,
    __filename: true,
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: [
          'react',
        ],
        plugins: [
          'babel-plugin-transform-es2015-modules-commonjs',
          'babel-plugin-transform-decorators-legacy',
          'transform-async-to-generator',
          'transform-function-bind',
          'transform-class-properties',
          'transform-object-rest-spread',
        ],
      },
    },
    {
      test: /\.json?$/,
      loader: 'json',
    }, {
      test: /\.md$/,
      loader: 'raw',
    }, {
      // Do not embed css, just export de identifier mappings
      test: /\.css?$/,
      loader: 'css-loader/locals',
    },
    {
      test: /\.scss?$/,
      loaders: [
        'css-loader/locals?modules&localIdentName=[local]---[hash:base64:5]',
        'sass-loader',
      ],
    },
    {
      test: /\.woff$/,
      loader: 'url?limit=100000',
    }],
  },
};
