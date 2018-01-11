var gulp = require('gulp'),
    conf = require('./conf'),
    eslint = require('gulp-eslint');

// eslint js final, check console.log ...
gulp.task('eslint-final', function () {
  return gulp.src([
    'dist/js/' + conf.PROJECT_NAME + '/**/*.js',
    '!dist/js/' + conf.PROJECT_NAME + '/vendor/**/*.js'
  ])
    .pipe(eslint({
      useEslintrc: false,
      rules: {
        "no-console": 2
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
