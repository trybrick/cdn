/**
 * Created by eschmit on 10/8/2014.
 */
var app = angular.module('bronzeApp');

app
  .service('bronzeService', function() {

    var data = {
      "chain-data":[{
        name:"chain-id",
        value:"7"
      }],
      "look-n-feel-data":[{
        "name":"logo-url",
        "value":"http://link-to-your-image"
      },{
        "name":"selected-font",
        "value":"Impact"
      },{
        "name":"background-color",
        "value":"#123456"
      },{
        "name":"navigation-font-color",
        "value":"#123456"
      },{
        "name":"nav-bar-background-color-unclicked",
        "value":"#123456"
      },{
        "name":"nav-bar-background-color-active",
        "value":"#123456"
      },{
        "name":"nav-bar-background-color-clicked",
        "value":"#123456"
      },{
        "name":"nav-bar-text-color-unclicked",
        "value":"#123456"
      },{
        "name":"nav-bar-text-color-active",
        "value":"#123456"
      },{
        "name":"nav-bar-text-color-clicked",
        "value":"#123456"
      },{
        "name":"button-background-color-unclicked",
        "value":"#123456"
      },{
        "name":"button-background-color-active",
        "value":"#123456"
      },{
        "name":"button-background-color-clicked",
        "value":"#123456"
      },{
        "name":"button-text-color-unclicked",
        "value":"#123456"
      },{
        "name":"button-text-color-active",
        "value":"#123456"
      },{
        "name":"button-text-color-clicked",
        "value":"#123456"
      }],
      "navigation-data":[{
        "name":"Weekly Ad",
        "url":"http://",
        "text":"empty"
      },{
        "name":"Recipe of the Day",
        "url":"http://",
        "text":"empty"
      },{
        "name":"Coupons",
        "url":"http://",
        "text":"empty",
        "sub-menu":[{
          "name":"In Store",
          "link":"/coupons/instore"
        },{
          "name":"Manufacturer",
          "link":"/coupons/mfctr"
        }]
      },{
        "name":"Departments",
        "url":"http://",
        "text":"empty",
        "sub-menu":[{
          "name":"In Store",
          "link":"/coupons/instore"
        },{
          "name":"Manufacturer",
          "link":"/coupons/mfctr"
        }]
      }],
      "footer-data":[{
        "name":"Contact Us",
        "position":"1",
        "link":"/contact",
        "url":"empty",
        "allow-delete":false
      },{
        "name":"Employment",
        "position":"2",
        "link":"/careers",
        "url":"empty",
        "allow-delete":true
      }],
      "actions-data":[{
        "name":"Circular",
        "position":"1",
        "link":"/circular",
        "url":"empty"
      },{
        "name":"Registration",
        "position":"2",
        "link":"/registration",
        "url":"empty"
      },{
        "name":"Recipe of the Day",
        "position":"3",
        "link":"/recipes",
        "url":"empty"
      },{
        "name":"Coupons",
        "position":"4",
        "link":"/coupons",
        "url":"empty"
      }]
    };

    this.get = function(){
      return data;
    };

    this.set = function(key, val){

      //placeholder
      var asdf = val;
    };
  })
//  .service('uploader', function(file){
//
//    $scope.upload = $upload.upload({
//      url: '/creative/upload/' + 7,//$scope.$parent.vm.ChainId,
//      method: 'POST',
//      data: {},
//      file: file
//    }).success(function(evt) {
//      $scope.newCreative.CreativeUrl = clean(evt);
//    });
//  })
  .service('parser', function(){

    this.findRowIndex = function (array, key){

      var index = 0;

      for(var i = 0; i < array.length; i++){

        if(key === array[i].$$hashKey){

          index = i;
          break;
        }
      }

      return index;
    };

    this.parse = function(array, search){

      for(var key in array){
        if(array.hasOwnProperty(key)){
          var x = key;
        }
      }
      var propertyVal = 'undefined';

      if(array){

        for(var i = 0; i < array.length; i++){

          if(search === array[i].name){
            propertyVal = array[i].value;
            break;
          }
        }
      }

      return propertyVal;
    }
  });
