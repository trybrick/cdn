var gulp =       require('gulp');
var gutil =      require('gulp-util');
var uglify =     require('gulp-uglify');
var jshint =     require('gulp-jshint');
var webpack =    require('gulp-webpack');
var rename =     require('gulp-rename');
var coffee =     require('gulp-coffee');
var concat =     require('gulp-concat');
var header =     require('gulp-header');
var git =        require('gulp-git');
var runSeq =     require('run-sequence');
var fs =         require('fs');
var exec =       require('child_process').exec;
                 require('gulp-grunt')(gulp);

var config = {
  chains: [218, 'roundy'],
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

function createCopyTask(chain) {
  // create copy tasks
  gulp.task('copy-ds-' + chain, function() {
    return gulp.src('git_components/ds-' + chain + '/asset/' + chain + '**',
      { base: 'git_components/ds-' + chain + '/asset/' + chain, env: process.env })
      .pipe(gulp.dest('asset/' + chain));
  });

  config.tasksCopy.push('copy-ds-' + chain);
}

function createChainTask(chain) {
  // create clone tasks
  gulp.task('clone-ds-' + chain, function(cb) {
    if (!fs.existsSync('./git_components/ds-' + chain )) {
      var arg = 'clone -b ' + config.branch + ' https://github.com/gsn/ds-' + chain + '.git git_components/ds-' + chain;
      // console.log(arg)
      return git.exec({args:arg }, function (err, stdout) {
        if (err) throw err;
        createCopyTask(chain);
        cb();
      })
    }
    else {
      var arg = 'git pull origin ' + config.branch;
      exec(arg, { cwd: process.cwd() + '/git_components/ds-' + chain },
          function (error, stdout, stderr) {
            if (stdout.indexOf('up-to-date') < 0 || !fs.existsSync('./asset/' + chain)) {
              // create copy tasks
              gulp.task('copy-ds-' + chain, function() {
                return gulp.src('git_components/ds-' + chain + '/asset/' + chain + '/**',
                  { base: 'git_components/ds-' + chain + '/asset/' + chain, env: process.env })
                  .pipe(gulp.dest('asset/' + chain));
              });

              config.tasksCopy.push('copy-ds-' + chain);
            }
            cb();
        });
    }
  });
  config.tasksClone.push('clone-ds-' + chain);
}

// build task off current branch name
for(var c in config.chains) {
  var chain = config.chains[c];
  createChainTask(chain);
};

gulp.task('build-copy', function(cb){
  if (config.tasksCopy.length > 0)
    runSeq(config.tasksCopy, cb);
  else cb();
});

// run tasks in sequential order
gulp.task('default', function(cb) {
  runSeq('current-branch', config.tasksClone, 'build-copy', cb);
});
