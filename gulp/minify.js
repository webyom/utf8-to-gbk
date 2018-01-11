var gulp = require('gulp'),
    conf = require('./conf'),
    minify = require('gulp-minifier');

// minify js, css, html
gulp.task('minify', function () {
  return gulp.src([
      'dist/**/*.+(js|css|html)',
      '!dist/**/*.min.+(js|css)'
  ])
    .pipe(minify({
      minify: conf.IS_PRODUCTION,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: {
        outSourceMap: true,
        sourceMapIncludeSources: true
      },
      minifyCSS: {
        sourceMap: true,
        sourceMapInlineSources: true
      },
      getKeptComment: function (content, filePath) {
        var res = [];
        var m;
        m = content.match(/\/\*[\s\S]*?\*\//img);
        if (m) {
          m.forEach(function (c) {
            if (c.indexOf('/*!') === 0) {
              res.push(c);
            }
          });
        }
        return res.length && res.join('\n') + '\n' || '';
      }
    }))
    .pipe(gulp.dest('dist'));
});
