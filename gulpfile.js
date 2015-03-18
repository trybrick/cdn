var gulp =       require('gulp');
var gutil =      require('gulp-util');
var uglify =     require('gulp-uglify');
var jshint =     require('gulp-jshint');
var webpack =    require('gulp-webpack');
var rename =     require('gulp-rename');
var coffee =     require('gulp-coffee');
var concat =     require('gulp-concat');
var header =     require('gulp-header');
var bower =      require('gulp-bower');
var git =        require('gulp-git');
var runSeq =     require('run-sequence');
var fs =         require('fs');
var shell =      require('gulp-shell');
                 require('gulp-grunt')(gulp);

var config = {
  chains: [218],
  tasks: [ 'clone-ds', 'copy-ds'],
  tasksClone: [],
  tasksCopy: [],
  branch: 'master'
};

// get the current branch name
gulp.task('current-branch', function(cb) {
  return git.exec({ args: 'branch' }, function(err, stdout) {
    if (err) throw err;
    config.branch = stdout.replace('* ', '').replace(/\s*$/gi, '');
    cb();
  });
});

// build task off current branch name
for(var c in config.chains) {
  var chain = config.chains[c];

  // create clone tasks
  gulp.task('clone-ds-' + chain, function() {
    if (!fs.existsSync('./git_components/ds-' + chain )){
      var arg = 'clone -b ' + config.branch + ' https://github.com/gsn/ds-' + chain + '.git git_components/ds-' + chain;
      // console.log(arg)
      return git.exec({args:arg }, function (err, stdout) {
        if (err) throw err;
      })
    }
    else {
      var arg = 'pull';
      /* return git.exec({args: arg, cwd: './git_components/ds-' + chain}, function (err, stdout) {
        if (err) throw err;
        cb();
      });*/
      return shell.task([
        'git pull origin ' + config.branch
      ], { cwd: 'git_components/ds-' + chain}) ();
    }

  });
  config.tasksClone.push('clone-ds-' + chain);
};

gulp.task('build-copy', function(cb){
  // build task off current branch name
  for(var c in config.chains) {
    var chain = config.chains[c];

    // create copy tasks
    gulp.task('copy-ds-' + chain, function() {
      return gulp.src('git_components/ds-' + chain + '/dist/**', { base: 'git_components/ds-' + chain + '/dist/' })
        .pipe(gulp.dest('asset/' + chain));
    });
    config.tasksCopy.push('copy-ds-' + chain);
  };

  runSeq(config.tasksCopy, cb);
})

// run tasks in sequential order
gulp.task('default', function(cb) {
  runSeq('current-branch', config.tasksClone, 'build-copy', cb);
});
