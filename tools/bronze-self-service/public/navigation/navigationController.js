/**
 * Created by eschmit on 10/10/2014.
 */
var app = angular.module('bronzeApp');

app.controller('navigationCtrl',
  ['$scope', 'bronzeService', 'parser', function($scope, bronzeService, parser){

  $scope.data = [];

  $scope.updateUrl = saveUrl;
  $scope.updateText = saveText;

  $scope.activate = function(){

    $scope.data = bronzeService.get()['navigation-data'];
  };

  $scope.activate();

  function saveUrl(data, row){

    var index = parser.findRowIndex($scope.data, row.$$hashKey);

    $scope.data[index].url = data;
  }

  function saveText(data, row){

    var index = parser.findRowIndex($scope.data, row.$$hashKey);

    $scope.data[index].text = data;
  }
}]);
