var gulp = require('gulp'),
    gutil = require('gulp-util'),
    conf = require('./conf'),
    babel = require('gulp-babel'),
    less = require('gulp-less'),
    eslint = require('gulp-eslint'),
    mt2amd = require('gulp-mt2amd'),
    util = require('./util'),
    lazyTasks = require('./lazy-tasks');

// eslint js
gulp.task('eslint', function () {
  return gulp.src(['src/**/*.+(js|jsx)'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// babel
gulp.task('babel', ['eslint'], function () {
  return gulp.src(['src/**/*.+(js|jsx)'])
    .pipe(lazyTasks.propertyMergeTask())
    .pipe(babel())
    .pipe(gulp.dest('app/content'));
});

// move html
gulp.task('html', function () {
  return gulp.src(['src/**/*.html'])
    .pipe(lazyTasks.propertyMergeTask())
    .pipe(gulp.dest('app/content'));
});

// compile less
gulp.task('css', ['less-main', 'less-component']);

// compile main less
gulp.task('less-main', ['lesshint'], function (done) {
  return gulp.src([
    'src/style/**/*-main.less',
    'src/style/**/main.less'
  ])
    .pipe(less()).on('error', function (err) {
      done(err);
    })
    .pipe(lazyTasks.lazyPostcssTask()).on('error', function (err) {
      done(err);
    })
    .pipe(gulp.dest('app/content/style'));
});

// compile component less
gulp.task('less-component', ['lesshint'], function (done) {
  return gulp.src(['src/renderer/window/**/style.less'])
    .pipe(less()).on('error', function (err) {
      done(err);
    })
    .pipe(lazyTasks.lazyPostcssTask()).on('error', function (err) {
      done(err);
    })
    .pipe(mt2amd({
      commonjs: true,
      useExternalCssModuleHelper: true,
      cssModuleClassNameGenerator: util.cssModuleClassNameGenerator
    }))
    .pipe(gulp.dest('app/content/renderer/window'));
});

// lesshint
gulp.task('lesshint', function () {
  return gulp.src([
    'src/**/*.less',
    '!src/style/vendor/**/*.less'
  ])
    .pipe(lazyTasks.lazyLesshint());
});

// compile micro template
gulp.task('mt', function () {
  return gulp.src([
    'src/**/*.tpl.xhtml'
  ])
    .pipe(mt2amd({
      commonjs: true
    }))
    .pipe(gulp.dest('app/content'));
});

// move img
gulp.task('img', function () {
  return gulp.src('src/**/*.+(jpg|jpeg|gif|png|otf|eot|svg|ttf|woff|woff2|ico|mp3|swf)')
    .pipe(gulp.dest('app/content'));
});

// copy base
gulp.task('copy-base', function () {
  return gulp.src([
    '../' + conf.BASE_PROJECT_NAME + '/app/content/**/*',
    '!../' + conf.BASE_PROJECT_NAME + '/app/content/**/*.html'
  ])
    .pipe(gulp.dest('app/content'));
});
