/*!
 *  Project:        jQuery DFP plugin
 *  Description:    Allow for hosting google DFP ads
 *  Author:         Tom Noogen
 *  License:        Grocery Shopping Network        
 *                  MIT from derived work of Copyright (c) 2013 Matt Cooper: https://github.com/coop182/jquery.dfp.js  v1.0.18
 *  Version:        1.0.13
 *
 *  Requires:       jQuery >= 1.7.1
 */
(function ($, window, undefined) {

  "use strict";

  var sessionStorageX = sessionStorage;
  if (typeof (sessionStorageX) == 'undefined') {
    sessionStorageX = {
      getItem: function () { },
      setItem: function () { }
    };
  }

  var

  // Save Scope
  dfpScript = this,

  // DFP account ID
  dfpID = '',

  // Count of ads
  count = 0,

  // Count of rendered ads
  rendered = 0,

  // Default DFP selector
  dfpSelector = '.gsnunit',

  // DFP options object
  dfpOptions = {},

  // Keep track of if we've already tried to load gpt.js before
  dfpIsLoaded = false,

  // Collection of ads
  $adCollection,

  // Store adunit on div as:
  storeAs = 'gsnUnit',

  /**
   * Init function sets required params and loads Google's DFP script
   * @param  String id       The DFP account ID
   * @param  String selector The adunit selector
   * @param  Object options  Custom options to apply
   */
  init = function (id, selector, options) {

    dfpID = id;
    $adCollection = $(selector);

    dfpLoader();
    setOptions(options);

    $(function () {
      createAds();
      displayAds();
    });

  },

  /**
   * Set the options for DFP
   * @param Object options Custom options to apply
   */
  setOptions = function (options) {

    // Set default options
    dfpOptions = {
      setTargeting: {},
      setCategoryExclusion: '',
      setLocation: '',
      enableSingleRequest: true,
      collapseEmptyDivs: true,
      refreshExisting: true,
      disablePublisherConsole: false,
      disableInitialLoad: false,
      inViewOnly: false,
      noFetch: false
    };

    // Merge options objects
    $.extend(true, dfpOptions, options);

    // If a custom googletag is specified, use it.
    if (dfpOptions.googletag) {
      window.googletag.cmd.push(function () {
        $.extend(true, window.googletag, dfpOptions.googletag);
      });
    }
  },

  /**
   * Find and create all Ads
   * @return Array an array of ad units that have been created.
   */
  createAds = function () {

    // Loops through on page Ad units and gets ads for them.
    $adCollection.each(function () {

      var $adUnit = $(this);

      count++;

      // adUnit id - this will use an existing id or an auto generated one.
      var adUnitID = getID($adUnit, 'gsn', count);

      // get dimensions of the adUnit
      var dimensions = getDimensions($adUnit);

      // get existing content
      var $existingContent = $adUnit.html();

      // wipe html clean ready for ad and set the default display class.
      $adUnit.html('').addClass('display-none');;

      // Push commands to DFP to create ads
      window.googletag.cmd.push(function () {

        var googleAdUnit,
            $adUnitData = $adUnit.data(storeAs);

        if ($adUnitData) return;

        // remove double slash and any space, trim ending slash
        dfpID = dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');

        // append single front slash
        if (dfpID.indexOf('/') != 0) {
          dfpID = '/' + dfpID;
        }

        // Create the ad - out of page or normal
        if ($adUnit.data('outofpage')) {
          googleAdUnit = window.googletag.defineOutOfPageSlot(dfpID, adUnitID).addService(window.googletag.pubads());
        } else {
          googleAdUnit = window.googletag.defineSlot(dfpID, dimensions, adUnitID).addService(window.googletag.pubads());
        }

        // Sets custom targeting for just THIS ad unit if it has been specified
        var targeting = $adUnit.data("targeting");
        if (targeting) {
          if (typeof (targeting) == 'string') {
            targeting = eval('(' + targeting + ')');
          }
          $.each(targeting, function (k, v) {
            if (k == 'brand') {
              sessionStorageX.setItem('brand', v);
            }
            googleAdUnit.setTargeting(k, v);
          });
        }

        // Sets custom exclusions for just THIS ad unit if it has been specified
        var exclusions = $adUnit.data("exclusions");
        if (exclusions) {
          var exclusionsGroup = exclusions.split(',');
          var valueTrimmed;
          $.each(exclusionsGroup, function (k, v) {
            valueTrimmed = $.trim(v);
            if (valueTrimmed.length > 0) {
              googleAdUnit.setCategoryExclusion(valueTrimmed);
            }
          });
        }

        // The following hijacks an internal google method to check if the div has been
        // collapsed after the ad has been attempted to be loaded.
        googleAdUnit.oldRenderEnded = googleAdUnit.oldRenderEnded || googleAdUnit.renderEnded;
        googleAdUnit.renderEnded = function () {

          rendered++;
          var display = $adUnit.css('display');

          $adUnit.removeClass('display-none').addClass('display-' + display);

          googleAdUnit.oldRenderEnded();

          // Excute afterEachAdLoaded callback if provided
          if (typeof dfpOptions.afterEachAdLoaded === 'function') {
            dfpOptions.afterEachAdLoaded.call(this, $adUnit);
          }

          // Excute afterAllAdsLoaded callback if provided
          if (typeof dfpOptions.afterAllAdsLoaded === 'function' && rendered === count) {
            dfpOptions.afterAllAdsLoaded.call(this, $adCollection);
          }

        };

        // Store googleAdUnit reference
        $adUnit.data(storeAs, googleAdUnit);

      });
    });

    // Push DFP config options
    window.googletag.cmd.push(function () {
      if (typeof (dfpOptions.setTargeting['brand']) === 'undefined') {
        if (sessionStorageX.getItem('brand')) dfpOptions.setTargeting['brand'] = sessionStorageX.getItem('brand');
      }

      if (dfpOptions.enableSingleRequest === true) {
        window.googletag.pubads().enableSingleRequest();
      }
      $.each(dfpOptions.setTargeting, function (k, v) {
        if (k == 'brand') {
          sessionStorageX.setItem('brand', v);
        }
        window.googletag.pubads().setTargeting(k, v);
      });

      if (typeof (dfpOptions.setLocation) === "object") {
        if (typeof (dfpOptions.setLocation.latitude) === "number" && typeof (dfpOptions.setLocation.longitude) === "number" && typeof (dfpOptions.setLocation.precision) === "number") {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude, dfpOptions.setLocation.precision);
        } else if (typeof (dfpOptions.setLocation.latitude) === "number" && typeof (dfpOptions.setLocation.longitude) === "number") {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude);
        }
      }

      if (dfpOptions.setCategoryExclusion.length > 0) {
        var exclusionsGroup = dfpOptions.setCategoryExclusion.split(',');
        var valueTrimmed;
        $.each(exclusionsGroup, function (k, v) {
          valueTrimmed = $.trim(v);
          if (valueTrimmed.length > 0) {
            window.googletag.pubads().setCategoryExclusion(valueTrimmed);
          }
        });
      }
      if (dfpOptions.collapseEmptyDivs) {
        window.googletag.pubads().collapseEmptyDivs();
      }

      if (dfpOptions.disablePublisherConsole === true) {
        window.googletag.pubads().disablePublisherConsole();
      }

      if (dfpOptions.disableInitialLoad === true) {
        window.googletag.pubads().disableInitialLoad();
      }

      if (dfpOptions.noFetch === true) {
        window.googletag.pubads().noFetch();
      }

      window.googletag.enableServices();

    });

  },


  /**
   * Determine if an element is inview
   */
  isInView = function (elem) {
    var docViewTop = $(window).scrollTop(),
      docViewBottom = docViewTop + $(window).height(),
      elemTop = elem.offset().top,
     elemBottom = elemTop + elem.height();
    //Is more than half of the element visible
    return ((elemTop + ((elemBottom - elemTop) / 2)) >= docViewTop && ((elemTop + ((elemBottom - elemTop) / 2)) <= docViewBottom));
  },


  /**
   * Display all created Ads
   */
  displayAds = function () {
    var toPush = [];

    // Display each ad
    $adCollection.each(function () {

      var $adUnit = $(this),
          $adUnitData = $adUnit.data(storeAs);

      if (dfpOptions.refreshExisting && $adUnitData && $adUnit.data('gsnDfpExisting')) {
        // determine if element is in view
        if (!dfpOptions.inViewOnly || isInView($adUnit)) {
          toPush.push($adUnitData);
        }

      } else {
        $adUnit.data('gsnDfpExisting', true);
        window.googletag.cmd.push(function () { window.googletag.display($adUnit.attr('id')); });

      }

    });
    if (toPush.length > 0) {
      window.googletag.cmd.push(function () { window.googletag.pubads().refresh(toPush); });
    }
  },

  /**
   * Get the id of the adUnit div or generate a unique one.
   * @param  Object $adUnit     The adunit to work with
   * @param  String adUnitName The name of the adunit
   * @param  Integer count     The current count of adunit, for uniqueness
   * @return String             The ID of the adunit or a unique autogenerated ID
   */
  getID = function ($adUnit, adUnitName, count) {

    if (!dfpOptions.refreshExisting) {
      $adUnit.data(storeAs, null);
      $adUnit.data('gsnDfpExisting', null);
      if ($adUnit.attr('id')) {
        $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count);
      }
    }

    return $adUnit.attr('id') || $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count).attr('id');

  },

  /**
   * Get the dimensions of the ad unit using the container div dimensions or
   * check for the optional attribute data-dimensions
   * @param  Object $adUnit The adunit to work with
   * @return Array         The dimensions of the adunit (width, height)
   */
  getDimensions = function ($adUnit) {

    var dimensions = [],
        dimensionsData = $adUnit.data('dimensions');

    // Check if data-dimensions are specified. If they aren't, use the dimensions of the ad unit div.
    if (dimensionsData) {

      var dimensionGroups = dimensionsData.split(',');

      $.each(dimensionGroups, function (k, v) {

        var dimensionSet = v.split('x');
        dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);

      });

    } else {

      dimensions.push([$adUnit.width(), $adUnit.height()]);

    }

    return dimensions;

  },

  /**
   * Call the google DFP script - there is a little bit of error detection in here to detect
   * if the dfp script has failed to load either through an error or it being blocked by an ad
   * blocker... if it does not load we execute a dummy script to replace the real DFP.
   */
  dfpLoader = function () {

    // make sure we don't load gpt.js multiple times
    dfpIsLoaded = dfpIsLoaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
    if (dfpIsLoaded) {
      return;
    }

    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];

    var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';

    // Adblock blocks the load of Ad scripts... so we check for that
    gads.onerror = function () {
      dfpBlocked();
    };

    var useSsl = 'https:' === document.location.protocol;
    gads.src = (useSsl ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);

    // Adblock plus seems to hide blocked scripts... so we check for that
    if (gads.style.display === 'none') {
      dfpBlocked();
    }

  },

  /**
   * This function gets called if DFP has been blocked by an adblocker
   * it implements a dummy version of the dfp object and allows the script to excute its callbacks
   * regardless of whether DFP is actually loaded or not... it is basically only useful for situations
   * where you are laying DFP over existing content and need to init things like slide shows after the loading
   * is completed.
   */
  dfpBlocked = function () {

    // Get the stored dfp commands
    var commands = window.googletag.cmd;

    // SetTimeout is a bit dirty but the script does not execute in the correct order without it
    setTimeout(function () {

      var _defineSlot = function (name, dimensions, id, oop) {
        window.googletag.ads.push(id);
        window.googletag.ads[id] = {
          renderEnded: function () { },
          addService: function () { return this; }
        };
        return window.googletag.ads[id];
      };

      // overwrite the dfp object - replacing the command array with a function and defining missing functions
      window.googletag = {
        cmd: {
          push: function (callback) {
            callback.call(dfpScript);
          }
        },
        ads: [],
        pubads: function () { return this; },
        noFetch: function () { return this; },
        disableInitialLoad: function () { return this; },
        disablePublisherConsole: function () { return this; },
        enableSingleRequest: function () { return this; },
        setTargeting: function () { return this; },
        collapseEmptyDivs: function () { return this; },
        enableServices: function () { return this; },
        defineSlot: function (name, dimensions, id) {
          return _defineSlot(name, dimensions, id, false);
        },
        defineOutOfPageSlot: function (name, id) {
          return _defineSlot(name, [], id, true);
        },
        display: function (id) {
          window.googletag.ads[id].renderEnded.call(dfpScript);
          return this;
        }

      };

      // Execute any stored commands
      $.each(commands, function (k, v) {
        window.googletag.cmd.push(v);
      });

    }, 50);

  };

  /**
   * Add function to the jQuery / Zepto / tire namespace
   * @param  String id      (Optional) The DFP account ID
   * @param  Object options (Optional) Custom options to apply
   */
  $.gsnDfp = $.fn.gsnDfp = function (id, options) {

    options = options || {};

    if (id === undefined) {
      id = dfpID;
    }

    if (typeof id === 'object') {
      options = id;
      id = options.dfpID || dfpID;
    }

    var selector = this;

    if (typeof this === 'function') {
      selector = dfpSelector;
    }

    init(id, selector, options);

    return this;

  };

})(window.jQuery || window.Zepto || window.tire, window);

/**
 * Created by eschmit on 9/30/2014.
 */
;(function($){

  var gsnNetworkID = '/6394/shoptocook.292.schnucks';

  $(document).ready(function(){
    $.gsnSw2({
      chainId: 292,
      dfpID: gsnNetworkID,
      displayWhenExists: '.gsnunit',
      enableSingleRequest: false,
      onClose: autoRefresh
    });
  });

  Gsn.Advertising.refreshAdPods = function(){
    $.gsnDfp({
      dfpID: gsnNetworkID,
      setTargeting: { brand: Gsn.Advertising.getBrand() },
      enableSingleRequest: false
    });
  }

  autoRefresh = function(){
    Gsn.Advertising.refreshAdPods();
    setTimeout(function(){
      autoRefresh()
    }, 30000);
  };
})(window.jQuery);