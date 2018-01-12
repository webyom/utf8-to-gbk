var gulp = require('gulp'),
    electron = require('electron-connect').server.create();

gulp.task('serve', function (done) {
  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch([
    'dist/main.js'
  ], electron.restart);

  // Reload renderer process
  gulp.watch([
    'dist/**/*',
    '!dist/main.js'
  ], electron.reload);

  done();
});
