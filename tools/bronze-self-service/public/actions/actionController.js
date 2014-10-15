/**
 * Created by eschmit on 10/10/2014.
 */
var app = angular.module('bronzeApp');

app.controller('actionsCtrl',
  ['$scope', '$upload', 'bronzeService', 'parser', function($scope, $upload, bronzeService, parser){

    //$scope.scope = $scope;
    $scope.updatePosition = savePosition;
    $scope.updateLink = saveLink;
    $scope.updateUrl = saveImageUrl;
    $scope.onFileSelect = uploadFile;

    $scope.activate = function(){

      $scope.data = bronzeService.get()['actions-data'];
      $scope.chain = bronzeService.get()['chain-data'];
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

    //
    //upload the file selected by the user
    //
    function uploadFile($files, $index) {

      for (var i = 0; i < $files.length; i++) {

        var file = $files[i];

        if ('image/png' === file.type ||
          'image/jpeg' === file.type ||
          'application/x-shockwave-flash' === file.type) {

          //var url = getUrl(file);

          //        bronzeService.uploader(file);
          $scope.upload = $upload.upload({
            url: 'http://admin.gsn.io/creative/upload/' + $scope.chain[0].value,
            method: 'POST',
            data: {},
            file: file
          }).success(function(evt) {
            $scope.newCreative.CreativeUrl = clean(evt);
          });
        } else {
          alert('incorrect file type chosen - not uploaded');
        }
      }
    };

//    function getUrl(file){
//
//      var url = 'admin.gsn.io/creative/upload' + $scope.chain.value;
//
//      return url;
//    }

    function clean(data) {

      var retVal = data;

      if (data &&
        'string' === typeof (data)) {

        retVal = data.replace(/"/g, '');
      }

      return retVal;
    }
}]);
