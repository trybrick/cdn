/*!
 *  Project:        Digital Circular
 *  Description:    create a digital circular
 *  Author:         Tom Noogen
 *  License:        Copyright 2014 - Grocery Shopping Network 
 *  Version:        1.0.9
 *
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, templateEngine, window, document, undefined) {

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = "digitalCirc",
          defaults = {
            data: null,
            browser: null,
            onItemSelect: null,
            onCircularDisplaying: null,
            onCircularDisplayed: null,
            templateCircularList: '<div class="dcircular-list">' +
'	<div class="dcircular-list-content">' +
'		{{#Circulars}}<div class="col-lg-3 col-md-4 col-sm-6 dcircular-list-single" data-index="{{@index}}"> ' +
'		   <div class="thumbnail dcircular-thumbnail">          ' +
'			<img class="dcircular-image" alt="" src="{{SmallImageUrl}}"> ' +
'			<div class="caption dcircular-caption"><h3 style="width: 100%; text-align: center;">{{CircularTypeName}}</h3></div>' +
'		  </div>' +
'		</div>{{/Circulars}}' +
'	</div>' +
'</div><div class="dcircular-single"></div>',
            templateLinkBackToList: '{{#if HasMultipleCircular}}<a href="javascript:void(0)" class="dcircular-back-to-list">&larr; Choose Another Ad</a><br />{{/if}}',
            templatePagerTop: '<div class="dcircular-pager-top"><ul class="pagination">{{#Circular.Pages}}<li{{#ifeq PageIndex ../CurrentPageIndex}} class="active"{{/ifeq}}><a href="javascript:void(0)">{{PageIndex}}</a></li>{{/Circular.Pages}}</ul></div>',
            templatePagerBottom: '<div class="dcircular-pager-bottom"><ul class="pagination">{{#Circular.Pages}}<li{{#ifeq PageIndex ../CurrentPageIndex}} class="active"{{/ifeq}}><a href="javascript:void(0)">{{PageIndex}}</a></li>{{/Circular.Pages}}</li></ul></div>',
            templateCircularSingle: '<div class="dcircular-content">' +
'<img usemap="#dcircularMap{{CurrentPageIndex}}" src="{{Page.ImageUrl}}" class="dcircular-map-image"/>' +
'<map name="dcircularMap{{CurrentPageIndex}}">' +
'{{#Page.Items}}<area shape="rect" data-circularitemid="{{ItemId}}" coords="{{AreaCoordinates}}">{{/Page.Items}}' +
'</map>' +
'	</div>',
            templateCircularPopup: '<div class="row dcircular-popup-content" data-circularitemid="{{ItemId}}">' +
'		<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 thumbnail dcircular-popup-thumbnail" style="padding-left: 5px;"><img alt="{{Description}}" src="{{ImageUrl}}" class="dcircular-popup-image"/></div>' +
'		<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 dcircular-popup-content">' +
'			<h4 style="word-wrap: normal;" class=" dcircular-popup-caption">{{Description}}</h2>' +
'			<h6>{{ItemDescription}}</h3>' +
'			<h5>{{PriceString}}</h4>' +
'</div>',
            templateCircularPopupTitle: 'Click to add to your shopping list'
          };

  // The actual plugin constructor
  function Plugin(element, options) {
    /// <summary>Plugin constructor</summary>
    /// <param name="element" type="Object">Dom element</param>
    /// <param name="options" type="Object">Initialization option</param>

    this.element = element;

    templateEngine.registerHelper('ifeq', function (v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend({}, defaults, options);

    // compile templates
    this._templateCircList = templateEngine.compile(this.settings.templateCircularList);
    this._templateCircPopup = templateEngine.compile(this.settings.templateCircularPopup);
    this._templateCircPopupTitle = templateEngine.compile(this.settings.templateCircularPopupTitle);
    this._templateCircSingle = templateEngine.compile(this.settings.templateLinkBackToList +
        this.settings.templatePagerTop +
        this.settings.templateCircularSingle +
        this.settings.templatePagerBottom);

    this._defaults = defaults;
    this._name = pluginName;
    this._circularItemById = {};
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      /// <summary>Initialization logic</summary>

      // preprocess the data
      // parse circular type
      var circularTypeById = {};
      var myData = this.settings.data;
      for (var t = 0; t < myData.CircularTypes.length; t++) {
        circularTypeById[myData.CircularTypes[t].Code] = myData.CircularTypes[t];
      }

      // parse item
      this._circularItemById = {};
      for (var i = 0; i < myData.Circulars.length; i++) {
        var circular = myData.Circulars[i];
        myData.Circulars[i].CircularTypeName = circularTypeById[myData.Circulars[i].CircularTypeId].Name;
        myData.Circulars[i].SmallImageUrl = circular.Pages[0].SmallImageUrl;
        for (var j = 0; j < circular.Pages.length; j++) {
          var page = circular.Pages[j];
          page.PageIndex = j + 1;
          for (var k = 0; k < page.Items.length; k++) {
            var item = page.Items[k];
            this._circularItemById[item.ItemId] = item;
          }
        }
      }

      // create the multiple circular on the dom
      var $this = this;
      var htmlCirc = $this._templateCircList(myData);
      var el = $(this.element);
      el.html(htmlCirc);

      // wire-up events multiple circular
      el.find('.dcircular-list-single').click(function (evt) {
        var idx = $(this).data("index");
        $this.displayCircular(idx);
      });

      if (myData.Circulars.length <= 1) {
        $this.displayCircular(0);
      }
    },
    displayCircular: function(circularIdx, pageIdx) {
      /// <summary>Display the circular</summary>
      /// <param name="circularIdx" type="Integer">Circular Index</param>
      /// <param name="pageIdx" type="Integer">Page Index</param>

      var $this = this;
      if (typeof(circularIdx) === 'undefined') circularIdx = 0;
      if (typeof(pageIdx) === 'undefined') pageIdx = 0;

      if (typeof($this.settings.onCircularDisplaying) === 'function') {
        try {
          $this.settings.onCircularDisplaying($this, circularIdx, pageIdx);
        } catch(e) {
        }
      }

      var el = $($this.element);
      var circ = $this.settings.data.Circulars[circularIdx];
      var circPage = circ.Pages[pageIdx];
      $this.circularIdx = circularIdx;

      // hide multiple circ
      el.find('.dcircular-list').hide();

      // create circular page  
      var htmlCirc = $this._templateCircSingle({ HasMultipleCircular: $this.settings.data.Circulars.length > 1, Circular: circ, CircularIndex: circularIdx, CurrentPageIndex: (pageIdx + 1), Page: circPage });
      el.find('.dcircular-single').html(htmlCirc);

      el.find('.dcircular-pager-top li a, .dcircular-pager-bottom li a').click(function(evt) {
        var $target = $(evt.target);
        var idx = $target.html();
        $this.displayCircular($this.circularIdx, parseInt(idx) - 1);
      });

      // wire-up events for back to list  
      el.find('.dcircular-back-to-list').click(function(evt) {
        el.find('.dcircular-list').show();
        el.find('.dcircular-single').html('');
      });
                    
      var browser = $this.settings.browser;
      var isMobile = false;
  
      if (browser) {
        isMobile = browser.isMobile;
      }
      
      function handleSelect(evt) {
        if (typeof($this.settings.onItemSelect) == 'function') {
          var itemId = $(this).data().circularitemid;
          var item = $this.getCircularItem(itemId);

          $('.qtip').attr('data-ng-non-bindable', '').hide();

          if (typeof($this.settings.onItemSelect) === 'function') {
            $this.settings.onItemSelect($this, evt, item);
          }
        }
        setTimeout(function() {
          $('.qtip').slideUp();
        }, 500);
      }

      var areas = el.find('area').click(handleSelect);
      if (isMobile) {
        areas.qtip({
          content: {
            text: function(evt, api) {
              var itemId = $(this).data().circularitemid;
              var item = $this.getCircularItem(itemId);
              return item.Description;
            },
            title: function() {
              return 'added';
            },
            attr: 'data-ng-non-bindable'
          },
          style: {
            classes: 'qtip-light qtip-rounded'
          },
          position: {
            my: 'center',
            at: 'center',
            viewport: $(this.element)
          },
          show: {
            event: 'click',
            solo: true
          },
          hide: {
            inactive: 15000
          }
        });
      } else {
        areas.qtip({
          content: {
            text: function (evt, api) {
              // Retrieve content from custom attribute of the $('.selector') elements.
              var itemId = $(this).data().circularitemid;
              var item = $this.getCircularItem(itemId);
              return $this._templateCircPopup(item);
            },
            title: function () {
              var itemId = $(this).data().circularitemid;
              var item = $this.getCircularItem(itemId);
              return $this._templateCircPopupTitle(item);
            },
            attr: 'data-ng-non-bindable'
          },
          style: {
            classes: 'qtip-light qtip-rounded'
          },
          position: {
            target: 'mouse',
            adjust: { x: 10, y: 10 },
            viewport: $(this.element)
          },
          show: {
            event: 'click mouseover',
            solo: true
          },
          hide: {
            inactive: 15000
          }
        });
      }

      if (typeof ($this.settings.onCircularDisplayed) === 'function') {
        try {
          $this.settings.onCircularDisplayed($this, circularIdx, pageIdx);
        } catch (e) { }
      }
    },
    getCircularItem: function (itemId) {
      /// <summary>Get circular item</summary>
      /// <param name="itemId" type="Integer">Id of item to get</param>

      return this._circularItemById[itemId];
    },
    getCircular: function (circularIdx) {
      if (typeof (circularIdx) === 'undefined') circularIdx = 0;
      return this.settings.data.Circulars[circularIdx];
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

})(jQuery, Handlebars, window, document);