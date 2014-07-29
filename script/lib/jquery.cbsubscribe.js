/*!
 *  Project:        Subscription checkbox
 *  Description:    subscribe to something provided API url
 *  Author:         Tom Noogen
 *  License:        Copyright 2014 - Grocery Shopping Network 
 *  Version:        1.0.4
 *
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = "cbsubscribe",
          defaults = {
            dataSelector: 'cbsubscribe'
          };

  // The actual plugin constructor
  function Plugin(element, options) {
    /// <summary>Plugin constructor</summary>
    /// <param name="element" type="Object">Dom element</param>
    /// <param name="options" type="Object">Initialization option</param>

    this.element = element;

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  };
  
  function hitUrl(url) {
    try {
      var img = new Image();
      if (typeof(img) === 'undefined') {
        img = doc.createElement('img');
      }
      
      img.src = url;
    } catch (err) {
      // some error occurred while creating tracking image
      var eDebug = err;
    }
  };
  
  Plugin.prototype = {
    init: function () {
      /// <summary>Initialization logic</summary>
      var $this = this;
      var element = $(this.element);
      var settings = this.settings;
      var data = $(element).data(this.settings.dataSelector);
      // possible data values are
      /*
        { 'keyInput': '.keyselector', 'valueInput': '.valueselector', clickInput'.buttonSelector', 'subUrl': '', 'unsubUrl': '', 'getUrl': '' }
      */
      $this.onClick = function(e) {
        var keyData = $(data.keyInput).val();
        var valueData = $(data.valueInput).val();
        var unsubUrl = data.unsubUrl || $(settings.unsubUrlSelector).val();
        var subUrl = data.subUrl || $(settings.subUrlSelector).val();
        try {
          if (element[0].checked) {
            hitUrl(subUrl.replace('%KEY%', keyData).replace('%VALUE%', valueData) + '&nocache=' + (new Date()).getTime());
          } else if (unsubUrl) {
            hitUrl(unsubUrl.replace('%KEY%', keyData).replace('%VALUE%', valueData) + '&nocache=' + (new Date()).getTime());
          }
        } catch(ex) {
        
          // console.log(ex);
        }
      }
      
      // trigger on click
      $(data.clickInput).click($this.onClick);
      
      var getUrl = data.getUrl || $(settings.getUrlSelector).val();
      
      // attempt to retrieve value
      if (getUrl) {
        var keyData = $(data.keyInput).val();
        var valueData = $(data.valueInput).val();
        if (valueData) {
          try {
            $.ajax({
              type: "GET",
              dataType: 'jsonp',
              jsonp: "callback",
              url: getUrl.replace('%KEY%', keyData).replace('%VALUE%', valueData) + '&nocache=' + (new Date()).getTime(),
              success: function (result) {
                element[0].checked = result;
              }
            });
            
          } catch(ex) {
            // console.log(ex);
          }
        }
      }
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };

})(window.jQuery || window.Zepto || window.tire, window, document);