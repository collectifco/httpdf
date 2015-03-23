var gulp = require('gulp');
var sass = require('gulp-sass');
var neat = require('node-neat').includePaths;
var cp = require('child_process');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var browserSync = require('browser-sync');

var paths = {
  scss: '_src/scss/**/*',
  html: '**/*.html',
  images: '_src/img/**/*',
  dest: 'dist/'
};

gulp.task('browsersync', function() {
  browserSync({
    server: {
          baseDir: "./_site/"
      }
  });
});

gulp.task('sass', function () {
    gulp.src('_src/scss/*.scss')
        .pipe(sass({
          includePaths: ['sass'].concat(neat)
        }))
        .on('error', function (err) {
        	console.log(err)
		})
        .pipe(gulp.dest('./_src/css'));
});

gulp.task('jekyll', function(done) {
  browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');
  return cp.spawn('jekyll', ['build', '-q', '--config=_config.yml', '--destination=' + '_site'], { stdio: 'inherit' })
  .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll'], function() {
  browsersync.reload();
});

gulp.task('cssmin', function () {
    gulp.src('_src/css/**/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dest + 'css'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scss, ['sass','jekyll','cssmin']);
  gulp.watch(paths.html, ['jekyll']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['sass','browsersync','watch','cssmin','jekyll']);