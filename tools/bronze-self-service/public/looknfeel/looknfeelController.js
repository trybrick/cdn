/**
 * Created by eschmit on 10/10/2014.
 */
var app = angular.module('bronzeApp');

app.controller('looknfeelCtrl',
  ['$scope', 'bronzeService', 'fontService', 'parser', function($scope, bronzeService, fontService, parser){

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

    $scope.backgroundColor = {
      value:''
    }

    $scope.logoUrl = {
      value:''
    }

    $scope.selectedFont = {
      value:''
    }

    $scope.navigationFontColor = {
      value:''
    }

    $scope.navBarBackgroundColorsUnclicked = {
      value:''
    }

    $scope.navBarBackgroundColorsActive = {
      value:''
    }

    $scope.navBarBackgroundColorsClicked = {
      value:''
    }

    $scope.navBarTextColorsUnclicked = {
      value:''
    }

    $scope.navBarTextColorsActive = {
      value:''
    }

    $scope.navBarTextColorsClicked = {
      value:''
    }

    $scope.buttonBackgroundColorsUnclicked = {
      value:''
    }

    $scope.buttonBackgroundColorsActive = {
      value:''
    }

    $scope.buttonBackgroundColorsClicked = {
      value:''
    }

    $scope.buttonTextColorsUnclicked = {
      value:''
    }

    $scope.buttonTextColorsActive = {
      value:''
    }

    $scope.buttonTextColorsClicked = {
      value:''
    }

    //
    //http://www.grobmeier.de/angular-js-ng-select-and-ng-options-21112012.html#.VD1CAPldXLM
    //
    $scope.$watch('selectedFont.value', function(newValue, oldValue){

      var val = true == ('string' == typeof newValue) ? newValue : newValue.value;

      $scope.selectedFont.value = val;
    });

    $scope.$watch('backgroundColor.value', function(newValue, oldValue){
    });

    $scope.$watch('navigationFontColor.value', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('navBarBackgroundColorsUnclicked', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('navBarBackgroundColorsActive', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('navBarBackgroundColorsClicked', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('navBarTextColorsUnclicked', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('navBarTextColorsActive', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('navBarTextColorsClicked', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('buttonBackgroundColorsUnclicked', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('buttonBackgroundColorsActive', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('buttonBackgroundColorsClicked', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('buttonTextColorsUnclicked', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('buttonTextColorsActive', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.$watch('buttonTextColorsClicked', function(newValue, oldValue){
      var x = newValue;
    });

    $scope.activate = function(){

      $scope.fonts = fontService.get();

      var data = bronzeService.get()['look-n-feel-data'];

      $scope.logoUrl.value = parser.parse(data, 'logo-url');
      $scope.backgroundColor.value = parser.parse(data, 'background-color');
      $scope.selectedFont.value = parser.parse(data, 'selected-font');

      $scope.navigationFontColor.value = parser.parse(data, 'navigation-font-color');

      $scope.navBarBackgroundColorsUnclicked.value = parser.parse(data, 'nav-bar-background-color-unclicked');
      $scope.navBarBackgroundColorsActive.value = parser.parse(data, 'nav-bar-background-color-active');
      $scope.navBarBackgroundColorsClicked.value = parser.parse(data, 'nav-bar-background-color-clicked');

      $scope.navBarTextColorsUnclicked.value = parser.parse(data, 'nav-bar-text-color-unclicked');
      $scope.navBarTextColorsActive.value = parser.parse(data, 'nav-bar-text-color-active');
      $scope.navBarTextColorsClicked.value = parser.parse(data, 'nav-bar-text-color-clicked');

      $scope.buttonBackgroundColorsUnclicked.value = parser.parse(data, 'button-background-color-unclicked');
      $scope.buttonBackgroundColorsActive.value = parser.parse(data, 'button-background-color-active');
      $scope.buttonBackgroundColorsClicked.value = parser.parse(data, 'button-background-color-clicked');

      $scope.buttonTextColorsUnclicked.value = parser.parse(data, 'button-text-color-unclicked');
      $scope.buttonTextColorsActive.value = parser.parse(data, 'button-text-color-active');
      $scope.buttonTextColorsClicked.value = parser.parse(data, 'button-text-color-clicked');
    };

    $scope.activate();
}]);
