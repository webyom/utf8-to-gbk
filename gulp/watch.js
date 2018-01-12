/* global process, Buffer */

var path = require('path'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    babel = require('gulp-babel'),
    conf = require('./conf'),
    less = require('gulp-less'),
    eslint = require('gulp-eslint'),
    mt2amd = require('gulp-mt2amd'),
    through = require('through2'),
    util = require('./util'),
    lazyTasks = require('./lazy-tasks');

// watch for changes and run the relevant task
gulp.task('watch', function (done) {
  process.on('uncaughtException', function (err) {
    console.log(err.stack || err.message || err);
  });

  gulp.watch('src/**/*.html', function (evt) {
    var filePath = evt.path;
    var part = (path.dirname(filePath) + '/').split('/src/').pop();
    gutil.log(gutil.colors.cyan('[changed]'), filePath);
    return gulp.src(filePath)
      .pipe(gulp.dest('dist/' + part));
  });

  gulp.watch('src/**/*.json', function (evt) {
    var filePath = evt.path;
    var part = (path.dirname(filePath) + '/').split('/src/').pop();
    gutil.log(gutil.colors.cyan('[changed]'), filePath);
    return gulp.src(filePath)
      .pipe(gulp.dest('dist/' + part));
  });

  gulp.watch('src/**/*.+(js|jsx)', function (evt) {
    var filePath = evt.path;
    var part = (path.dirname(filePath) + '/').split('/src/').pop();
    gutil.log(gutil.colors.cyan('[changed]'), filePath);
    return gulp.src(filePath)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(lazyTasks.propertyMergeTask())
      .pipe(babel())
      .pipe(gulp.dest('dist/' + part));
  });

  gulp.watch('src/**/*.less', function (evt) {
    var filePath = evt.path;
    var part = (path.dirname(filePath) + '/').split('/src/').pop();
    gutil.log(gutil.colors.cyan('[changed]'), filePath);
    if ((/(^|\-)main.less$/).test(path.basename(filePath)) || filePath.indexOf('/src/route/') > 0) {
      return gulp.src(filePath)
        .pipe(lazyTasks.lazyLesshint())
        .pipe(less()).on('error', function (err) {
          gutil.log(gutil.colors.red(err.message));
        })
        .pipe(lazyTasks.lazyPostcssTask()).on('error', function (err) {
          gutil.log(gutil.colors.red(err.message));
        })
        .pipe(gulpif(filePath.indexOf('/src/route/') > 0, mt2amd({
          commonjs: true,
          cssModuleClassNameGenerator: util.cssModuleClassNameGenerator
        })))
        .pipe(gulp.dest('dist/' + part));
    } else {
      return gulp.start('less-main');
    }
  });

  gulp.watch('src/**/*.tpl.xhtml', function (evt) {
    var filePath = evt.path;
    gutil.log(gutil.colors.cyan('[changed]'), filePath);
    return gulp.start('mt');
  });

  gulp.watch('src/lang/**/*.json', function (evt) {
    var filePath = evt.path;
    gutil.log(gutil.colors.cyan('[changed]'), filePath);
    return gulp.start('i18n-resolve-reference');
  });

  done();
});
