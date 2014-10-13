/**
 * Created by eschmit on 10/10/2014.
 */
var app = angular.module('bronzeApp');

app.controller('looknfeelCtrl',
  ['$scope', 'bronzeService', 'fontService', 'parser', function($scope, bronzeService, fontService, parser, tester){

  //
  //ng-include creates a child scope which will prevent us from updating
  //models - hold onto the parent
  //
  $scope.scope = $scope;

  $scope.backgroundUrl = 'looknfeel/partials/header-background.html';
  $scope.navBarBackgroundColorsUrl = 'looknfeel/partials/nav-bar-background-color.html';
  $scope.navBarTextColorsUrl = 'looknfeel/partials/nav-bar-text-color.html';
  $scope.buttonBackgroundColorsUrl = 'looknfeel/partials/button-background-color.html';
  $scope.buttonTextColorsUrl = 'looknfeel/partials/button-text-color.html';

  $scope.foo = function () {
    var x = $scope.selectedFont;
  }

  $scope.activate = function(){

    $scope.fonts = fontService.get();
    $scope.data = bronzeService.get()['look-n-feel-data'];

    $scope.logoUrl = parser.parse($scope.data, 'logo-url');
    $scope.backgroundColor = parser.parse($scope.data, 'background-color');
    $scope.selectedFont = $scope.fonts[0];

    $scope.navigationFontColor = parser.parse($scope.data, 'navigation-font-color');

    $scope.navBarBackgroundColorsUnclicked = parser.parse($scope.data, 'nav-bar-background-color-unclicked');
    $scope.navBarBackgroundColorsActive = parser.parse($scope.data, 'nav-bar-background-color-active');
    $scope.navBarBackgroundColorsClicked = parser.parse($scope.data, 'nav-bar-background-color-clicked');

    $scope.navBarTextColorsUnclicked = parser.parse($scope.data, 'nav-bar-text-color-unclicked');
    $scope.navBarTextColorsActive = parser.parse($scope.data, 'nav-bar-text-color-active');
    $scope.navBarTextColorsClicked = parser.parse($scope.data, 'nav-bar-text-color-clicked');

    $scope.buttonBackgroundColorsUnclicked = parser.parse($scope.data, 'button-background-color-unclicked');
    $scope.buttonBackgroundColorsActive = parser.parse($scope.data, 'button-background-color-active');
    $scope.buttonBackgroundColorsClicked = parser.parse($scope.data, 'button-background-color-clicked');

    $scope.buttonTextColorsUnclicked = parser.parse($scope.data, 'button-text-color-unclicked');
    $scope.buttonTextColorsActive = parser.parse($scope.data, 'button-text-color-active');
    $scope.buttonTextColorsClicked = parser.parse($scope.data, 'button-text-color-clicked');
  };

  $scope.activate();
}]);
