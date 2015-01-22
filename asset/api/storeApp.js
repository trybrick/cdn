var storeApp = angular
      .module('storeApp', ['ngSanitize', 'gsn.core'])
      .config(['$locationProvider', '$sceDelegateProvider', '$sceProvider', '$httpProvider', function ($locationProvider, $sceDelegateProvider, $sceProvider, $httpProvider) {

        gsn.applyConfig(window.globalConfig.data || {});
        $locationProvider.html5Mode(true).hashPrefix('!');
        $httpProvider.interceptors.push('gsnAuthenticationHandler');
        $sceProvider.enabled(!gsn.browser.isIE);
        $sceDelegateProvider.resourceUrlWhitelist(gsn.config.SceWhiteList || [
          'self', 'http://localhost:3000/**', 'https://**.gsn2.com/**', 'http://*.gsngrocers.com/**', 'https://*.gsngrocers.com/**']);
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
      }])
      .run(['$window', '$timeout', '$rootScope', 'gsnApi', 'gsnProfile', 'gsnStore', 'gsnDfp', 'gsnYoutech', '$gsnSdk',  function ($window, $timeout, $rootScope, gsnApi, gsnProfile, gsnStore, gsnDfp, gsnYoutech, $gsnSdk) {
        // disable youtech
        gsnYoutech.enable = false;
      
        // init profile so we can get token
        gsnProfile.initialize(true);

        $gsnSdk.init({
          acl: [
            'aisle50.com', '*.aisle50.com', 
            '*.gsngrocers.com', 
            'wickedmagpie.com', '*.wickedmagpie.com'
          ],
          local: '/name.html',
          swf: '/scripts/easyxdm.swf'
        });

      }]);