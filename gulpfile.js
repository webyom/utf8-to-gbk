var fs = require('fs'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    requireAll = require('require-all'),
    runSequence = require('run-sequence');

/**
 *  This will load all js files in the gulp directory
 *  in order to load all gulp tasks
 */
requireAll({
  dirname: __dirname + '/gulp',
  filter: /(.*)\.js$/,
  recursive: true
});

/**
 *  init tasks
 */
gulp.task('init-dev', ['app-dependencies', 'babel', 'html', 'css', 'mt', 'resource', 'i18n-resolve-reference']);

/**
 *  serve-dev task
 */
gulp.task('serve-dev', ['watch', 'serve']);

/**
 *  start-dev task
 */
gulp.task('start-dev', function (done) {
  runSequence('clean', 'init-dev', 'serve-dev', function (err) {
    done(err);
  });
});

/**
 *  build task
 */
gulp.task('build', function (done) {
  runSequence('clean', 'init-dev', 'minify', function (err) {
    done(err);
  });
});
