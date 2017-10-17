const webpack = require('webpack');
const webpackServerDefaultConfig = require('./webpack.server.default.config');
const deepMerge = require('./deepMerge');

module.exports = deepMerge(webpackServerDefaultConfig, {
  plugins: [
    new webpack.DefinePlugin({
      'global.IS_NODE': JSON.stringify('false'), // why are we doing this?
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //   },
    // }),
  ],
});
