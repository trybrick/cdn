var storeApp = angular
    .module('storeApp', ['pasvaz.bindonce', 'infinite-scroll', 'ngRoute', 'ngSanitize', 'ngAnimate', 'ngTouch', 'chieffancypants.loadingBar', 'gsn.core', 'vcRecaptcha', 'ui.bootstrap', 'ui.map', 'ui.keypress', 'ui.event', 'ui.utils', 'facebook', 'angulartics', 'angulartics.gsn.ga'])
    .config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$sceProvider', '$httpProvider', 'FacebookProvider', '$analyticsProvider', function ($routeProvider, $locationProvider, $sceDelegateProvider, $sceProvider, $httpProvider, FacebookProvider, $analyticsProvider) {

      gsn.applyConfig(window.globalConfig.data || {});
	    gsn.config.hasRoundyProfile = true;

      if (gsn.config.Theme) {
        gsn.setTheme(gsn.config.Theme);
      }

      FastClick.attach(document.body);
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
            templateUrl: gsn.getContentUrl('/views/home.html'),
            caseInsensitiveMatch: true
          })
          .when('/article', {
            templateUrl: gsn.getContentUrl('/views/article.html'),
            caseInsensitiveMatch: true
          })
          .when('/changepassword', {
            templateUrl: gsn.getContentUrl('/views/profile-change-password.html'),
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
          .when('/community', {
            templateUrl: gsn.getContentUrl('/views/custom/community.html'),
            caseInsensitiveMatch: true
          })
          .when('/contactus', {
            templateUrl: gsn.getContentUrl('/views/contact-us.html'),
            controller: 'ContactUsCtrl',
            caseInsensitiveMatch: true
          })
          .when('/coupons', {
            templateUrl: gsn.getContentUrl('/views/coupons-digital.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/coupons/printable', {
            templateUrl: gsn.getContentUrl('/views/coupons-printable.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/emailpreview/registration', {
            templateUrl: gsn.getContentUrl('/views/email/registration.html'),
            layout: gsn.getContentUrl('/views/layout-empty.html'),
            caseInsensitiveMatch: true
          })
          .when('/emailpreview/registration-facebook', {
            templateUrl: gsn.getContentUrl('/views/email/registration-facebook.html'), 
            layout: gsn.getContentUrl('/views/layout-empty.html'),
            caseInsensitiveMatch: true
          })
          .when('/mealplannerfull', {
            templateUrl: gsn.getContentUrl('/views/meal-planner.html'),
            caseInsensitiveMatch: true
          })
          .when('/savedlists', {
            templateUrl: gsn.getContentUrl('/views/saved-lists.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/mylist', {
            templateUrl: gsn.getContentUrl('/views/shopping-list.html'),
            caseInsensitiveMatch: true
          })
          .when('/mylist/print', {
            templateUrl: gsn.getContentUrl('/views/shopping-list-print.html'),
            layout: gsn.getContentUrl('/views/layout-print.html'),
            caseInsensitiveMatch: true
          })
          .when('/mylist/email', {
            templateUrl: gsn.getContentUrl('/views/shopping-list-email.html'),
            caseInsensitiveMatch: true
          })
          .when('/mypantry', {
            templateUrl: gsn.getContentUrl('/views/my-pantry.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/myrecipes', {
            templateUrl: gsn.getContentUrl('/views/my-recipes.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/myspecials', {
            templateUrl: gsn.getContentUrl('/views/my-specials.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/product', {
            templateUrl: gsn.getContentUrl('/views/product.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/product/search', {
            templateUrl: gsn.getContentUrl('/views/product-search.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/recipe', {
            templateUrl: gsn.getContentUrl('/views/recipe-details.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipe/print', {
            templateUrl: gsn.getContentUrl('/views/recipe-print.html'),
            layout: gsn.getContentUrl('/views/layout-print.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipecenter', {
            templateUrl: gsn.getContentUrl('/views/recipe-center.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipe/search', {
            templateUrl: gsn.getContentUrl('/views/recipe-search.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipevideo', {
            templateUrl: gsn.getContentUrl('/views/recipe-video.html'),
            caseInsensitiveMatch: true
          })
          .when('/recoverpassword', {
            templateUrl: gsn.getContentUrl('/views/recover-password.html'),
            caseInsensitiveMatch: true
          })
          .when('/recoverusername', {
            templateUrl: gsn.getContentUrl('/views/recover-username.html'),
            caseInsensitiveMatch: true
          })
          .when('/redirect', {
            templateUrl: gsn.getContentUrl('/views/redirect.html'),
            caseInsensitiveMatch: true
          })
          .when('/registration', {
            templateUrl: gsn.getContentUrl('/views/registration.html'),
            caseInsensitiveMatch: true
          })
          .when('/registration/facebook', {
            templateUrl: gsn.getContentUrl('/views/registration.html'),
            caseInsensitiveMatch: true
          })
          .when('/search', {
            templateUrl: gsn.getContentUrl('/views/custom/search.html'),
            caseInsensitiveMatch: true
          })
          .when('/signin', {
            templateUrl: gsn.getContentUrl('/views/login.html'),
            caseInsensitiveMatch: true
          })
          .when('/specials', {
            templateUrl: gsn.getContentUrl('/views/specials.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/storelocator', {
            templateUrl: gsn.getContentUrl('/views/store-locator.html'),
            caseInsensitiveMatch: true
          })
          .when('/unsubscribe', {
            templateUrl: gsn.getContentUrl('/views/unsubscribe.html'),
            caseInsensitiveMatch: true
          })
          .when('/madia', {
            templateUrl: gsn.getContentUrl('/views/custom/madia.html'),
            caseInsensitiveMatch: true
          })
          .when('/shred415', {
            templateUrl: gsn.getContentUrl('/views/custom/shred415.html'),
            caseInsensitiveMatch: true
          })
          .when('/psaltis', {
            templateUrl: gsn.getContentUrl('/views/custom/psaltis.html'),
            caseInsensitiveMatch: true
          })
          .when('/tentori', {
            templateUrl: gsn.getContentUrl('/views/custom/tentori.html'),
            caseInsensitiveMatch: true
          })
          .when('/nahabedian', {
            templateUrl: gsn.getContentUrl('/views/custom/nahabedian.html'),
            caseInsensitiveMatch: true
          })
          .when('/kim', {
            templateUrl: gsn.getContentUrl('/views/custom/kim.html'),
            caseInsensitiveMatch: true
          })
          .when('/aglibot', {
            templateUrl: gsn.getContentUrl('/views/custom/aglibot.html'),
            caseInsensitiveMatch: true
          })
          .when('/galus', {
            templateUrl: gsn.getContentUrl('/views/custom/galus.html'),
            caseInsensitiveMatch: true
          })
          .when('/pandel', {
            templateUrl: gsn.getContentUrl('/views/custom/pandel.html'),
            caseInsensitiveMatch: true
          })
          .when('/jordan', {
            templateUrl: gsn.getContentUrl('/views/custom/jordan.html'),
            caseInsensitiveMatch: true
          })
          .when('/adolph', {
            templateUrl: gsn.getContentUrl('/views/custom/adolph.html'),
            caseInsensitiveMatch: true
          })
          .when('/ortiz', {
            templateUrl: gsn.getContentUrl('/views/custom/ortiz.html'),
            caseInsensitiveMatch: true
          })
          .when('/priolo', {
            templateUrl: gsn.getContentUrl('/views/custom/priolo.html'),
            caseInsensitiveMatch: true
          })
          .when('/kehoe', {
            templateUrl: gsn.getContentUrl('/views/custom/kehoe.html'),
            caseInsensitiveMatch: true
          })
          .when('/troost', {
            templateUrl: gsn.getContentUrl('/views/custom/troost.html'),
            caseInsensitiveMatch: true
          })
          .when('/galdones', {
            templateUrl: gsn.getContentUrl('/views/custom/galdones.html'),
            caseInsensitiveMatch: true
          })
		      .when('/myaccount', {
            templateUrl: gsn.getThemeUrl('/views/roundy-account.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/maintenance', {
            templateUrl: gsn.getThemeUrl('/views/roundy-apology-page.html'),
            caseInsensitiveMatch: true
          })
          .otherwise({
            templateUrl: gsn.getContentUrl('/views/static-content.html'),
            controller: 'StaticContentCtrl',
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

// ContactUsCtrl
storeApp.controller('ContactUsCtrl', ['$scope', 'gsnProfile', 'gsnApi', '$timeout', 'gsnStore', '$interpolate', '$http', function ($scope, gsnProfile, gsnApi, $timeout, gsnStore, $interpolate, $http) {
  $scope.activate = activate;
  $scope.vm = { PrimaryStoreId: gsnApi.getSelectedStoreId(), ReceiveEmail: true };
  $scope.masterVm = { PrimaryStoreId: gsnApi.getSelectedStoreId(), ReceiveEmail: true };

  $scope.hasSubmitted = false;    // true when user has click the submit button
  $scope.isValidSubmit = true;    // true when result of submit is valid
  $scope.isSubmitting = false;    // true if we're waiting for result from server
  $scope.errorResponse = null;
  $scope.contactSuccess = false;
  $scope.topics = [];
  $scope.topicsByValue = {};
  $scope.storeList = [];
  $scope.captcha = {};
  $scope.storesById = {};

  var template;

  $http.get($scope.getContentUrl('/views/email/contact-us.html'))
    .success(function (response) {
      template = response.replace(/data-ctrl-email-preview/gi, '');
    });

  function activate() {
    gsnStore.getStores().then(function (rsp) {
      $scope.stores = rsp.response;

      // prebuild list base on roundy spec (ﾉωﾉ)
      // make sure that it is order by state, then by name
      $scope.storesById = gsnApi.mapObject($scope.stores, 'StoreId');
    });

    gsnProfile.getProfile().then(function (p) {
      if (p.success) {
        $scope.masterVm = angular.copy(p.response);
        $scope.doReset();
      }
    });

    $scope.topics = gsnApi.groupBy(getData(), 'ParentOption');
    $scope.topicsByValue = gsnApi.mapObject($scope.topics, 'key');
    $scope.parentTopics = $scope.topicsByValue[''];

    delete $scope.topicsByValue[''];
  }

  $scope.getSubTopics = function () {
    return $scope.topicsByValue[$scope.vm.Topic];
  };

  $scope.getFullStateName = function (store) {
    return '=========' + store.LinkState.FullName + '=========';
  };

  $scope.getStoreDisplayName = function (store) {
    return store.StoreName + ' - ' + store.PrimaryAddress + '(#' + store.StoreNumber + ')';
  };

  $scope.doSubmit = function () {
    var payload = $scope.vm;
    if ($scope.myContactUsForm.$valid) {
      payload.CaptchaChallenge = $scope.captcha.challenge;
      payload.CaptchaResponse = $scope.captcha.response;
      payload.Store = $scope.getStoreDisplayName($scope.storesById[payload.PrimaryStoreId]);
      $scope.email = payload;
      payload.EmailMessage = $interpolate(template)($scope);
      // prevent double submit
      if ($scope.isSubmitting) return;

      $scope.hasSubmitted = true;
      $scope.isSubmitting = true;
      $scope.errorResponse = null;
      gsnProfile.sendContactUs(payload)
          .then(function (result) {
            $scope.isSubmitting = false;
            $scope.isValidSubmit = result.success;
            if (result.success) {
              $scope.contactSuccess = true;
            } else if (typeof (result.response) == 'string') {
              $scope.errorResponse = result.response;
            } else {
              $scope.errorResponse = gsnApi.getServiceUnavailableMessage();
            }
          });
    }
  };

  $scope.doReset = function () {
    $scope.vm = angular.copy($scope.masterVm);
    $scope.vm.ConfirmEmail = $scope.vm.Email;
  };

  $scope.activate();
  //#region Internal Methods        
  function getData() {
    return [
        {
          "Value": "Mariano's Rewards Card",
          "Text": "Mariano's Rewards Card",
          "ParentOption": ""
        },
        {
          "Value": "Store Services/Atmosphere",
          "Text": "Store Services/Atmosphere",
          "ParentOption": ""
        },
        {
          "Value": "Employee Attitude/Conduct",
          "Text": "Employee Attitude/Conduct",
          "ParentOption": ""
        },
        {
          "Value": "Nutritional Inquiry",
          "Text": "Nutritional Inquiry",
          "ParentOption": ""
        },
        {
          "Value": "Promotions/Advertising",
          "Text": "Promotions/Advertising",
          "ParentOption": ""
        },
        {
          "Value": "Foreign Object",
          "Text": "Foreign Object",
          "ParentOption": ""
        },
        {
          "Value": "Employment",
          "Text": "Employment",
          "ParentOption": ""
        },
        {
          "Value": "Chairman Bob",
          "Text": "Chairman Bob",
          "ParentOption": ""
        },
        {
          "Value": "Store Signage",
          "Text": "Store Signage",
          "ParentOption": ""
        },
        {
          "Value": "Product Quality in Seafood",
          "Text": "Product Quality in Seafood",
          "ParentOption": ""
        },
        {
          "Value": "Product Quality in Produce",
          "Text": "Product Quality in Produce",
          "ParentOption": ""
        },
        {
          "Value": "Product Quality in Meat",
          "Text": "Product Quality in Meat",
          "ParentOption": ""
        },
        {
          "Value": "Product Quality in Grocery",
          "Text": "Product Quality in Grocery",
          "ParentOption": ""
        },
        {
          "Value": "Product Quality in Deli",
          "Text": "Product Quality in Deli",
          "ParentOption": ""
        },
        {
          "Value": "Product Quality in Bakery",
          "Text": "Product Quality in Bakery",
          "ParentOption": ""
        },
        {
          "Value": "Product Availability in Seafood",
          "Text": "Product Availability in Seafood",
          "ParentOption": ""
        },
        {
          "Value": "Product Availability in Produce",
          "Text": "Product Availability in Produce",
          "ParentOption": ""
        },
        {
          "Value": "Product Availability in Meat",
          "Text": "Product Availability in Meat",
          "ParentOption": ""
        },
        {
          "Value": "Product Availability in Grocery",
          "Text": "Product Availability in Grocery",
          "ParentOption": ""
        },
        {
          "Value": "Product Availability in Deli",
          "Text": "Product Availability in Deli",
          "ParentOption": ""
        },
        {
          "Value": "Product Availability in Dairy",
          "Text": "Product Availability in Dairy",
          "ParentOption": ""
        },
        {
          "Value": "Product Availability in Bakery",
          "Text": "Product Availability in Bakery",
          "ParentOption": ""
        },
        {
          "Value": "Pricing/Coupons",
          "Text": "Pricing/Coupons",
          "ParentOption": ""
        },
        {
          "Value": "Keys Lost",
          "Text": "Keys Lost",
          "ParentOption": ""
        },
        {
          "Value": "Injury/Illness",
          "Text": "Injury/Illness",
          "ParentOption": ""
        },
        {
          "Value": "Incorrect Change/Charge",
          "Text": "Incorrect Change/Charge",
          "ParentOption": ""
        },
        {
          "Value": "ID Check",
          "Text": "ID Check",
          "ParentOption": ""
        },
        {
          "Value": "Employee Praise",
          "Text": "Employee Praise",
          "ParentOption": ""
        },
        {
          "Value": "Gift Card",
          "Text": "Gift Card",
          "ParentOption": ""
        },
        {
          "Value": "Website Problems",
          "Text": "Website Problems",
          "ParentOption": ""
        },

        /* child options */
        {
          "Value": "Cannot find in store",
          "Text": "Cannot find in store",
          "ParentOption": "Product Availability in Bakery"
        }, {
          "Value": "Wish to place special order",
          "Text": "Wish to place special order",
          "ParentOption": "Product Availability in Bakery"
        }, {
          "Value": "Cannot find in store",
          "Text": "Cannot find in store",
          "ParentOption": "Product Availability in Dairy"
        }, {
          "Value": "Wish to place special order",
          "Text": "Wish to place special order",
          "ParentOption": "Product Availability in Dairy"
        }, {
          "Value": "Cannot find in store",
          "Text": "Cannot find in store",
          "ParentOption": "Product Availability in Deli"
        }, {
          "Value": "Wish to place special order",
          "Text": "Wish to place special order",
          "ParentOption": "Product Availability in Deli"
        }, {
          "Value": "Cannot find in store",
          "Text": "Cannot find in store",
          "ParentOption": "Product Availability in Grocery"
        }, {
          "Value": "Wish to place special order",
          "Text": "Wish to place special order",
          "ParentOption": "Product Availability in Grocery"
        }, {
          "Value": "Cannot find in store",
          "Text": "Cannot find in store",
          "ParentOption": "Product Availability in Meat"
        }, {
          "Value": "Wish to place special order",
          "Text": "Wish to place special order",
          "ParentOption": "Product Availability in Meat"
        }, {
          "Value": "Cannot find in store",
          "Text": "Cannot find in store",
          "ParentOption": "Product Availability in Produce"
        }, {
          "Value": "Wish to place special order",
          "Text": "Wish to place special order",
          "ParentOption": "Product Availability in Produce"
        }, {
          "Value": "Cannot find in store",
          "Text": "Cannot find in store",
          "ParentOption": "Product Availability in Seafood"
        }, {
          "Value": "Wish to place special order",
          "Text": "Wish to place special order",
          "ParentOption": "Product Availability in Seafood"
        }, {
          "Value": "Became sick after eating",
          "Text": "Became sick after eating",
          "ParentOption": "Product Quality in Bakery"
        }, {
          "Value": "Expired product",
          "Text": "Expired product",
          "ParentOption": "Product Quality in Bakery"
        }, {
          "Value": "Inquire about recalled product",
          "Text": "Inquire about recalled product",
          "ParentOption": "Product Quality in Bakery"
        }, {
          "Value": "Love the product",
          "Text": "Love the product",
          "ParentOption": "Product Quality in Bakery"
        }, {
          "Value": "My comments",
          "Text": "My comments",
          "ParentOption": "Product Quality in Bakery"
        }, {
          "Value": "Unsatisfactory product",
          "Text": "Unsatisfactory product",
          "ParentOption": "Product Quality in Bakery"
        }, {
          "Value": "Unsatisfactory Roundys Product",
          "Text": "Unsatisfactory Roundys Product",
          "ParentOption": "Product Quality in Bakery"
        }, {
          "Value": "Became sick after eating",
          "Text": "Became sick after eating",
          "ParentOption": "Product Quality in Deli"
        }, {
          "Value": "Expired product",
          "Text": "Expired product",
          "ParentOption": "Product Quality in Deli"
        }, {
          "Value": "Inquire about recalled product",
          "Text": "Inquire about recalled product",
          "ParentOption": "Product Quality in Deli"
        }, {
          "Value": "Love the product",
          "Text": "Love the product",
          "ParentOption": "Product Quality in Deli"
        }, {
          "Value": "My comments",
          "Text": "My comments",
          "ParentOption": "Product Quality in Deli"
        }, {
          "Value": "Unsatisfactory product",
          "Text": "Unsatisfactory product",
          "ParentOption": "Product Quality in Deli"
        }, {
          "Value": "Unsatisfactory Roundys Product",
          "Text": "Unsatisfactory Roundys Product",
          "ParentOption": "Product Quality in Deli"
        }, {
          "Value": "Became sick after eating",
          "Text": "Became sick after eating",
          "ParentOption": "Product Quality in Grocery"
        }, {
          "Value": "Expired product",
          "Text": "Expired product",
          "ParentOption": "Product Quality in Grocery"
        }, {
          "Value": "Inquire about recalled product",
          "Text": "Inquire about recalled product",
          "ParentOption": "Product Quality in Grocery"
        }, {
          "Value": "Love the product",
          "Text": "Love the product",
          "ParentOption": "Product Quality in Grocery"
        }, {
          "Value": "My comments",
          "Text": "My comments",
          "ParentOption": "Product Quality in Grocery"
        }, {
          "Value": "Unsatisfactory product",
          "Text": "Unsatisfactory product",
          "ParentOption": "Product Quality in Grocery"
        }, {
          "Value": "Unsatisfactory Roundys Product",
          "Text": "Unsatisfactory Roundys Product",
          "ParentOption": "Product Quality in Grocery"
        }, {
          "Value": "Became sick after eating",
          "Text": "Became sick after eating",
          "ParentOption": "Product Quality in Meat"
        }, {
          "Value": "Expired product",
          "Text": "Expired product",
          "ParentOption": "Product Quality in Meat"
        }, {
          "Value": "Inquire about recalled product",
          "Text": "Inquire about recalled product",
          "ParentOption": "Product Quality in Meat"
        }, {
          "Value": "Love the product",
          "Text": "Love the product",
          "ParentOption": "Product Quality in Meat"
        }, {
          "Value": "My comments",
          "Text": "My comments",
          "ParentOption": "Product Quality in Meat"
        }, {
          "Value": "Unsatisfactory product",
          "Text": "Unsatisfactory product",
          "ParentOption": "Product Quality in Meat"
        }, {
          "Value": "Unsatisfactory Roundys Product",
          "Text": "Unsatisfactory Roundys Product",
          "ParentOption": "Product Quality in Meat"
        }, {
          "Value": "Became sick after eating",
          "Text": "Became sick after eating",
          "ParentOption": "Product Quality in Produce"
        }, {
          "Value": "Expired product",
          "Text": "Expired product",
          "ParentOption": "Product Quality in Produce"
        }, {
          "Value": "Inquire about recalled product",
          "Text": "Inquire about recalled product",
          "ParentOption": "Product Quality in Produce"
        }, {
          "Value": "Love the product",
          "Text": "Love the product",
          "ParentOption": "Product Quality in Produce"
        }, {
          "Value": "My comments",
          "Text": "My comments",
          "ParentOption": "Product Quality in Produce"
        }, {
          "Value": "Unsatisfactory product",
          "Text": "Unsatisfactory product",
          "ParentOption": "Product Quality in Produce"
        }, {
          "Value": "Unsatisfactory Roundys Product",
          "Text": "Unsatisfactory Roundys Product",
          "ParentOption": "Product Quality in Produce"
        }, {
          "Value": "Became sick after eating",
          "Text": "Became sick after eating",
          "ParentOption": "Product Quality in Seafood"
        }, {
          "Value": "Expired product",
          "Text": "Expired product",
          "ParentOption": "Product Quality in Seafood"
        }, {
          "Value": "Inquire about recalled product",
          "Text": "Inquire about recalled product",
          "ParentOption": "Product Quality in Seafood"
        }, {
          "Value": "Love the product",
          "Text": "Love the product",
          "ParentOption": "Product Quality in Seafood"
        }, {
          "Value": "My comments",
          "Text": "My comments",
          "ParentOption": "Product Quality in Seafood"
        }, {
          "Value": "Unsatisfactory product",
          "Text": "Unsatisfactory product",
          "ParentOption": "Product Quality in Seafood"
        }, {
          "Value": "Unsatisfactory Roundys Product",
          "Text": "Unsatisfactory Roundys Product",
          "ParentOption": "Product Quality in Seafood"
        }, {
          "Value": "Inaccurate Ad Details",
          "Text": "Inaccurate Ad Details",
          "ParentOption": "Promotions/Advertising"
        }, {
          "Value": "Inquire about Double Daze",
          "Text": "Inquire about Double Daze",
          "ParentOption": "Promotions/Advertising"
        }, {
          "Value": "Inquire about a promotion",
          "Text": "Inquire about a promotion",
          "ParentOption": "Promotions/Advertising"
        }, {
          "Value": "Inquire about a rebate",
          "Text": "Inquire about a rebate",
          "ParentOption": "Promotions/Advertising"
        }, {
          "Value": "Inquire about print, TV, radio ads",
          "Text": "Inquire about print, TV, radio ads",
          "ParentOption": "Promotions/Advertising"
        }, {
          "Value": "Inquire about product demo",
          "Text": "Inquire about product demo",
          "ParentOption": "Promotions/Advertising"
        }, {
          "Value": "Adjust store temperature",
          "Text": "Adjust store temperature",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Employees not available",
          "Text": "Employees not available",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Faulty store equipment",
          "Text": "Faulty store equipment",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Parking lot carts concern",
          "Text": "Parking lot carts concern",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Parking lot unclean",
          "Text": "Parking lot unclean",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Pharmacy issue",
          "Text": "Pharmacy issue",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Poor grocery bagging",
          "Text": "Poor grocery bagging",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Poor management",
          "Text": "Poor management",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Security Issue",
          "Text": "Security Issue",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Slow service",
          "Text": "Slow service",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Solicitation question",
          "Text": "Solicitation question",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Unclean store",
          "Text": "Unclean store",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Unknowledgeable employee",
          "Text": "Unknowledgeable employee",
          "ParentOption": "Store Services/Atmosphere"
        }, {
          "Value": "Inappropriate treatment",
          "Text": "Inappropriate treatment",
          "ParentOption": "Employee Attitude/Conduct"
        }, {
          "Value": "Inquire about application",
          "Text": "Inquire about application",
          "ParentOption": "Employment"
        }, {
          "Value": "Trouble applying online",
          "Text": "Trouble applying online",
          "ParentOption": "Employment"
        }, {
          "Value": "Problems with contact info fields",
          "Text": "Problems with contact info fields",
          "ParentOption": "Website Problems"
        }, {
          "Value": "Questions about website content",
          "Text": "Questions about website content",
          "ParentOption": "Website Problems"
        }, {
          "Value": "Questions about Online Customer Survey",
          "Text": "Questions about Online Customer Survey",
          "ParentOption": "Website Problems"
        }, {
          "Value": "Great service from an employee",
          "Text": "Great service from an employee",
          "ParentOption": "Employee Praise"
        }, {
          "Value": "Inquire about U-Promise",
          "Text": "Inquire about U-Promise",
          "ParentOption": "Mariano's Rewards Card"
        }, {
          "Value": "Mariano's Rewards Card Question",
          "Text": "Mariano's Rewards Card Question",
          "ParentOption": "Mariano's Rewards Card"
        }, {
          "Value": "Update Address/Phone/Name on Account",
          "Text": "Update Address/Phone/Name on Account",
          "ParentOption": "Mariano's Rewards Card"
        }, {
          "Value": "Issue with my Gift Card",
          "Text": "Issue with my Gift Card",
          "ParentOption": "Gift Card"
        }, {
          "Value": "Order Gift Cards",
          "Text": "Order Gift Cards",
          "ParentOption": "Gift Card"
        }, {
          "Value": "Price not visible",
          "Text": "Price not visible",
          "ParentOption": "Pricing/Coupons"
        }, {
          "Value": "Problem with Coupon",
          "Text": "Problem with Coupon",
          "ParentOption": "Pricing/Coupons"
        }, {
          "Value": "Tag doesn't match register price",
          "Text": "Tag doesn't match register price",
          "ParentOption": "Pricing/Coupons"
        }, {
          "Value": "Sale item mispriced",
          "Text": "Sale item mispriced",
          "ParentOption": "Pricing/Coupons"
        }, {
          "Value": "Charged More than once",
          "Text": "Charged More than once",
          "ParentOption": "Incorrect Change/Charge"
        }, {
          "Value": "Wrong amount on my receipt",
          "Text": "Wrong amount on my receipt",
          "ParentOption": "Incorrect Change/Charge"
        }, {
          "Value": "Wrong credit card charge",
          "Text": "Wrong credit card charge",
          "ParentOption": "Incorrect Change/Charge"
        }, {
          "Value": "Injury/Illness involving Roundys Brand",
          "Text": "Injury/Illness involving Roundys Brand",
          "ParentOption": "Injury/Illness"
        }, {
          "Value": "Store incident",
          "Text": "Store incident",
          "ParentOption": "Injury/Illness"
        }, {
          "Value": "Lost keys / found keys",
          "Text": "Lost keys / found keys",
          "ParentOption": "Keys Lost"
        }, {
          "Value": "Inquire about a national brand",
          "Text": "Inquire about a national brand",
          "ParentOption": "Nutritional Inquiry"
        }, {
          "Value": "Inquire about a Roundy's brand",
          "Text": "Inquire about a Roundy's brand",
          "ParentOption": "Nutritional Inquiry"
        }, {
          "Value": "Check /Insufficient Funds",
          "Text": "Check /Insufficient Funds",
          "ParentOption": "ID Check"
        }, {
          "Value": "Need copy of receipt",
          "Text": "Need copy of receipt",
          "ParentOption": "ID Check"
        }, {
          "Value": "Non-sufficient funds matter",
          "Text": "Non-sufficient funds matter",
          "ParentOption": "ID Check"
        }, {
          "Value": "Inquire about a sign in the store",
          "Text": "Inquire about a sign in the store",
          "ParentOption": "Store Signage"
        }, {
          "Value": "Foreign Object in Roundys Brand Item",
          "Text": "Foreign Object in Roundys Brand Item",
          "ParentOption": "Foreign Object"
        }, {
          "Value": "Found foreign object in product",
          "Text": "Found foreign object in product",
          "ParentOption": "Foreign Object"
        }, {
          "Value": "Comments about Chairman Bob",
          "Text": "Comments about Chairman Bob",
          "ParentOption": "Chairman Bob"
        }
    ];
  }
  //#endregion
}]);

// StaticContentCtrl
storeApp.controller('StaticContentCtrl', ['$scope', 'gsnApi', '$location', '$window', '$timeout', function ($scope, gsnApi, $location, $window, $timeout) {
  var pathToConvert = $scope.currentPath.replace(/\/+$/g, ''),
    hasAspx = $scope.currentPath.indexOf('.aspx') > 0,
    newPath = '',
    search = $location.search(),
    deepPaths = {
      '/contact': '/contactus',
      '/recipes/recipevideos': '/recipevideo',
      '/shop/managelist': '/mylist'
    },
    shallowPaths = {
      '/about-us': '/aboutus',
      '/default': '/',
      '/giving-back': '/givingback',
      '/roundys-foundation': '/roundysfoundation',
      '/charitable-donations': '/charitabledonations',
      '/store-field-trips': '/storefieldtrips',
      '/shop/weeklyad': '/circular',
      '/shop/coupons': '/coupons',
      '/shop/personalizedspecials': '/myspecials',
      '/shop/mypatry': '/mypantry',
      '/shop/specials': '/specials',
      '/shop/product': '/product',
      '/recipes/recipefull': '/recipe?id=[RecipeID]',
      '/recipes/article': '/article?id=[ArticleID]',
      '/recipes/recipecenter': '/recipecenter',
      '/profile/privacypolicy': '/privacy',
      '/profile/signin': '/',
      '/profile/recoverusername': '/recoverusername',
      '/profile/recoverpassword': '/recoverpassword',
      '/profile/signup': '/registration',
      '/recipes/recipevideos': '/recipevideo',
      '/shop/managelist': '/mylist'
    };
    
  if (hasAspx) {
    pathToConvert = pathToConvert.replace('.aspx', '');
  }

  newPath = gsnApi.isNull(deepPaths[pathToConvert], '');

  if (hasAspx) {
    if (newPath.length <= 0) {
      newPath = gsnApi.isNull(shallowPaths[pathToConvert], pathToConvert);
    }

    newPath = newPath.replace('[RecipeID]', search.RecipeID).replace('[ArticleID]', search.ArticleID);
    if (newPath.length <= 0 && pathToConvert.indexOf('/', 1) > 0) {
      newPath = '/';
    }
  }

  if (pathToConvert == '/tastemakers') {
    var tastemakerConfig = gsnApi.getThemeConfig('/tastemakers');
    if (tastemakerConfig) {
      newPath = tastemakerConfig.Description;
    }
  }
    
  if (newPath.length > 0) {
    $timeout(function() {
      $location.url(newPath);
			$location.replace();
    }, 5);
  }
}]);