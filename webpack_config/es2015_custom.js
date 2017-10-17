const modify = require('modify-babel-preset');

// Remove stuff already supported in NodeJS v6
module.exports = modify('es2015', {
  'transform-regenerator': false,
  'transform-es2015-for-of': false,
});
