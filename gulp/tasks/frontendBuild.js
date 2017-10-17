const webpack = require('webpack');
const gutil = require("gulp-util");
const webpackClientProductionConfig =
  require('../../webpack_config/webpack.client.production.config');

module.exports = function frontendBuildTask(done) {
  // run webpack
  webpack(webpackClientProductionConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
        // output options
    }));
    done();
  });
};
