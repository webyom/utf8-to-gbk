var gulp = require('gulp'),
    conf = require('./conf'),
    htmlI18n = require('gulp-html-i18n');

// resolve reference in language resource file
gulp.task('i18n-resolve-reference', function () {
  return gulp.src([
    'src/lang/**/*.json'
  ])
    .pipe(htmlI18n.resolveReference({
      langDir: 'src/lang'
    }))
    .pipe(gulp.dest('dist/lang'));
});

// validate consistence between each lang version
gulp.task('i18n-validate', function () {
  return gulp.src([
    'src/lang/**/*.json'
  ])
    .pipe(htmlI18n.validateJsonConsistence({
      langDir: 'src/lang'
    }));
});

// sort key in lang json
// caution!!! this will overwrite the source file in src folder!!!
gulp.task('i18n-sort', ['i18n-validate'], function () {
  return gulp.src([
    'src/lang/**/*.json'
  ])
    .pipe(htmlI18n.jsonSortKey({
      endWithNewline: true,
      reserveOrder: function (keyStack) {
        return keyStack[1] == 'option' && keyStack.length === 3;
      }
    }))
    .pipe(gulp.dest('src/lang'));
});
