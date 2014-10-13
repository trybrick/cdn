/**
 * Created by eschmit on 10/10/2014.
 */
var app = angular.module('bronzeApp');

app.controller('actionsCtrl',
  ['$scope', 'bronzeService','parser', function($scope, bronzeService, parser){

  //$scope.scope = $scope;
  $scope.updatePosition = savePosition;
  $scope.updateLink = saveLink;
  $scope.updateUrl = saveImageUrl;

  $scope.activate = function(){

    $scope.data = bronzeService.get()['actions-data'];
  };

  $scope.activate();

  function savePosition(data, row){

    var index = parser.findRowIndex($scope.data, row.$$hashKey);

    $scope.data[index].position = data;
  }

  function saveLink(data, row){

    var index = parser.findRowIndex($scope.data, row.$$hashKey);

    $scope.data[index].link = data;
  }

  function saveImageUrl(data, row){

    var index = parser.findRowIndex($scope.data, row.$$hashKey);

    $scope.data[index].url = data;
  }
}]);
