/**
 * Created by eschmit on 10/8/2014.
 */
var app = angular.module('bronzeApp');

app
  .service('bronzeService', function() {

    var data = {
      "chain-data":[{
        "chain-id":"7"
      }],
      "look-n-feel-data":[{
        "options":[{
          "name":"color",
          "value":"#123456",
          "active":true
        },{
          "name":"image url",
          "value":"http://",
          "active":false
        }]
      },{
        "name":"background-color",
        "value":"#123456"
      },{
        "name":"fonts",
        "value":"arial"
      },{
        "name":"nav-bar-background-colors",
        "choices":[{
          "name":"unclicked",
          "value":"#123456"
        },{
          "name":"active",
          "value":"#123456"
        },{
          "name":"clicked",
          "value":"#123456"
        }]
      },{
        "name":"nav-bar-text-colors",
        "choices":[{
          "name":"unclicked",
          "value":"#123456"
        },{
          "name":"active",
          "value":"#123456"
        },{
          "name":"clicked",
          "value":"#123456"
        }]
      },{
        "name":"button-background-colors",
        "choices":[{
          "name":"unclicked",
          "value":"#123456"
        },{
          "name":"active",
          "value":"#123456"
        },{
          "name":"clicked",
          "value":"#123456"
        }]
      },{
        "name":"button-text-colors",
        "choices":[{
          "name":"unclicked",
          "value":"#123456"
        },{
          "name":"active",
          "value":"#123456"
        },{
          "name":"clicked",
          "value":"#123456"
        }]
      }],
      "actions-data":[{
        "name":"Circular",
        "position":"1",
        "link":"/circular",
        "image-url":"empty"
      },{
        "name":"Registration",
        "position":"2",
        "link":"/registration",
        "image-url":"empty"
      },{
        "name":"Recipe of the Day",
        "position":"3",
        "link":"/recipes",
        "image-url":"empty"
      },{
        "name":"Coupons",
        "position":"4",
        "link":"/coupons",
        "image-url":"empty"
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
        "image-url":"empty",
        "allow-delete":false
      },{
        "name":"Employment",
        "position":"2",
        "link":"/careers",
        "image-url":"empty",
        "allow-delete":true
      }]
    };

    this.get = function(){
      return data;
    }
  })
  .service('fontService', function(){

    var data = [{
      "name":"Arial"
    },{
      "name":"New Times Roman"
    },{
      "name": "Impact"
    }]

    this.get = function(){
      return data;
    }
  });
