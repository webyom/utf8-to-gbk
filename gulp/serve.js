var gulp = require('gulp'),
    electron = require('electron-connect').server.create();

gulp.task('serve', function (done) {
  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch([
    'app/content/main.js'
  ], electron.restart);

  // Reload renderer process
  gulp.watch([
    'app/content/**/*',
    '!app/content/main.js'
  ], electron.reload);

  done();
});
