/**
 * Created by eschmit on 10/10/2014.
 */
var app = angular.module('bronzeApp');

app.service('fontService', function(){

  var data = [
    {value:'Arial'},
    {value:'Arial Black'},
    {value:'Arial Narrow'},
    {value:'Arial Rounded MT Bold'},
    {value:'Avant Garde'},
    {value:'Calibri'},
    {value:'Candara'},
    {value:'Century Gothic'},
    {value:'Franklin Gothic Medium'},
    {value:'Futura'},
    {value:'Geneva'},
    {value:'Gill Sans'},
    {value:'Helvetica'},
    {value:'Impact'},
    {value:'Lucida Grande'},
    {value:'Optima'},
    {value:'Segoe UI'},
    {value:'Tahoma'},
    {value:'Trebuchet MS'},
    {value:'Verdana'},
    {value:'Baskerville'},
    {value:'Big Caslon'},
    {value:'Bodoni MT'},
    {value:'Book Antiqua'},
    {value:'Calisto MT'},
    {value:'Cambria'},
    {value:'Didot'},
    {value:'Garamond'},
    {value:'Georgia'},
    {value:'Goudy Old Style'},
    {value:'Hoefler Text'},
    {value:'Lucida Bright'},
    {value:'Palatino'},
    {value:'Perpetua'},
    {value:'Rockwell'},
    {value:'Rockwell Extra Bold'},
    {value:'Times New Roman'},
    {value:'Andale Mono'},
    {value:'Consolas'},
    {value:'Courier New'},
    {value:'Lucida Console'},
    {value:'Lucida Sans Typewriter'},
    {value:'Monaco'},
    {value:'Copperplate'},
    {value:'Papyrus'},
    {value:'Brush Script MT'}
  ];

  this.get = function() {
    return data;
  }
});
