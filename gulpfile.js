var gulp =       require('gulp');
var gutil =      require('gulp-util');
var uglify =     require('gulp-uglify');
var jshint =     require('gulp-jshint');
var webpack =    require('gulp-webpack');
var rename =     require('gulp-rename');
var coffee =     require('gulp-coffee');
var concat =     require('gulp-concat');
var clean =      require('gulp-clean');
var header =     require('gulp-header');
var bower =      require('gulp-bower');
                 require('gulp-grunt')(gulp);

var chains = [218];
var tasks = ['bower'];

for(var c in chains) {
  var chain = chains[c];
  gulp.task('ds-' + chain, function() {
  return gulp.src('bower_components/ds-' + chain + '/dist/**', { base: 'bower_components/ds-' + chain + '/dist/' })
    .pipe(gulp.dest('asset/' + chain));
  });
  
  tasks.push('ds-' + chain);
}

gulp.task('bower', function() {
  return bower({ cmd: 'update'});
});

gulp.task('default', tasks, function() {
  console.log('success');
});

gulp.task('watch', function() {
  gulp.watch('src/gsndfp.js', ['default']);
});

gulp.task('test', ['grunt-jasmine']);
