var crypto = require('crypto');

exports.cssModuleClassNameGenerator = function (css) {
  return '_' + crypto.createHash('md5')
    .update(css)
    .digest('hex')
    .slice(0, 8);
};
