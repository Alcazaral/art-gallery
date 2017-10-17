const webpack = require('webpack');
const gutil = require("gulp-util");
const webpackServerProductionConfig =
  require('../../webpack_config/webpack.server.production.config');

module.exports = function backendBuildTask(done) {
  // run webpack
  webpack(webpackServerProductionConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
        // output options
    }));
    done();
  });
};
