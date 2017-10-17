const gulp = require('gulp');
const task = require('./gulp/tasks');

// Simple tasks
gulp.task('iconfont', task.iconfont);
gulp.task('backend-watch', task.backendWatch);
gulp.task('backend-build', task.backendBuild);
gulp.task('frontend-build', task.frontendBuild);

// Compound tasks
gulp.task('dev', ['iconfont', 'backend-watch'], () => {});
gulp.task('build', ['iconfont', 'backend-build', 'frontend-build'], () => {})

// Close the process on sigint, nodemon eats the first SIGINT
// A docker stop and docker restart sends a SIGTERM to your process
// If there is no SIGTERM handler, docker will wait the default 10 second
// timeout until it sends a SIGKILL and your process restarts
process.on('SIGTERM', () => {
  console.log('SIGTERM exiting process');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT exiting process');
  process.exit(0);
});
