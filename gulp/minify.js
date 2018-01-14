var gulp = require('gulp'),
    conf = require('./conf'),
    minify = require('gulp-minifier');

// minify js, css, html
gulp.task('minify', function () {
  return gulp.src([
      'app/content/**/*.+(js|css|html)',
      '!app/content/**/*.min.+(js|css)'
  ])
    .pipe(minify({
      minify: true,
      minifyHTML: {
        collapseWhitespace: true,
        conservativeCollapse: true
      },
      minifyJS: {
        sourceMap: false
      },
      minifyCSS: {
        sourceMap: false,
        sourceMapInlineSources: false
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
    .pipe(gulp.dest('app/content'));
});
