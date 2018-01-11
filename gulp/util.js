var crypto = require('crypto');

exports.isRelativeDependency = function (dep, isRelative, reqFilePath) {
  if (dep == './main') {
    return true;
  } else if ((/^\.\.|[{}]|\bmain$/).test(dep)) {
    return false;
  } else {
    return isRelative;
  }
};

exports.cssModuleClassNameGenerator = function (css) {
  return '_' + crypto.createHash('md5')
    .update(css)
    .digest('hex')
    .slice(0, 8);
};
