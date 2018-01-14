var exec = require('child_process').exec,
    gulp = require('gulp'),
    async = require('async'),
    mt2amd = require('gulp-mt2amd');

// move dependencies into build dir
gulp.task('app-dependencies', ['app-babel-external-helpers', 'app-bundle-css-dependencies', 'app-copy-js-dependencies', 'app-copy-css-dependencies']);

gulp.task('app-babel-external-helpers', function (done) {
  exec('mkdir -p app/content/vendor/babel && ./node_modules/.bin/babel-external-helpers > app/content/vendor/babel/external-helpers.js', done);
});

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
      .pipe(gulp.dest('app/content/vendor/' + dest)).on('finish', done);
  }, done);
});

gulp.task('app-copy-js-dependencies', function (done) {
  async.each([
    'node_modules/gulp-mt2amd/lib/css-module-helper.js',
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
      .pipe(gulp.dest('app/content/vendor/' + dest)).on('finish', done);
  }, done);
});

gulp.task('app-copy-css-dependencies', function (done) {
  async.each([
    ['app/node_modules/font-awesome/css/font-awesome.css', 'font-awesome/css'],
    ['app/node_modules/font-awesome/fonts/**/*', 'font-awesome/fonts'],
    ['app/node_modules/hint.css/hint.css', 'hint-css']
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
      .pipe(gulp.dest('app/content/style/vendor/' + dest)).on('finish', done);
  }, done);
});
