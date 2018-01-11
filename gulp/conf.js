/* global process */

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');

if (process.cwd() != path.resolve(__dirname, '..')) {
  gutil.log(gutil.colors['red']('Please run gulp in the project root dir.'));
  process.exit(1);
}

var config = require('../config');

var env = process.env.NODE_ENV;
var conf = config[env];

(function () {
  var envs = config.envs || config;
  if (envs[env]) {
    conf = envs[env]
  } else {
    conf = (env = 'development') && envs[env] || (env = 'develop') && envs[env] || (env = 'dev') && envs[env];
  }

  if (conf) {
    gutil.log('Running env ' + gutil.colors['green'](env));
  } else {
    gutil.log(gutil.colors['red']('Aborting, failed to detect env.'));
    process.exit(0);
  }

  // overwrite config from command line
  for (var p in conf) {
    if (process.env[p]) {
      conf[p] = process.env[p];
    }
  }
})();

conf.BASE_PROJECT_NAME =  config.baseProjectName || 'electron-base';
conf.PROJECT_NAME = process.cwd().split(path.sep).pop();
conf.IS_BASE_PROJECT = conf.PROJECT_NAME == conf.BASE_PROJECT_NAME;
conf.ENV = env;
conf.VERSION_DIGEST_LEN = 4;
conf.IS_PRODUCTION = env == 'production';
conf.EXCLUDE_MODULES = getExcludeModules();

function getExcludeModules() {
  var modules = [];
  if (conf.IS_BASE_PROJECT) {
    return modules;
  }
  if (process.env.EXCLUDE_MODULES) {
    modules = process.env.EXCLUDE_MODULES.split(',');
  } else if (process.env.INCLUDE_MODULES) {
    includes = process.env.INCLUDE_MODULES.split(',');
    ['route'].forEach(function (type) {
      var base = 'src/' + type;
      if (fs.existsSync(base)) {
        fs.readdirSync(base).forEach(function (name) {
          if (name != 'public' && !includes.includes(name) && fs.statSync(base + '/' + name).isDirectory()) {
            modules.push(name);
          }
        });
      }
    });
  }
  modules = _.uniq(modules);
  return modules;
}

module.exports = conf;
