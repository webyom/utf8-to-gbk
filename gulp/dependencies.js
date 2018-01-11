var gulp = require('gulp'),
    async = require('async'),
    mt2amd = require('gulp-mt2amd');

// move dependencies into build dir
gulp.task('app-dependencies', ['app-bundle-css-dependencies', 'app-copy-js-dependencies', 'app-copy-css-dependencies']);

gulp.task('app-bundle-css-dependencies', function (done) {
  async.each([
  ], function (item, done) {
    var src = item, dest = '';
    if (Array.isArray(item)) {
      src = item[0];
      dest = item[1];
    } else {
      dest = item.match(/(?:node_modules|bower_components)\/([^\/]+)/);
      dest = dest && dest[1] || '';
    }
    gulp.src(src)
      .pipe(mt2amd({
        commonjs: true,
        generateDataUri: false
      }))
      .pipe(gulp.dest('dist/vendor/' + dest)).on('finish', done);
  }, done);
});

gulp.task('app-copy-js-dependencies', function (done) {
  async.each([
  ], function (item, done) {
    var src = item, dest = '';
    if (Array.isArray(item)) {
      src = item[0];
      dest = item[1];
    } else {
      dest = item.match(/(?:node_modules|bower_components)\/([^\/]+)/);
      dest = dest && dest[1] || '';
    }
    gulp.src(src)
      .pipe(gulp.dest('dist/vendor/' + dest)).on('finish', done);
  }, done);
});

gulp.task('app-copy-css-dependencies', function (done) {
  async.each([
    ['node_modules/font-awesome/css/font-awesome.css', 'font-awesome/css'],
    ['node_modules/font-awesome/fonts/**/*', 'font-awesome/fonts'],
    ['node_modules/hint.css/hint.css', 'hint-css']
  ], function (item, done) {
    var src = item, dest = '';
    if (Array.isArray(item)) {
      src = item[0];
      dest = item[1];
    } else {
      dest = item.match(/(?:node_modules|bower_components)\/([^\/]+)/);
      dest = dest && dest[1] || '';
    }
    gulp.src(src)
      .pipe(gulp.dest('dist/style/vendor/' + dest)).on('finish', done);
  }, done);
});
