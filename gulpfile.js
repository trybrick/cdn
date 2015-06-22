var gulp =       require('gulp');
var gutil =      require('gulp-util');
var rename =     require('gulp-rename');
var coffee =     require('gulp-coffee');
var concat =     require('gulp-concat');
var header =     require('gulp-header');
var git =        require('gulp-git');
var runSeq =     require('run-sequence');
var fs =         require('fs');
var del =        require('del');
var replace =    require('gulp-replace');
var path =       require('path');
var bower =      require('gulp-bower');
var exec =       require('child_process').exec;

var config = {
  chains: [75, 119, 129, 147, 188, 215, 216, 217, 218, 280, 281, 294, 'roundy', 'silver', 'bronze', 'common', 'bootstrap', 'foundation'],
  tasks: [ 'clone-ds', 'copy-ds'],
  tasksClone: [],
  tasksCopy: [],
  branch: 'master'
};
var isWin = /^win/.test(process.platform);

// get the current branch name
gulp.task('current-branch', function(cb) {
  return git.exec({ args: 'branch' }, function(err, stdout) {
    if (err) throw err;
    config.branch = stdout.replace('* ', '').replace(/\s*$/gi, '');
    cb();
  });
});

function createCopyTask(chain) {
  var srcFile = 'git_components/ds-' + chain + '/asset/' + chain;
  var destFile = 'asset/' + chain;
  if (chain == 'common')
  {
    srcFile = 'git_components/ds-' + chain + '/asset/**';
    destFile = 'asset';
  }

  gulp.task('copy-ds-' + chain, function(cb) {
    if (chain == 'common') {
        gulp.src(srcFile, { base: srcFile.replace('/**', ''), env: process.env })
        .pipe(gulp.dest(destFile));
        return cb();
      } else {
        var exec = require('child_process').exec,
          child,
          cmd = "rsync -avxq '" + path.resolve(srcFile) + "' '" + path.resolve(destFile + '/../') + "'";

        if (isWin) {
          cmd = 'xcopy "' + path.resolve(srcFile) + '" "' + path.resolve(destFile) + '" /E /S /R /D /C /Y /I /Q';
        }
        console.log(cmd);
        return child = exec(cmd,
          function (error, stdout, stderr) {
            cb();
            if (error !== null) {
              console.log(chain + ' exec error: ' + error);
            }
        });
      } // else
    });
  
  config.tasksCopy.push('copy-ds-' + chain);
}

gulp.task('clean', function(cb) {
  del(['./git_components/**'], cb);
});

function createChainTask(chain) {
  // create clone tasks
  gulp.task('clone-ds-' + chain, function(cb) {
    if (!fs.existsSync('./git_components/ds-' + chain )) {
      var arg = 'clone -b ' + config.branch + ' https://github.com/gsn/ds-' + chain + '.git git_components/ds-' + chain;
      // console.log(arg)
      return git.exec({args:arg }, function (err, stdout) {
        if (err) throw err;
        if (chain != 'common') {
          createCopyTask(chain);
        }
        cb();
      })
    }
    else {
      var arg = 'git fetch && git merge --ff-only origin/' + config.branch;
      exec(arg, { cwd: process.cwd() + '/git_components/ds-' + chain },
          function (error, stdout, stderr) {
            if (stdout.indexOf('up-to-date') < 0 || !fs.existsSync('./asset/' + chain)) {
              if (chain != 'common') {
                createCopyTask(chain);
              }
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

// create bower task
gulp.task('bower', function() {
  return bower({ cmd: 'update'});
})

// always copy common
createCopyTask('common');

// copy gsndfp
gulp.task('copy-gsndfp', function() {
  
  if (!fs.existsSync('./script/gsndfp'))
    fs.mkdirSync('./script/gsndfp')

  return gulp.src(['./bower_components/gsndfp/gsndfp.js', './bower_components/gsndfp/gsndfp.min.js'])
    .pipe(gulp.dest('./script/gsndfp'));
});

// copy gcprinter
gulp.task('copy-gcprinter', function() {
  
  if (!fs.existsSync('./script/gcprinter'))
    fs.mkdirSync('./script/gcprinter')

  return gulp.src(['./bower_components/gcprinter/gcprinter.js', './bower_components/gcprinter/gcprinter.min.js'])
    .pipe(gulp.dest('./script/gcprinter'));
});

// copy gsncore
gulp.task('copy-gsncore', function() {
  
  if (!fs.existsSync('./script/gsncore/latest'))
    fs.mkdirSync('./script/gsncore/latest')

  return gulp.src(['./bower_components/gsncore/**'])
    .pipe(gulp.dest('./script/gsncore/latest'));
});


gulp.task('ds-common-config-for-local-cdn', function(){
  return gulp.src(['./git_components/ds-common/asset/config.json'])
    .pipe(replace('http://cdn-staging.gsngrocers.com', ''))
    .pipe(gulp.dest('./asset'));
});

config.tasksCopy.push('copy-gsndfp');
config.tasksCopy.push('copy-gcprinter');
config.tasksCopy.push('copy-gsncore');

// run tasks in sequential order
gulp.task('default', function(cb) {
  runSeq('current-branch', 'bower', config.tasksClone, 'build-copy', 'ds-common-config-for-local-cdn', cb);
});
