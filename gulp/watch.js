/* global process, Buffer */

var path = require('path'),
    gulp = require('gulp'),
    chalk = require('chalk'),
    log = require('fancy-log'),
    babel = require('gulp-babel'),
    conf = require('./conf'),
    less = require('gulp-less'),
    eslint = require('gulp-eslint'),
    mt2amd = require('gulp-mt2amd'),
    util = require('./util'),
    lazyTasks = require('./lazy-tasks');

// watch for changes and run the relevant task
gulp.task('watch', function (done) {
  process.on('uncaughtException', function (err) {
    console.log(err.stack || err.message || err);
  });

  gulp.watch('src/renderer/window/**/*.html', function (evt) {
    var filePath = evt.path;
    var part = (path.dirname(filePath) + '/').split('/src/renderer/window/').pop();
    log(chalk.cyan('[changed]'), filePath);
    return gulp.src(filePath)
      .pipe(lazyTasks.propertyMergeTask())
      .pipe(gulp.dest('app/content/renderer/window/' + part));
  });

  gulp.watch('src/**/*.+(js|jsx)', function (evt) {
    var filePath = evt.path;
    var part = (path.dirname(filePath) + '/').split('/src/').pop();
    log(chalk.cyan('[changed]'), filePath);
    return gulp.src(filePath)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(lazyTasks.propertyMergeTask())
      .pipe(babel())
      .pipe(gulp.dest('app/content/' + part));
  });

  gulp.watch('src/style/**/*.less', function (evt) {
    var filePath = evt.path;
    var part = (path.dirname(filePath) + '/').split('/src/style/').pop();
    log(chalk.cyan('[changed]'), filePath);
    if ((/(^|\-)main\.less$/).test(path.basename(filePath))) {
      return gulp.src(filePath)
        .pipe(lazyTasks.lazyLesshint())
        .pipe(less()).on('error', function (err) {
          log(chalk.red(err.message));
        })
        .pipe(lazyTasks.lazyPostcssTask()).on('error', function (err) {
          log(chalk.red(err.message));
        })
        .pipe(gulp.dest('app/content/style/' + part));
    } else {
      return gulp.start('less-main');
    }
  });

  gulp.watch('src/renderer/**/style.less', function (evt) {
    var filePath = evt.path;
    var part = (path.dirname(filePath) + '/').split('/src/renderer/').pop();
    log(chalk.cyan('[changed]'), filePath);
    return gulp.src(filePath)
      .pipe(lazyTasks.lazyLesshint())
      .pipe(less()).on('error', function (err) {
        log(chalk.red(err.message));
      })
      .pipe(lazyTasks.lazyPostcssTask()).on('error', function (err) {
        log(chalk.red(err.message));
      })
      .pipe(mt2amd({
        commonjs: true,
        useExternalCssModuleHelper: true,
        cssModuleClassNameGenerator: util.cssModuleClassNameGenerator
      }))
      .pipe(gulp.dest('app/content/renderer/' + part));
  });

  gulp.watch('src/**/*.tpl.xhtml', function (evt) {
    var filePath = evt.path;
    var part = (path.dirname(filePath) + '/').split('/src/').pop();
    log(chalk.cyan('[changed]'), filePath);
    return gulp.src(filePath)
      .pipe(mt2amd({
        commonjs: true
      }))
      .pipe(gulp.dest('app/content/' + part));
  });

  gulp.watch('src/lang/**/*.json', function (evt) {
    var filePath = evt.path;
    log(chalk.cyan('[changed]'), filePath);
    return gulp.start('i18n-resolve-reference');
  });

  gulp.watch([
    'src/**/*.+(jpg|jpeg|gif|png|otf|eot|svg|ttf|woff|woff2|ico|mp3|swf|json)',
    '!src/lang/**/*.json'
  ], function (evt) {
    var filePath = evt.path;
    var part = (path.dirname(filePath) + '/').split('/src/').pop();
    log(chalk.cyan('[changed]'), filePath);
    return gulp.src(filePath)
      .pipe(gulp.dest('app/content/' + part));
  });

  done();
});
