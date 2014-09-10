var storeApp = angular
    .module('storeApp', ['ngRoute', 'ngSanitize', 'ngAnimate', 'ngTouch', 'chieffancypants.loadingBar', 'gsn.core', 'vcRecaptcha', 'ui.bootstrap', 'ui.map', 'ui.keypress', 'ui.event', 'ui.utils', 'facebook', 'angulartics.gsn.ga'])
    .config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$sceProvider', '$httpProvider', 'FacebookProvider', '$analyticsProvider', function ($routeProvider, $locationProvider, $sceDelegateProvider, $sceProvider, $httpProvider, FacebookProvider, $analyticsProvider) {

      gsn.applyConfig(window.globalConfig.data || {});

      gsn.setTheme('Bronze');
      FacebookProvider.init(gsn.config.FacebookAppId);
      $analyticsProvider.init();

      //gets rid of the /#/ in the url and allows things like 'bootstrap collapse' to function
      $locationProvider.html5Mode(true).hashPrefix('!');
      $httpProvider.interceptors.push('gsnAuthenticationHandler');

      //#region security config
      // For security reason, please do not disable $sce 
      // instead, please use trustHtml filter with data-ng-bind-html for specific trust

      // stupid slow IE
      $sceProvider.enabled(!gsn.browser.isIE);

      $sceDelegateProvider.resourceUrlWhitelist([
         // Allow same origin resource loads.
         'self',
         'https://*.gsn2.com/**',
         'http://images.gsngrocers.com/**']);

      // The blacklist overrides the whitelist so the open redirect here is blocked.
      // $sceDelegateProvider.resourceUrlBlacklist([
      //    'http://myapp.example.com/clickThru**']);

      //#endregion

      //#region route config
      // storeRequired attribute identify route require a store selection
      $routeProvider
          .when('/', {
            templateUrl: gsn.getThemeUrl('/views/engine/home.html'),
            caseInsensitiveMatch: true
          })
          .when('/changepassword', {
            templateUrl: gsn.getThemeUrl('/views/engine/profile-change-password.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/circular', {
            templateUrl: gsn.getThemeUrl('/views/engine/circular.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/circular/print', {
            templateUrl: gsn.getThemeUrl('/views/engine/circular.html'),
            layout: gsn.getThemeUrl('/views/engine/layout-print.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/contactus', {
            templateUrl: gsn.getThemeUrl('/views/engine/contact-us.html'),
            caseInsensitiveMatch: true
          })
          .when('/coupons/printable', {
            templateUrl: gsn.getThemeUrl('/views/engine/coupons-printable.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/emailpreview/registration', {
            templateUrl: gsn.getThemeUrl('/views/engine/email/registration.html'),
            layout: gsn.getThemeUrl('/views/layout-empty.html'),
            caseInsensitiveMatch: true
          })
          .when('/emailpreview/registration-facebook', {
            templateUrl: gsn.getThemeUrl('/views/engine/email/registration-facebook.html'),
            layout: gsn.getThemeUrl('/views/layout-empty.html'),
            caseInsensitiveMatch: true
          })
          .when('/savedlists', {
            templateUrl: gsn.getThemeUrl('/views/engine/saved-lists.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/mylist', {
            templateUrl: gsn.getThemeUrl('/views/engine/shopping-list.html'),
            caseInsensitiveMatch: true
          })
          .when('/mylist/print', {
            templateUrl: gsn.getThemeUrl('/views/engine/shopping-list-print.html'),
            layout: gsn.getThemeUrl('/views/engine/layout-print.html'),
            caseInsensitiveMatch: true
          })
          .when('/mylist/email', {
            templateUrl: gsn.getThemeUrl('/views/engine/shopping-list-email.html'),
            caseInsensitiveMatch: true
          })
          .when('/profile', {
            templateUrl: gsn.getThemeUrl('/views/engine/profile-edit.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/profile/rewardcard', {
            templateUrl: gsn.getThemeUrl('/views/engine/profile-rewardcard.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/profile/rewardcard/updated', {
            templateUrl: gsn.getThemeUrl('/views/engine/profile-edit.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/recipe', {
            templateUrl: gsn.getThemeUrl('/views/engine/recipe-details.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipe/featured', {
            templateUrl: gsn.getThemeUrl('/views/engine/recipe-details.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipe/print', {
            templateUrl: gsn.getThemeUrl('/views/engine/recipe-print.html'),
            layout: gsn.getThemeUrl('/views/engine/layout-print.html'),
            caseInsensitiveMatch: true
          })
          .when('/recoverpassword', {
            templateUrl: gsn.getThemeUrl('/views/engine/recover-password.html'),
            caseInsensitiveMatch: true
          })
          .when('/recoverusername', {
            templateUrl: gsn.getThemeUrl('/views/engine/recover-username.html'),
            caseInsensitiveMatch: true
          })
          .when('/redirect', {
            templateUrl: gsn.getThemeUrl('/views/engine/redirect.html'),
            caseInsensitiveMatch: true
          })
          .when('/registration', {
            templateUrl: gsn.getThemeUrl('/views/engine/registration.html'),
            caseInsensitiveMatch: true
          })
          .when('/registration/facebook', {
            templateUrl: gsn.getThemeUrl('/views/engine/registration.html'),
            caseInsensitiveMatch: true
          })
          .when('/signin', {
            templateUrl: gsn.getThemeUrl('/views/engine/login.html'),
            caseInsensitiveMatch: true
          })
          .when('/storelocator', {
            templateUrl: gsn.getThemeUrl('/views/engine/store-locator.html'),
            caseInsensitiveMatch: true
          })
          .otherwise({
            templateUrl: gsn.getThemeUrl('/views/engine/static-content.html'),
            caseInsensitiveMatch: true
          });
      //#endregion

    }])
    .run(['$window', '$timeout', '$rootScope', 'gsnApi', 'gsnProfile', 'gsnStore', 'gsnDfp', 'gsnYoutech', 'gsnAdvertising', '$localStorage', function ($window, $timeout, $rootScope, gsnApi, gsnProfile, gsnStore, gsnDfp, gsnYoutech, gsnAdvertising, $localStorage) {
      /// <summary></summary>
      /// <param name="$window" type="Object"></param> 
      /// <param name="$timeout" type="Object"></param>  
      /// <param name="$rootScope" type="Object"></param>    
      /// <param name="gsnApi" type="Object"></param>
      /// <param name="gsnProfile" type="Object"></param>
      /// <param name="gsnStore" type="Object"></param>
      /// <param name="gsnDfp" type="Object">kick start dfp</param>
      /// <param name="gsnYoutech" type="Object">kick start youtech</param>

      // init profile so we can get token
      gsnProfile.initialize();

    }]);
