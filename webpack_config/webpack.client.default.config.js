const path = require('path');
const webpack = require('webpack');
const auth = require('../config/auth');

module.exports = {
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.scss'],
    alias: {
      base: path.resolve('app', 'base'),
    },
  },
  module: {
    loaders: [{
      test: /\.json?$/,
      loader: 'json',
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
        plugins: [
          'babel-plugin-transform-decorators-legacy',
          'transform-async-to-generator',
          'transform-function-bind',
          'transform-class-properties',
          'transform-object-rest-spread',
        ],
      },
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        OAUTH_FACEBOOK_ID: JSON.stringify(process.env.OAUTH_FACEBOOK_ID),
        OAUTH_FACEBOOK_REDIRECT: JSON.stringify(auth.providersConfig.facebook.redirect_uri),
        OAUTH_GOOGLE_ID: JSON.stringify(process.env.OAUTH_GOOGLE_ID),
        OAUTH_GOOGLE_REDIRECT: JSON.stringify(auth.providersConfig.google.redirect_uri),
        AWS_S3_BUCKET: JSON.stringify(process.env.AWS_S3_BUCKET),
        APP_HOST: JSON.stringify(process.env.APP_HOST),
        APP_PORT: JSON.stringify(process.env.APP_PORT),
      },
      IS_NODE: JSON.stringify('false'),
    }),
  ],
};
