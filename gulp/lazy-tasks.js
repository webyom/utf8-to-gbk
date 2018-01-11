/* global Buffer */

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
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
            output += gutil.colors.red('Error: ');
          } else {
            output += gutil.colors.yellow('Warning: ');
          }
          output += gutil.colors.cyan(path.relative(process.cwd(), file.path)) + ': ';
          if (result.line) {
            output += gutil.colors.magenta('line ' + result.line) + ', ';
          }
          if (result.column) {
            output += gutil.colors.magenta('col ' + result.column) + ', ';
          }
          output += gutil.colors.green(result.linter) + ': ';
          output += result.message;
          gutil.log(output);
          count ++;
        });
      }
      return callback(null, file);
    }).on('finish', function (x) {
      if (count) {
        throw new gutil.PluginError('gulp-lesshint', {
          name: 'LesshintError',
          message: 'Failed with ' + count + (count === 1 ? ' error' : ' errors')
        });
      }
    });
  });
