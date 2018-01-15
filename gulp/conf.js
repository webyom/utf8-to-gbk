/* global process */

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    log = require('fancy-log'),
    chalk = require('chalk');

if (process.cwd() != path.resolve(__dirname, '..')) {
  log(chalk.red('Please run gulp in the project root dir.'));
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
    log('Running env ' + chalk.green(env));
  } else {
    log(chalk.red('Aborting, failed to detect env.'));
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
conf.IS_PRODUCTION = env == 'production';

module.exports = conf;
