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
  var src = ['src/**/*.+(js|jsx)'];
  if (conf.EXCLUDE_MODULES.length) {
    conf.EXCLUDE_MODULES.forEach(function (name) {
      src.push('!src/route/' + name + '/**/*.+(js|jsx)');
    });
  }
  return gulp.src(src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// babel
gulp.task('babel', ['eslint'], function () {
  var src = ['src/**/*.+(js|jsx)'];
  if (conf.EXCLUDE_MODULES.length) {
    conf.EXCLUDE_MODULES.forEach(function (name) {
      src.push('!src/route/' + name + '/**/*.+(js|jsx)');
    });
  }
  return gulp.src(src)
    .pipe(lazyTasks.propertyMergeTask())
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

// move html
gulp.task('html', function () {
  return gulp.src('src/**/*.html')
    .pipe(lazyTasks.propertyMergeTask())
    .pipe(gulp.dest('dist'));
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
    .pipe(gulp.dest('dist/style'));
});

// compile component less
gulp.task('less-component', ['lesshint'], function (done) {
  var src = ['src/route/**/style.less'];
  if (conf.EXCLUDE_MODULES.length) {
    conf.EXCLUDE_MODULES.forEach(function (name) {
      src.push('!src/route/' + name + '/**/style.less');
    });
  }
  return gulp.src(src)
    .pipe(less()).on('error', function (err) {
      done(err);
    })
    .pipe(lazyTasks.lazyPostcssTask()).on('error', function (err) {
      done(err);
    })
    .pipe(mt2amd({
      commonjs: true,
      cssModuleClassNameGenerator: util.cssModuleClassNameGenerator
    }))
    .pipe(gulp.dest('dist/route'));
});

// lesshint
gulp.task('lesshint', function () {
  var src = [
    'src/**/*.less',
    '!src/style/vendor/**/*.less'
  ];
  if (conf.EXCLUDE_MODULES.length) {
    conf.EXCLUDE_MODULES.forEach(function (name) {
      src.push('!src/route/' + name + '/**/style.less');
    });
  }
  return gulp.src(src)
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
    .pipe(gulp.dest('dist'));
});

// move img
gulp.task('img', function () {
  return gulp.src('src/**/*.+(jpg|jpeg|gif|png|otf|eot|svg|ttf|woff|woff2|ico|mp3|swf)')
    .pipe(gulp.dest('dist'));
});

// copy base
gulp.task('copy-base', function () {
  return gulp.src([
    '../' + conf.BASE_PROJECT_NAME + '/dist/**/*',
    '!../' + conf.BASE_PROJECT_NAME + '/dist/**/*.html'
  ])
    .pipe(gulp.dest('dist'));
});
