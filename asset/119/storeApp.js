var storeApp = angular
    .module('storeApp', ['infinite-scroll', 'ngRoute', 'ngSanitize', 'ngAnimate', 'ngTouch', 'chieffancypants.loadingBar', 'gsn.core', 'vcRecaptcha', 'ui.bootstrap', 'ui.map', 'ui.keypress', 'ui.event', 'ui.utils', 'facebook', 'angulartics', 'angulartics.gsn.ga'])
    .config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', '$sceProvider', '$httpProvider', 'FacebookProvider', '$analyticsProvider', function ($routeProvider, $locationProvider, $sceDelegateProvider, $sceProvider, $httpProvider, FacebookProvider, $analyticsProvider) {

      gsn.applyConfig(window.globalConfig.data || {});

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

      //#region route config
      // storeRequired attribute identify route require a store selection
      $routeProvider
          .when('/', {
            templateUrl: gsn.getContentUrl('/views/home.html'),
            caseInsensitiveMatch: true
          })
          .when('/article', {
            templateUrl: gsn.getThemeUrl('/views/engine/article.html'),
            caseInsensitiveMatch: true
          })
          .when('/changepassword', {
            templateUrl: gsn.getThemeUrl('/views/engine/profile-change-password.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/circular', {
            templateUrl: gsn.getThemeUrl('/views/engine/circular-view.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/circular/flyer', {
            templateUrl: gsn.getThemeUrl('/views/engine/circular-view.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/circular/text', {
            templateUrl: gsn.getThemeUrl('/views/engine/circular-view.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/circular/list', {
            templateUrl: gsn.getThemeUrl('/views/engine/circular-view.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/circular/grid', {
            templateUrl: gsn.getThemeUrl('/views/engine/circular-view.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/community', {
            templateUrl: gsn.getThemeUrl('/views/engine/custom/community.html'),
            caseInsensitiveMatch: true
          })
          .when('/contactus', {
            templateUrl: gsn.getThemeUrl('/views/engine/contact-us.html'),
            controller: 'ContactUsCtrl',
            caseInsensitiveMatch: true
          })
          .when('/coupons', {
            templateUrl: gsn.getContentUrl('/views/coupons-view.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/coupons/printable', {
            templateUrl: gsn.getThemeUrl('/views/engine/coupons-printable.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/coupons/digital', {
            templateUrl: gsn.getThemeUrl('/views/engine/coupons-digital.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/coupons/store', {
            templateUrl: gsn.getThemeUrl('/views/engine/coupons-instore.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/mealplannerfull', {
            templateUrl: gsn.getThemeUrl('/views/engine/meal-planner.html'),
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
            layout: gsn.getThemeUrl('/views/layout-print.html'),
            caseInsensitiveMatch: true
          })
          .when('/mylist/email', {
            templateUrl: gsn.getThemeUrl('/views/engine/shopping-list-email.html'),
            caseInsensitiveMatch: true
          })
          .when('/emailpreview/registration', {
            templateUrl: gsn.getThemeUrl('/views/email/registration.html'),
            layout: gsn.getThemeUrl('/views/layout-empty.html'),
            caseInsensitiveMatch: true
          })
          .when('/emailpreview/registration-facebook', {
            templateUrl: gsn.getThemeUrl('/views/email/registration-facebook.html'),
            layout: gsn.getThemeUrl('/views/layout-empty.html'),
            caseInsensitiveMatch: true
          })
          .when('/mypantry', {
            templateUrl: gsn.getThemeUrl('/views/engine/my-pantry.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/myrecipes', {
            templateUrl: gsn.getThemeUrl('/views/engine/my-recipes.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/myspecials', {
            templateUrl: gsn.getThemeUrl('/views/engine/my-specials.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/product', {
            templateUrl: gsn.getThemeUrl('/views/engine/product.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/product/search', {
            templateUrl: gsn.getThemeUrl('/views/engine/product-search.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/profile', {
            templateUrl: gsn.getContentUrl('/views/engine/profile-rewardcard.html'),
            requireLogin: true,
            caseInsensitiveMatch: true
          })
          .when('/profile/rewardcard', {
            templateUrl: gsn.getContentUrl('/views/engine/profile-rewardcard.html'),
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
          .when('/recipe/print', {
            templateUrl: gsn.getThemeUrl('/views/engine/recipe-print.html'),
            layout: gsn.getThemeUrl('/views/layout-print.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipecenter', {
            templateUrl: gsn.getThemeUrl('/views/engine/recipe-center.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipe/search', {
            templateUrl: gsn.getThemeUrl('/views/engine/recipe-search.html'),
            caseInsensitiveMatch: true
          })
          .when('/recipevideo', {
            templateUrl: gsn.getThemeUrl('/views/engine/recipe-video.html'),
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
            templateUrl: gsn.getContentUrl('/views/engine/registration.html'),
            caseInsensitiveMatch: true
          })
          .when('/registration/facebook', {
            templateUrl: gsn.getThemeUrl('/views/engine/registration.html'),
            caseInsensitiveMatch: true
          })
          .when('/search', {
            templateUrl: gsn.getThemeUrl('/views/engine/custom/search.html'),
            caseInsensitiveMatch: true
          })
          .when('/signin', {
            templateUrl: gsn.getThemeUrl('/views/engine/login.html'),
            caseInsensitiveMatch: true
          })
          .when('/specials', {
            templateUrl: gsn.getThemeUrl('/views/engine/specials.html'),
            storeRequired: true,
            caseInsensitiveMatch: true
          })
          .when('/storelocator', {
            templateUrl: gsn.getThemeUrl('/views/engine/store-locator.html'),
            caseInsensitiveMatch: true
          })
          .when('/unsubscribe', {
            templateUrl: gsn.getThemeUrl('/views/engine/unsubscribe.html'),
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

  ////
  // Do Reset 
  ////
  $scope.doReset = function () {
    $scope.vm = angular.copy($scope.masterVm);
    $scope.vm.ConfirmEmail = $scope.vm.Email;
  };

  $scope.activate();

  ////
  // Get Data
  ////
  function getData() {
    return [
        {
          "Value": "Company",
          "Text": "Company",
          "ParentOption": ""
        },
        {
          "Value": "Store",
          "Text": "Store",
          "ParentOption": ""
        },
        {
          "Value": "Other",
          "Text": "Other",
          "ParentOption": ""
        },
        {
          "Value": "Employment",
          "Text": "Employment",
          "ParentOption": ""
        },
        {
          "Value": "Website",
          "Text": "Website",
          "ParentOption": ""
        },
        {
          "Value": "Pharmacy",
          "Text": "Pharmacy",
          "ParentOption": ""
        }
    ];
  }
}]);


// My Country Mart Account
storeApp.controller('MyCountryMartAccountCtrl', ['$scope', 'gsnProfile', 'gsnApi', '$timeout', 'gsnStore', '$rootScope', function controller($scope, gsnProfile, gsnApi, $timeout, gsnStore, $rootScope) {
 
  $scope.activate = activate;
  $scope.profile = { PrimaryStoreId: gsnApi.getSelectedStoreId(), ReceiveEmail: true };

  $scope.hasSubmitted = false;    // true when user has click the submit button
  $scope.isValidSubmit = true;    // true when result of submit is valid
  $scope.isSubmitting = false;    // true if we're waiting for result from server
  $scope.profileUpdated = false;
  $scope.isFacebook = false;

  function activate() {
    gsnStore.getStores().then(function (rsp) {
      $scope.stores = rsp.response;
    });

    gsnProfile.getProfile().then(function (p) {
      if (p.success) {
        $scope.profile = angular.copy(p.response);
        $scope.isFacebook = (gsnApi.isNull($scope.profile.FacebookUserId, '').length > 0);
      }
    });

    $scope.profileUpdated = ($scope.currentPath == '/profile/rewardcard/updated');
  }

  $scope.updateProfile = function () {
    var profile = $scope.profile;
    if ($scope.myForm.$valid) {

      // prevent double submit
      if ($scope.isSubmitting) return;

      $scope.hasSubmitted = true;
      $scope.isSubmitting = true;
      gsnProfile.updateProfile(profile)
          .then(function (result) {
            $scope.isSubmitting = false;
            $scope.isValidSubmit = result.success;
            if (result.success) {
              gsnApi.setSelectedStoreId(profile.PrimaryStoreId);

              // trigger profile retrieval
              gsnProfile.getProfile(true);

              // Broadcast the update.
              $rootScope.$broadcast('gsnevent:updateprofile-successful', result);
            }
          });
    }
  };

  $scope.activate();
}]);


////
// My Country Mart Registration ctrl
////
storeApp.controller('MyCountryMartRegistrationctrl', ['$scope', 'gsnProfile', 'gsnApi', '$timeout', 'gsnStore', '$interpolate', '$http', '$rootScope', '$route', function controller($scope, gsnProfile, gsnApi, $timeout, gsnStore, $interpolate, $http, $rootScope, $route) {
  $scope.activate = activate;
  $scope.totalSavings = '';
  $scope.profile = { PrimaryStoreId: gsnApi.getSelectedStoreId(), ReceiveEmail: true };

  $scope.hasSubmitted = false;    // true when user has click the submit button
  $scope.isValidSubmit = true;    // true when result of submit is valid
  $scope.isSubmitting = false;    // true if we're waiting for result from server
  $scope.isFacebook = $scope.currentPath == '/registration/facebook';
  var template;

  $http.get($scope.getThemeUrl($scope.isFacebook ? '/views/email/registration-facebook.html' : '/views/email/registration.html'))
    .success(function (response) {
      template = response.replace(/data-ctrl-email-preview/gi,'');
    });

  ////
  //
  ////
  function activate() {
    if ($scope.isFacebook) {
      if (gsnApi.isNull($scope.facebookData.accessToken, '').length < 1) {
        $scope.goUrl('/');
        return;
      }

      var user = $scope.facebookData.user;
      $scope.profile.Email = user.email;
      $scope.profile.FirstName = user.first_name;
      $scope.profile.LastName = user.last_name;
    }

    gsnStore.getManufacturerCouponTotalSavings().then(function (rst) {
      if (rst.success) {
        $scope.totalSavings = gsnApi.isNaN(parseFloat(rst.response), 0.00).toFixed(2);
      }
    });

    gsnStore.getStores().then(function (rsp) {
      $scope.stores = rsp.response;
    });

  }

  ////
  //
  ////
  $scope.registerProfile = function () {
    var payload = angular.copy($scope.profile);
    if ($scope.myForm.$valid) {

      // prevent double submit
      if ($scope.isSubmitting) return;

      $scope.hasSubmitted = true;
      $scope.isSubmitting = true;

      // setup email registration stuff
      if ($scope.isFacebook) {
        payload.FacebookToken = $scope.facebookData.accessToken;
      }

      payload.ChainName = gsnApi.getChainName();
      payload.FromEmail = gsnApi.getRegistrationFromEmailAddress();
      payload.ManufacturerCouponTotalSavings = '$' + $scope.totalSavings;
      payload.CopyrightYear = (new Date()).getFullYear();
      payload.UserName = gsnApi.isNull(payload.UserName, payload.Email);
      payload.WelcomeSubject = 'Welcome to ' + payload.ChainName + ' online.';

      $scope.email = payload;
      payload.WelcomeMessage = $interpolate(template.replace(/(data-ng-src)+/gi, 'src').replace(/(data-ng-href)+/gi, 'href'))($scope);
      gsnProfile.registerProfile(payload)
          .then(function (result) {
            $scope.isSubmitting = false;
            $scope.isValidSubmit = result.success;
            if (result.success) {
              $scope.isSubmitting = true;

              $rootScope.$broadcast('gsnevent:registration-successful', result);

              // since we have the password, automatically login the user
              if ($scope.isFacebook) {
                gsnProfile.loginFacebook(result.response.UserName, payload.FacebookToken);
              } else {
                gsnProfile.login(result.response.UserName, payload.Password);
              }

            }
          });
    }
  };

  ////
  // We need to navigate no matter what.
  ////
  $scope.$on('gsnevent:login-success', function (evt, result) {

    // Mark the submitting flag.
    $scope.isSubmitting = false;
  });

  ////
  //
  ////
  $scope.$on('gsnevent:login-failed', function (evt, result) {
  });

  $scope.activate();
}]);

////
// Numbers Only
////
storeApp.directive('numbersOnly', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (inputValue) {
        // this next if is necessary for when using ng-required on your input. 
        // In such cases, when a letter is typed first, this parser will be called
        // again, and the 2nd time, the value will be undefined
        if (inputValue == undefined) return ''
        var transformedInput = inputValue.replace(/[^0-9]/g, '');
        if (transformedInput != inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }

        return transformedInput;
      });
    }
  };
});

storeApp.controller('ProLogicRewardCardctrl', ['$scope', 'gsnProfile', 'gsnApi', '$timeout', 'gsnStore', '$routeParams', '$http', '$filter', function controller($scope, gsnProfile, gsnApi, $timeout, gsnStore, $routeParams, $http, $filter) {

  $scope.hasSubmitted = false;        // true when user has click the submit button
  $scope.isValidSubmit = true;        // true when result of submit is valid
  $scope.isSubmitting = false;        // true if we're waiting for result from server
  $scope.profile = null;
  $scope.loyaltyCard = null;
  $scope.primaryLoyaltyAddress = null;// Store the primary address for later use.
  $scope.stores = null;
  $scope.states = null;
  $scope.validLoyaltyCard = { isValidLoyaltyCard: false, ExternalId: 0, rewardCardUpdated: 0 };
  $scope.profileStatus = { profileUpdated: 0 };

  // Remember, you can not watch a boolean value in angularjs!!
  $scope.datePickerOptions = { formatYear: 'yy', startingDay: 1, datePickerOpen: false };
  $scope.dateFormats = ['MMMM-dd-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.dateFormat = $scope.dateFormats[0];
  $scope.TodaysDate = new Date();
  $scope.datePickerMinDate = new Date(1900, 1, 1);
  $scope.datePickerMaxDate = new Date(2025, 12, 31);

  ////
  /// Load Loyalty Card Profile
  ////
  $scope.loadLoyaltyCardData = function () {

    // Get the profile, this should be cached.
    gsnProfile.getProfile().then(function (p) {

      // Do we have a profile? We must in order to proceed.
      if (p.success) {

        // Get the states.
        gsnStore.getStates().then(function (rsp) {
          $scope.states = rsp.response;
        });

        // Make a copy
        $scope.profile = gsnApi.isNull(angular.copy(p.response), {});
        if (($scope.profile !== null) && (gsnApi.isNull($scope.profile.ExternalId, null) !== null)) {

          // Get the stores for the card.
          gsnStore.getStores().then(function (rsp) {
            $scope.stores = rsp.response;
          });

          // Initialize the external id.
          $scope.validLoyaltyCard.ExternalId = $scope.profile.ExternalId;

          // The external id must have a length greater than two.
          if ($scope.validLoyaltyCard.ExternalId.length > 2) {

            // Generate the url.
            var Url = gsnApi.getStoreUrl().replace(/store/gi, 'ProLogic') + '/GetCardMember/' + gsnApi.getChainId() + '/' + $scope.profile.ExternalId;
            $http.get(Url).success(function (response) {

              // Store the loyalty card data.
              $scope.loyaltyCard = response.Response;

              if (gsnApi.isNull($scope.loyaltyCard, null) !== null) {

                // Store the GSN copy of the last name and the prologic last name.
                var gsnLastName = $scope.profile.LastName.toUpperCase().replace(/\s+/gi, '');
                var proLogicLastName = $scope.loyaltyCard.memberField.lastNameField.toUpperCase().replace(/\s+/gi, '');

                // The names can differ, but the names must be in the 
                if ((gsnLastName != proLogicLastName) && (proLogicLastName.indexOf(gsnLastName) < 0) && (gsnLastName.indexOf(proLogicLastName) < 0)) {

                  // Set the invalid flag.
                  $scope.validLoyaltyCard.isValidLoyaltyCard = false;

                  // Set the data null.
                  $scope.loyaltyCard = null;
                }
                else {

                  // Set the invalid flag.
                  $scope.validLoyaltyCard.isValidLoyaltyCard = true;

                  // Get the primary address.
                  getPrimaryAddress($scope.loyaltyCard.householdField);

                  // Create a dictionary for the promotion variables.
                  $scope.loyaltyCard.householdField.promotionVariablesField.pvf = gsnApi.mapObject($scope.loyaltyCard.householdField.promotionVariablesField.promotionVariableField, 'nameField');
                }
              }
              else {

                // Set the invalid flag.
                $scope.validLoyaltyCard.isValidLoyaltyCard = false;

                // Set the data null.
                $scope.loyaltyCard = null;
              }
            });
          }
          else {

            // Set the invalid flag.
            $scope.validLoyaltyCard.isValidLoyaltyCard = false;

            // Set the data null.
            $scope.loyaltyCard = null;
          }
        }
      }
    });
  };

  ////
  // Is Valid Club Store
  ////
  $scope.isValidClubStore = function (listOfStores) {

    // Default to true.
    var returnValue = false;

    // Make sure that its not null.
    if (gsnApi.isNull($scope.profile, null) !== null) {

      // If the store listed is the current store, then return true.
      for (var index = 0; index < listOfStores.length; index++) {

        // If the store number matches, then apply this flag.
        if ($scope.profile.PrimaryStoreId == listOfStores[index]) {

          returnValue = true;
          break;
        }
      }
    }

    // Return the value.
    return returnValue;
  };

  ////
  // Update Reward Card
  ////
  $scope.updateRewardCard = function () {

    var url = gsnApi.getStoreUrl().replace(/store/gi, 'ProLogic') + '/SaveCardMember/' + gsnApi.getChainId();
    $http.post(url, $scope.loyaltyCard, { headers: gsnApi.getApiHeaders() }).success(function (rsp) {

      // Mark the reward card as updated.
      $scope.validLoyaltyCard.rewardCardUpdated++;

      // Reload the loyalty card data.
      $scope.loadLoyaltyCardData();
    });
  };

  ////
  // get Club Total 
  ////
  $scope.getClubTotal = function (nameFieldList) {

    var returnValue = 0;

    // Make sure that this is not null.
    if ((gsnApi.isNull($scope.loyaltyCard, null) !== null) && (gsnApi.isNull($scope.loyaltyCard.householdField, null) !== null) && (gsnApi.isNull($scope.loyaltyCard.householdField.promotionVariablesField, null) !== null) && ($scope.loyaltyCard.householdField.promotionVariablesField.recordCountField > 0)) {

      // Loop through the data to get the 
      for (var index = 0; index < nameFieldList.length; index++) {

        // Get the promotion variable item.
        var promotionVariableItem = $scope.loyaltyCard.householdField.promotionVariablesField.pvf[nameFieldList[index]];
        if (gsnApi.isNull(promotionVariableItem, null) !== null) {
          returnValue = returnValue + Number(promotionVariableItem.valueField);
        }
      }
    }

    return returnValue;
  };

  ////
  // get Club Value 
  ////
  $scope.getClubValue = function (nameField, isCurrency) {

    var returnValue = "0";

    // Make sure that this is not null.
    if ((gsnApi.isNull($scope.loyaltyCard, null) !== null) && (gsnApi.isNull($scope.loyaltyCard.householdField, null) !== null) && (gsnApi.isNull($scope.loyaltyCard.householdField.promotionVariablesField, null) !== null) && ($scope.loyaltyCard.householdField.promotionVariablesField.recordCountField > 0)) {

      // Get the promotion Variable Item.
      var promotionVariableItem = $scope.loyaltyCard.householdField.promotionVariablesField.pvf[nameField];
      if (gsnApi.isNull(promotionVariableItem, null) !== null) {

        if (isCurrency) {
          returnValue = $filter('currency')((promotionVariableItem.valueField / 100), '$');
        }
        else {
          returnValue = $filter('number')(promotionVariableItem.valueField, 2);
        }
      }
    }

    // Replace the .00
    returnValue = returnValue.replace(".00", "");

    return returnValue;
  };

  ////
  // Open the date picker.
  ////
  $scope.openDatePicker = function ($event) {

    // Handle the events.
    $event.preventDefault();
    $event.stopPropagation();

    // Remember, you can not watch a boolean value in angularjs!!
    $scope.datePickerOptions.datePickerOpen = !$scope.datePickerOptions.datePickerOpen;
  };

  ////
  // Disabled Date Picker (if you want to disable certain days!) -- Not used here
  ////
  $scope.disabledDatePicker = function (date, mode) {
    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
  };

  ////
  // Get Primary Address
  ////
  function getPrimaryAddress(householdField) {

    if ((gsnApi.isNull(householdField, null) !== null) && (gsnApi.isNull(householdField.addressesField, null) !== null) && (householdField.addressesField.recordCountField > 0)) {

      // Assign the primary address
      $scope.primaryLoyaltyAddress = householdField.addressesField.addressField[0];
    }
  }

  ////
  // Get Promotion Value
  ////
  $scope.GetPromotionValue = function (name, value) {
    var promotionValue = value;

    // If there is a tracker in the name, then we have a dollar value.
    if (name.indexOf("tracker", 0) > 0) {
      promotionValue = $filter('currency')(value, '$');
    } else {
      promotionValue = $filter('number')(value, 2);
    }

    return promotionValue;
  };

  ////
  /// Activate
  ////
  $scope.activate = function activate() {

    // Load the loyalty card profile first thing. Without this we really can't go very far.
    $scope.loadLoyaltyCardData();
  };

  ////
  // Handle the event 
  ////
  $scope.$on('gsnevent:updateprofile-successful', function (evt, result) {

    // We just updated the profile; update the counter.
    $scope.profileStatus.profileUpdated++;

    // Reload the data
    $scope.loadLoyaltyCardData();
  });

  // Call the activate method.
  $scope.activate();
}]);

