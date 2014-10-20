// Karma configuration
// Generated on Mon Sep 22 2014 11:50:35 GMT-0500 (Central Daylight Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/libs/ng-file-upload/angular-file-upload-shim.js',
      'public/libs/angular/angular.js',
      'public/libs/angular-route/angular-route.js',
      'public/libs/jquery/dist/jquery.js',
      'public/libs/bootstrap/dist/js/bootstrap.js',
      'public/libs/angular-bootstrap/ui-bootstrap.js',
      'public/libs/angular-bootstrap/ui-bootstrap-tpls.js',
      'public/libs/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
      'public/libs/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.js',
      'public/libs/angular-xeditable/dist/js/xeditable.js',
      'public/libs/angular-mocks/angular-mocks.js',
      'public/js/app.js',
      'public/js/appRoutes.js',
      'public/actions/*.js',
      'public/js/services/*.js',
      'public/libs/ng-file-upload/angular-file-upload.js',
      'public/js/filters/*.js',
      'public/looknfeel/fontService.js',
      'test/**/*Spec.js'
    ],

    // list of files to exclude
    exclude: [
      
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['ChromeCanary'],
    singleRun: false
  });
};
