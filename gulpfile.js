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
gulp.task('init-dev', ['app-dependencies', 'babel', 'html', 'css', 'mt', 'img', 'i18n-resolve-reference']);

/**
 *  start-dev task
 */
gulp.task('start-dev', function (done) {
  runSequence('clean', 'init-dev', 'watch', 'serve', function (err) {
    done(err);
  });
});

/**
 *  build task
 */
gulp.task('build', function (done) {
  runSequence('clean', 'init-dev', 'eslint-final', 'minify', function (err) {
    done(err);
  });
});
