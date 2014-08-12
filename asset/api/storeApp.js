var storeApp = angular
      .module('storeApp', ['ngRoute', 'ngSanitize', 'facebook', 'gsn.core'])
      .config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$sceProvider', '$httpProvider', 'FacebookProvider', function ($routeProvider, $locationProvider, $sceDelegateProvider, $sceProvider, $httpProvider, FacebookProvider) {

        gsn.applyConfig(window.globalConfig.data || {});

        FacebookProvider.init(gsn.config.FacebookAppId);

        //gets rid of the /#/ in the url and allows things like 'bootstrap collapse' to function
        $locationProvider.html5Mode(true).hashPrefix('!');
        $httpProvider.interceptors.push('gsnAuthenticationHandler');

        //#region security config
        // For security reason, please do not disable $sce 
        // instead, please use trustHtml filter with data-ng-bind-html for specific trust
        // $sceProvider.enabled(true);

        $sceDelegateProvider.resourceUrlWhitelist([
          // Allow same origin resource loads.
          'self',
          'https://*.gsn2.com/**',
          'http://**.gsn.io/**',
          'http://images.gsngrocers.com/**',
          'http://insight.coupons.com/**']);

        // The blacklist overrides the whitelist so the open redirect here is blocked.
        // $sceDelegateProvider.resourceUrlBlacklist([
        //    'http://myapp.example.com/clickThru**']);

        //#endregion
      
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;

        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
      }])
      .run(['$window', '$timeout', '$rootScope', 'gsnApi', 'gsnProfile', 'gsnStore', 'gsnDfp', 'gsnYoutech', '$gsnSdk',  function ($window, $timeout, $rootScope, gsnApi, gsnProfile, gsnStore, gsnDfp, gsnYoutech, $gsnSdk) {
        /// <summary></summary>
        /// <param name="$window" type="Object">window object</param> 
        /// <param name="$timeout" type="Object">timeout object</param>  
        /// <param name="$rootScope" type="Object">root scope</param>    
        /// <param name="gsnApi" type="Object">api object</param>
        /// <param name="gsnProfile" type="Object">profile object</param>
        /// <param name="gsnStore" type="Object">store object </param>
        /// <param name="gsnDfp" type="Object">dfp object</param>
        /// <param name="gsnYoutech" type="Object">youtech object</param>     
        /// <param name="$gsnSdk" type="Object">sdk service</param>

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