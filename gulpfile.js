var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch(["./**/*.html", "./**/*.js"]).on('change', browserSync.reload);
});

gulp.task('build', function() {
  // TODO: minify for faster access
  gulp.src('./index.html').pipe(gulp.dest('./build/'));
  gulp.src('./src/**/*.js').pipe(gulp.dest('./build/src/'));
  gulp.src('./views/**/*.html').pipe(gulp.dest('./build/views/'));
  gulp.src('./assets/**/*.js').pipe(gulp.dest('./build/assets/'));
  gulp.src('./assets/**/*.css').pipe(gulp.dest('./build/assets/'));
});

gulp.task('default', ['serve']);
