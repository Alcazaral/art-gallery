const gulp = require('gulp');
const gulpIconfont = require('gulp-iconfont');
const path = require('path');
const { rootFolder } = require('../../config/global');
const createIconsScss = require('../../app/icons');

// generate glyphs font
// from the svg files inside public/assets/icons
const iconFontConfig = {
  fontName: "ruby-icons",
  // Where the icons are
  icons: [
    path.resolve(rootFolder, 'app/icons/*.svg'),
  ],
  // Where the fonts are going to be stored
  fontPath: path.resolve(rootFolder, 'public/assets/fonts/'),
  // Where the sass file is going to be stored
  sassDest: path.resolve(rootFolder, 'app/icons/_styles.scss'),
  // The route to request the font from the sass file
  fontDest: '/public/assets/fonts/',
  normalize: true,
};

module.exports = function iconFontTask() {
  return gulp.src(iconFontConfig.icons, {
    buffer: false,
  })
  .pipe(gulpIconfont({
    fontName: iconFontConfig.fontName,
    timestamp: Math.round(Date.now() / 1000),
    formats: ['ttf', 'eot', 'woff', 'woff2'],
  }))
  .on('glyphs', createIconsScss(iconFontConfig))
  .pipe(gulp.dest(iconFontConfig.fontPath));
};

// IMPROVEMENT: Use SVG sprites instead of
//    iconfont and research exactly why is better
// const svgSprite = require('gulp-svg-sprites');
// gulp.task('sprites', () => {
//   return gulp.src(path.resolve(__dirname, 'app/icons/*.svg'))
//     .pipe(svgSprite({
//       cssFile: '../../../app/icons/_sprites.scss',
//       svgPath: '/public/assets/sprites/svg/sprite.png',
//     }))
//     .pipe(gulp.dest(path.resolve(__dirname, 'public/assets/sprites')));
// });
