const webpack = require('webpack');
const webpackServerDefaultConfig = require('./webpack.server.default.config');
const deepMerge = require('./deepMerge');

module.exports = deepMerge(webpackServerDefaultConfig, {
  // devtool: '#eval-source-map', // Faster in big projects
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'global.IS_NODE': JSON.stringify('false'),
    }),
    new webpack.BannerPlugin(
      'require("source-map-support").install();',
      {
        raw: true,
        entryOnly: false,
      }),
  ],
});
