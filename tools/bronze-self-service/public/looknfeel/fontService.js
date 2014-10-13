/**
 * Created by eschmit on 10/10/2014.
 */
var app = angular.module('bronzeApp');

app.service('fontService', function(){

  var data = [{name:'Arial'},
    {name:'Arial Black'},
    {name:'Arial Narrow'},
    {name:'Arial Rounded MT Bold'},
    {name:'Avant Garde'},
    {name:'Calibri'},
    {name:'Candara'},
    {name:'Century Gothic'},
    {name:'Franklin Gothic Medium'},
    {name:'Futura'},
    {name:'Geneva'},
    {name:'Gill Sans'},
    {name:'Helvetica'},
    {name:'Impact'},
    {name:'Lucida Grande'},
    {name:'Optima'},
    {name:'Segoe UI'},
    {name:'Tahoma'},
    {name:'Trebuchet MS'},
    {name:'Verdana'},
    {name:'Baskerville'},
    {name:'Big Caslon'},
    {name:'Bodoni MT'},
    {name:'Book Antiqua'},
    {name:'Calisto MT'},
    {name:'Cambria'},
    {name:'Didot'},
    {name:'Garamond'},
    {name:'Georgia'},
    {name:'Goudy Old Style'},
    {name:'Hoefler Text'},
    {name:'Lucida Bright'},
    {name:'Palatino'},
    {name:'Perpetua'},
    {name:'Rockwell'},
    {name:'Rockwell Extra Bold'},
    {name:'Times New Roman'},
    {name:'Andale Mono'},
    {name:'Consolas'},
    {name:'Courier New'},
    {name:'Lucida Console'},
    {name:'Lucida Sans Typewriter'},
    {name:'Monaco'},
    {name:'Copperplate'},
    {name:'Papyrus'},
    {name:'Brush Script MT'}
  ];

  this.get = function() {
    return data;
  }
});
