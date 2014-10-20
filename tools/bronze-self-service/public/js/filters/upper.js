/**
 * Created by eschmit on 10/15/2014.
 */
var app = angular.module('bronzeApp');

app.filter('upper', function(){
  return function(input, quantity){
    if(quantity > 0){
      return input.substr(0, quantity).toUpperCase() + input.slice(quantity);
    }else if (quantity < 0) {
      return input.substr(0, input.length + quantity) +
              input.slice(input.length + quantity).toUpperCase();
    }else{
      return input.toUpperCase();
    }
  }
});
