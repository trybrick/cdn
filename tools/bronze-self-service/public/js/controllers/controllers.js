/**
 * Created by eschmit on 10/9/2014.
 */
app
  .controller('actionsCtrl', ['$scope', 'bronzeService', function($scope, bronzeService){

    $scope.actions = [];

    $scope.foo = function(){

    };

    $scope.activate = function(){

      $scope.data = bronzeService.get();
      $scope.actions = $scope.data['actions-data'];
    };

    $scope.activate();
  }])
  .controller('footerCtrl', ['$scope', 'bronzeService', function($scope, bronzeService){

    $scope.footerData = [];

    $scope.foo = function(){

    };

    $scope.activate = function(){

      $scope.data = bronzeService.get();
      $scope.footerData = $scope.data['footer-data'];
    };

    $scope.activate();

  }])
  .controller('navigationCtrl', ['$scope', 'bronzeService', function($scope, bronzeService){

    $scope.navigationData = [];

    $scope.foo = function(){

    };

    $scope.activate = function(){

      $scope.data = bronzeService.get();
      $scope.navigationData = $scope.data['navigation-data'];
    };

    $scope.activate();
  }])
  .controller('looknfeelCtrl', ['$scope', 'bronzeService', 'fontService', function($scope, bronzeService, fontService){

    $scope.fonts = [];
    $scope.looknfeeldata = [];
    $scope.backgroundUrl = 'views/header-background.html';
    $scope.navBarBackgroundColorsUrl = 'views/nav-bar-background-color.html';
    $scope.navBarTextColorsUrl = 'views/nav-bar-text-color.html';
    $scope.buttonBackgroundColorsUrl = 'views/button-background-color.html';
    $scope.buttonTextColorsUrl = 'views/button-text-color.html';

    $scope.activate = function(){

      $scope.fonts = fontService.get();
      $scope.data = bronzeService.get();
      $scope.looknfeeldata = $scope.data['look-n-feel-data'];
    };

    $scope.activate();
  }]);