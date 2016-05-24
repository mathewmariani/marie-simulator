var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('link_libraries', function() {
  gulp.src('./source/_libs/**/*')
    .pipe(gulp.dest('./build/lib'));
});

gulp.task('jade', function() {
    return gulp.src('./source/index.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./build/'))
});

gulp.task('compile_js_release', function() {
  var options = {
      mangle: true
  };

  // order here is important
  gulp.src([
    './source/_js/build.js',
    './source/_js/emulator/opcodes.js',
    './source/_js/emulator/memory.js',
    './source/_js/emulator/register8.js',
    './source/_js/emulator/register12.js',
    './source/_js/emulator/register16.js',
    './source/_js/emulator/cpu.js',
    './source/_js/assembler/assembler.js',
    './source/_js/ui/*.js'])
      .pipe(uglify(options))
      .pipe(concat('mariesimulator.js'))
      .pipe(gulp.dest('./build/'));
});

gulp.task('compile_js_debug', function() {
  return gulp.src([
    './source/_js/build.js',
    './source/_js/emulator/opcodes.js',
    './source/_js/emulator/memory.js',
    './source/_js/emulator/register8.js',
    './source/_js/emulator/register12.js',
    './source/_js/emulator/register16.js',
    './source/_js/emulator/cpu.js',
    './source/_js/assembler/assembler.js',
    './source/_js/ui/*.js'])
      .pipe(concat('mariesimulator.js'))
      .pipe(gulp.dest('./build/'));
});


gulp.task('build_release', ['jade', 'compile_js_release', 'link_libraries']);
gulp.task('build_debug', ['jade', 'compile_js_debug', 'link_libraries']);
gulp.task('default', ['serve']);
