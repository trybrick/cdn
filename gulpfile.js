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
  return git.revParse({args:'--abbrev-ref HEAD'}, function(err, hash) {
    if (err) cb();

    config.branch = hash;
    cb();
  });
});

// build task off current branch name
for(var c in config.chains) {
  var chain = config.chains[c];

  // create clone tasks
  gulp.task('clone-ds-' + chain, function() {
    if (!fs.existsSync('./git_components/ds-' + chain )){
      return git.clone('https://github.com/gsn/ds-' + chain, {args:'-b ' + config.branch + ' git_components/ds-' + chain }, function (err) {
        if (err) throw err;
      })
    }
    else {
      return git.pull('origin', config.branch, {args: '--rebase', cwd: 'git_components/ds-' + chain}, function (err) {
        if (err) throw err;
      });
    }

  });
  config.tasksClone.push('clone-ds-' + chain);

  // create copy tasks
  gulp.task('copy-ds-' + chain, function() {
    return gulp.src('git_components/ds-' + chain + '/dist/**', { base: 'git_components/ds-' + chain + '/dist/' })
      .pipe(gulp.dest('asset/' + chain));
  });
  config.tasksCopy.push('copy-ds-' + chain);
};

// run tasks in sequential order
gulp.task('default', function(cb) {
  runSeq('current-branch', config.tasksClone, config.tasksCopy, cb);
});
