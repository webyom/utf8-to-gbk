/* global Buffer */

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    log = require('fancy-log'),
    conf = require('./conf'),
    lazypipe = require('lazypipe'),
    postcss = require('gulp-postcss'),
    postcssImport = require('postcss-import'),
    postcssCssnext = require('postcss-cssnext'),
    through = require('through2'),
    lesshint = require('gulp-lesshint'),
    propertyMerge = require('gulp-property-merge');

var EOL = '\n';

// lazy tasks

exports.propertyMergeTask = lazypipe()
  .pipe(propertyMerge, {
    properties: _.extend({}, conf)
  });

exports.lazyPostcssTask = lazypipe()
  .pipe(postcss, [
    postcssImport(),
    postcssCssnext({
      browsers: ['last 4 versions', 'not ie <= 8']
    })
  ]);

exports.lazyLesshint = lazypipe()
  .pipe(lesshint)
  .pipe(function () {
    var count = 0;
    return through.obj(function (file, enc, callback) {
      if (file.lesshint && !file.lesshint.success) {
        file.lesshint.results.forEach(function (result) {
          var output = '';
          if (result.severity === 'error') {
            output += chalk.red('Error: ');
          } else {
            output += chalk.yellow('Warning: ');
          }
          output += chalk.cyan(path.relative(process.cwd(), file.path)) + ': ';
          if (result.line) {
            output += chalk.magenta('line ' + result.line) + ', ';
          }
          if (result.column) {
            output += chalk.magenta('col ' + result.column) + ', ';
          }
          output += chalk.green(result.linter) + ': ';
          output += result.message;
          log(output);
          count ++;
        });
      }
      return callback(null, file);
    }).on('finish', function (x) {
      if (count) {
        throw new Error('gulp-lesshint failed with ' + count + (count === 1 ? ' error' : ' errors'));
      }
    });
  });
