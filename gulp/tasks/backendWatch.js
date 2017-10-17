const webpack = require('webpack');
const nodemon = require('nodemon');
const path = require('path');
const { rootFolder } = require('../../config/global');
const webpackServerDevelopmentConfig =
  require('../../webpack_config/webpack.server.development.config');

// creates webpack compiler for server,
// watch changes for server files
// restart nodemon on recompilation
module.exports = function backendWatchTask(done) {
  let firedDone = false;
  webpack(webpackServerDevelopmentConfig).watch(100, (err, stats) => {
    if (err) {
      console.error('Error building server', err.message, err.stack);
    }

    const jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
      return console.log('Error building server', jsonStats.errors);
    }

    if (!firedDone) {
      // Run the app with nodemon to have restart()
      nodemon({
        execMap: {
          js: 'node',
        },
        script: path.join(rootFolder, 'build/server_build.js'),
        ignore: ['*'],
        watch: [path.join(rootFolder, 'foo/')],
        ext: 'noop',
      }).on('restart', () => {
        console.log(' \n\r\n\rPatched!');
      });

      firedDone = true;
      console.log('Task done');
      done(); // end the task on the first compilation
      return;
    }

    nodemon.restart();
  });
};
