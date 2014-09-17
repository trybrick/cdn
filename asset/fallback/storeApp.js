var storeApp = angular
    .module('storeApp', ['pasvaz.bindonce', 'infinite-scroll', 'ngRoute', 'ngSanitize', 'ngAnimate', 'ngTouch', 'chieffancypants.loadingBar', 'gsn.core', 'vcRecaptcha', 'ui.bootstrap', 'ui.map', 'ui.keypress', 'ui.event', 'ui.utils', 'facebook', 'angulartics', 'angulartics.gsn.ga'])
    .config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$sceProvider', '$httpProvider', 'FacebookProvider', '$analyticsProvider', function ($routeProvider, $locationProvider, $sceDelegateProvider, $sceProvider, $httpProvider, FacebookProvider, $analyticsProvider) {

      gsn.applyConfig(window.globalConfig.data || {});
      FastClick.attach(document.body);
      
      gsn.setTheme('fallback');
      FacebookProvider.init(gsn.config.FacebookAppId);
      $analyticsProvider.init();

      //gets rid of the /#/ in the url and allows things like 'bootstrap collapse' to function
      $locationProvider.html5Mode(true).hashPrefix('!');
      $httpProvider.interceptors.push('gsnAuthenticationHandler');

      //#region security config
      // For security reason, please do not disable $sce 
      // instead, please use trustHtml filter with data-ng-bind-html for specific trust
      $sceProvider.enabled(!gsn.browser.isIE);

      $sceDelegateProvider.resourceUrlWhitelist(gsn.config.SceWhiteList || [
        'self', 'http://localhost:3000/**', 'https://**.gsn2.com/**', 'http://*.gsngrocers.com/**', 'https://*.gsngrocers.com/**']);

      // The blacklist overrides the whitelist so the open redirect here is blocked.
      // $sceDelegateProvider.resourceUrlBlacklist([
      //    'http://myapp.example.com/clickThru**']);

      //#endregion

      //#region route config
      // storeRequired attribute identify route require a store selection
      $routeProvider
          .when('/', {
            templateUrl: gsn.getThemeUrl('/views/home.html'),
            caseInsensitiveMatch: true
          })
          .when('/article', {
            templateUrl: gsn.getThemeUrl('/views/article.html'),
            caseInsensitiveMatch: true
          })
          .when('/changepassword', {
            templateUrl: gsn.getThemeUrl('/views/profile-change-password.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/circular', {
            templateUrl: gsn.getThemeUrl('/views/circular-view.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/circular/flyer', {
            templateUrl: gsn.getThemeUrl('/views/circular-view.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/circular/text', {
            templateUrl: gsn.getThemeUrl('/views/circular-view.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/circular/list', {
            templateUrl: gsn.getThemeUrl('/views/circular-view.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/circular/grid', {
            templateUrl: gsn.getThemeUrl('/views/circular-view.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/coupons', {
            templateUrl: gsn.getThemeUrl('/views/coupons-digital.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/coupons/printable', {
            templateUrl: gsn.getThemeUrl('/views/coupons-printable.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/mealplannerfull', {
            templateUrl: gsn.getThemeUrl('/views/meal-planner.html'),
            caseInsensitiveMatch: true
          })
          .when('/savedlists', {
            templateUrl: gsn.getThemeUrl('/views/saved-lists.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/mylist', {
            templateUrl: gsn.getThemeUrl('/views/shopping-list.html'),
            caseInsensitiveMatch: true
          })
          .when('/mylist/print', {
            templateUrl: gsn.getThemeUrl('/views/shopping-list-print.html'),
            layout: gsn.getThemeUrl('/views/layout-print.html'),
            caseInsensitiveMatch: true
          })
          .when('/mylist/email', {
            templateUrl: gsn.getThemeUrl('/views/shopping-list-email.html'),
            caseInsensitiveMatch: true
          })
          .when('/mypantry', {
            templateUrl: gsn.getThemeUrl('/views/my-pantry.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/myrecipes', {
            templateUrl: gsn.getThemeUrl('/views/my-recipes.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/myspecials', {
            templateUrl: gsn.getThemeUrl('/views/my-specials.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/product', {
            templateUrl: gsn.getThemeUrl('/views/product.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/product/search', {
            templateUrl: gsn.getThemeUrl('/views/product-search.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/profile', {
            templateUrl: gsn.getThemeUrl('/views/profile-edit.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/profile/rewardcard', {
            templateUrl: gsn.getThemeUrl('/views/profile-rewardcard.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/profile/rewardcard/updated', {
            templateUrl: gsn.getThemeUrl('/views/profile-edit.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/recipe', {
            templateUrl: gsn.getThemeUrl('/views/recipe-details.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipe/print', {
            templateUrl: gsn.getThemeUrl('/views/recipe-print.html'),
            layout: gsn.getThemeUrl('/views/layout-print.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipecenter', {
            templateUrl: gsn.getThemeUrl('/views/recipe-center.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipe/search', {
            templateUrl: gsn.getThemeUrl('/views/recipe-search.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipevideo', {
            templateUrl: gsn.getThemeUrl('/views/recipe-video.html'),
            caseInsensitiveMatch: true
          })
          .when('/recoverpassword', {
            templateUrl: gsn.getThemeUrl('/views/recover-password.html'),
            caseInsensitiveMatch: true
          })
          .when('/recoverusername', {
            templateUrl: gsn.getThemeUrl('/views/recover-username.html'),
            caseInsensitiveMatch: true
          })
          .when('/redirect', {
            templateUrl: gsn.getThemeUrl('/views/redirect.html'),
            caseInsensitiveMatch: true
          })
          .when('/registration', {
            templateUrl: gsn.getThemeUrl('/views/registration.html'),
            caseInsensitiveMatch: true
          })
          .when('/registration/facebook', {
            templateUrl: gsn.getThemeUrl('/views/registration.html'),
            caseInsensitiveMatch: true
          })
          .when('/search', {
            templateUrl: gsn.getThemeUrl('/views/custom/search.html'),
            caseInsensitiveMatch: true
          })
          .when('/signin', {
            templateUrl: gsn.getThemeUrl('/views/login.html'),
            caseInsensitiveMatch: true
          })
          .when('/specials', {
            templateUrl: gsn.getThemeUrl('/views/specials.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/storelocator', {
            templateUrl: gsn.getThemeUrl('/views/store-locator.html'),
            caseInsensitiveMatch: true
          })
          .when('/unsubscribe', {
            templateUrl: gsn.getThemeUrl('/views/unsubscribe.html'),
            caseInsensitiveMatch: true
          })
          .otherwise({
            templateUrl: gsn.getThemeUrl('/views/static-content.html'),
            caseInsensitiveMatch: true
          });
      //#endregion

      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;

      //Remove the header used to identify ajax call  that would prevent CORS from working
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])
    .run(['$window', '$timeout', '$rootScope', 'gsnApi', 'gsnProfile', 'gsnStore', 'gsnDfp', 'gsnYoutech', 'gsnAdvertising', '$location',  function ($window, $timeout, $rootScope, gsnApi, gsnProfile, gsnStore, gsnDfp, gsnYoutech, gsnAdvertising, $location) {
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