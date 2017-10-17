const DeepMerge = require('deep-merge');

module.exports = new DeepMerge((target, source) => {
  if (target instanceof Array) {
    return [].concat(target, source);
  }
  return source;
});
