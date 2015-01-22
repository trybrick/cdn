/*!
gsn.core - 1.4.0
GSN API SDK
Build date: 2015-01-22 12-02-42 
*/
/*!
 *  Project:        Utility
 *  Description:    Utility methods
 *  Author:         Tom Noogen
 *  License:        Grocery Shopping Network
 *  Version:        1.0.3
 *
 */
; (function () {
  'use strict';

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `gsn` variable.
  var previousGsn = root.gsn;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype,
      ObjProto = Object.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    slice = ArrayProto.slice,
    hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach = ArrayProto.forEach,
    nativeMap = ArrayProto.map,
    nativeSome = ArrayProto.some,
    nativeIndexOf = ArrayProto.indexOf,
    nativeKeys = Object.keys;

  /* jshint -W055 */
  // Create a safe reference to the gsn object for use below.
  var gsn = function (obj) {
    if (obj instanceof gsn) return obj;
    if (!(this instanceof gsn)) return new gsn(obj);
    this._wrapped = obj;
    return this;
  };

  // Export the gsn object for **Node.js**, with
  // backwards-compatibility for the old `require()` API.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = gsn;
    }
    exports.gsn = gsn;
  } else {
    root.gsn = gsn;
  }

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf gsn
   * @type string
   */
  gsn.VERSION = '1.0.3';

  // internal config
  gsn.config = {
    // url config
    AuthServiceUrl: '/proxy/auth',
    StoreServiceUrl: '/proxy/store',
    ProfileServiceUrl: '/proxy/profile',
    ShoppingListServiceUrl: '/proxy/shoppinglist',
    LoggingServiceUrl: '/proxy/logging',
    YoutechCouponUrl: '/proxy/couponut',
    RoundyProfileUrl: '/proxy/roundy',
    ApiUrl: '',

    // global config
    Version: new Date().getTime(),
    EmailRegex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ServiceUnavailableMessage: 'We are unable to process your request at this time.',

    // true to make use of localStorage for better caching of user info across session, useful in a phonegap or mobile site app
    UseLocalStorage: false,

    // chain specific config                    
    ContentBaseUrl: '/app',
    // SiteTheme: null,
    MaxResultCount: 50,
    ChainId: 0,
    ChainName: 'Grocery Shopping Network',
    DfpNetworkId: '/6394/digitalstore.test',
    GoogleAnalyticAccountId1: null,
    GoogleAnalyticAccountId2: null,
    GoogleSiteVerificationId: null,
    RegistrationFromEmailAddress: 'tech@grocerywebsites.com',
    EnableCircPlus: null,
    EnableShopperWelcome: null,
    FacebookAppId: null,
    FacebookPermission: null,
    GoogleSiteSearchCode: null,
    DisableLimitedTimeCoupons: false,
    hasRoundyProfile: false,
    Theme: null,
    HomePage: null
  };

  gsn.identity = function (value) {
    return value;
  };

  gsn.userAgent = root.navigator.userAgent;

  function detectIe() {
    var ua = gsn.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    if (trident > 0) {
      // IE 11 (or newer) => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    // other browser
    return false;
  }

  gsn.browser = {
    isIE: detectIe(),
    userAgent: gsn.userAgent,
    isMobile: /iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/gi.test(gsn.userAgent),
    isAndroid: /(android)/gi.test(gsn.userAgent),
    isIOS: /iP(hone|od|ad)/gi.test(gsn.userAgent)
  };
  //#region Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = gsn.each = gsn.forEach = function (obj, iterator, context) {
    if (gsn.isNull(obj, null) === null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = gsn.keys(obj);
      for (var j = 0, length2 = keys.length; j < length2; j++) {
        if (iterator.call(context, obj[keys[j]], keys[j], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  gsn.map = gsn.collect = function (obj, iterator, context) {
    var results = [];
    if (gsn.isNull(obj, null) === null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function (value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };
  //#endregion

  //#region methods 
  // --------------------
  // Extend a given object with all the properties in passed-in object(s).
  // gsn.extend(destination, *source);
  gsn.extend = function (obj) {
    each(slice.call(arguments, 1), function (source) {
      if (typeof (source) !== 'undefined') {
        gsn.forEach(source, function (v, k) {
          if (gsn.isNull(v, null) !== null) {
            obj[k] = v;
          }
        });
      }
    });
    return obj;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = gsn.some = gsn.any = function (obj, predicate, context) {
    predicate = predicate || gsn.identity;
    var result = false;
    if (gsn.isNull(obj, null) === null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function (value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
      return null;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  gsn.contains = gsn.include = function (obj, target) {
    if (gsn.isNull(obj, null) === null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function (value) {
      return value === target;
    });
  };

  // extend the current config
  gsn.applyConfig = function (config, dontUseProxy) {
    gsn.extend(gsn.config, config);
    gsn.config.HomePage = gsn.parsePartialContentData(gsn.config.HomePage);
    // proxy is default configuration, determine if proxy should be replace with direct url to api
    var useProxy = !dontUseProxy;

    // use proxy and older android, then it must use proxy
    if (useProxy && gsn.browser.isAndroid) {
      var ua = gsn.browser.userAgent;
      var androidversion = parseFloat(ua.slice(ua.indexOf("Android") + 8));

      if (androidversion > 4) {
        return;
      }
      
      useProxy = false;
    }
    
    // if not useProxy, replace proxy with valid api url
    if (!useProxy) {
      gsn.forEach(gsn.config, function (v, k) {
        if (typeof (v) !== 'string' || v == 'ApiUrl') return;
        if (v.indexOf('/proxy/') >= 0) {
          gsn.config[k] = v.replace('/proxy/', gsn.config.ApiUrl + '/');
        }
      });
    }
  };

  // return defaultValue if null
  gsn.isNull = function (obj, defaultValue) {
    return (typeof (obj) === 'undefined' || obj === null) ? defaultValue : obj;
  };

  // return defaultValue if NaN
  gsn.isNaN = function (obj, defaultValue) {
    return (isNaN(obj)) ? defaultValue : obj;
  };

  // sort a collection base on a field name
  gsn.sortOn = function (collection, name) {
    if (gsn.isNull(collection, null) === null) return null;
    if (collection.length <= 0) return [];

    // detect attribute type, problem is if your first object is null or not string then this breaks
    if (typeof (collection[0][name]) == 'string') {
      collection.sort(function (a, b) {
        if ((a[name] && a[name].toLowerCase()) < (b[name] && b[name].toLowerCase())) return -1;
        if ((a[name] && a[name].toLowerCase()) > (b[name] && b[name].toLowerCase())) return 1;
        return 0;
      });
    } else {
      collection.sort(function (a, b) {
        if (a[name] < b[name]) return -1;
        if (a[name] > b[name]) return 1;
        return 0;
      });
    }

    return collection;
  };

  // clean keyword - for support of sending keyword to google dfp
  gsn.cleanKeyword = function (keyword) {
    var result = keyword.replace(/[^a-zA-Z0-9]+/gi, '_').replace(/^[_]+/gi, '');
    if (gsn.isNull(result.toLowerCase, null) !== null) {
      result = result.toLowerCase();
    }
    return result;
  };

  // group a list by a field name/attribute and execute post process function
  gsn.groupBy = function (list, attribute, postProcessFunction) {
    if (gsn.isNull(list, null) === null) return [];

    // First, reset declare result.
    var groups = [];
    var grouper = {};

    // this make sure all elements are correctly sorted
    gsn.forEach(list, function (item) {
      var groupKey = item[attribute];
      var group = grouper[groupKey];
      if (gsn.isNull(group, null) === null) {
        group = { key: groupKey, items: [] };
        grouper[groupKey] = group;
      }
      group.items.push(item);
    });

    // finally, sort on group
    var i = 0;
    gsn.forEach(grouper, function (myGroup) {
      myGroup.$idx = i++;
      groups.push(myGroup);

      if (postProcessFunction) postProcessFunction(myGroup);
    });

    return gsn.sortOn(groups, 'key');
  };

  // map a list to object, todo: there is this better array map some where
  gsn.mapObject = function (list, attribute) {
    var obj = {};
    if (list) {
      if (gsn.isNull(list.length, -1) < 0) {
        obj[list[attribute]] = list;
      } else {
        gsn.map(list, function (item, i) {
          obj[item[attribute]] = item;
        });
      }
    }
    return obj;
  };

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  gsn.keys = nativeKeys || function (obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (gsn.has(obj, key)) keys.push(key);
    return keys;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  gsn.has = function (obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  gsn.getUrl = function (baseUrl, url) {
    url = gsn.isNull(url, '');
    var data = ((url.indexOf('?') > 0) ? '&' : '?') + 'nocache=' + gsn.config.Version;
    return (baseUrl + url + data).replace(/(\\\\)+/gi, '\\');
  };

  // get the content url
  gsn.getContentUrl = function (url) {
    return gsn.getUrl(gsn.config.ContentBaseUrl, url);
  };

  gsn.getThemeUrl = function (url) {
    var baseUrl = gsn.config.ContentBaseUrl;

    if (gsn.isNull(gsn.config.SiteTheme, '').length > 0) {
      baseUrl = baseUrl.replace('/' + gsn.config.ChainId, '/' + gsn.config.SiteTheme);
    }

    return gsn.getUrl(baseUrl, url);
  };

  gsn.setTheme = function (theme) {
    gsn.config.SiteTheme = theme;
  };
  //#endregion

  if (root.globalConfig) {
    gsn.config.ApiUrl = gsn.isNull(root.globalConfig.apiUrl, '').replace(/\/+$/g, '');
  }

  //#region dynamic script loader
  function loadSingleScript(uri, callbackFunc) {
    var tag = document.createElement('script');
    tag.type = 'text/javascript';
    tag.src = uri;
    if (callbackFunc) {
      tag.onload = maybeDone;
      tag.onreadystatechange = maybeDone; // For IE8-
    }

    document.body.appendChild(tag);

    /* jshint -W040 */
    function maybeDone() {
      if (this.readyState === undefined || this.readyState === 'complete') {
        // Pull the tags out based on the actual element in case IE ever
        // intermingles the onload and onreadystatechange handlers for the same
        // script block before notifying for another one.
        if (typeof (callbackFunc) === 'function') callbackFunc();
      }
    }
    /* jshint +W040 */
  }

  gsn.loadScripts = function (uris, callbackFunc) {
    if (gsn.isNull(uris.length, 0) <= 0) {
      if (typeof (callbackFunc) === 'function') {
        callbackFunc();
      }
    }
    else {
      var toProcess = [].concat(uris);
      processNext();
    }

    function processNext() {
      if (toProcess.length <= 0) {
        if (typeof (callbackFunc) === 'function') {
          callbackFunc();
        }
      }
      else {
        var item = toProcess[0];
        toProcess.splice(0, 1);
        loadSingleScript(item, processNext);
      }
    }
  };

  gsn.loadIframe = function (parentEl, html) {
    var iframe = document.createElement('iframe');
    parentEl[0].appendChild(iframe);

    /* jshint -W107 */
    if (iframe.contentWindow) {
      iframe.contentWindow.contents = html;
      iframe.src = 'javascript:window["contents"]';
    } else {
      var doc = iframe.document;
      if (iframe.contentDocument) doc = iframe.contentDocument;
      doc.open();
      doc.write(html);
      doc.close();
    }
    /* jshint +W107 */

    return iframe;
  };

  gsn.parsePartialContentData = function(data) {
    if (gsn.isNull(data, null) === null) {
      data = { ConfigData: {}, ContentData: {}, ContentList: [] };
    }

    var result = data;
    if (result.ConfigData) {
      return result;
    }

    var configData = [];
    var contentData = [];

    // parse home config
    if (result.Contents) {
      gsn.forEach(result.Contents, function (v, k) {
        if (v.IsMetaData) configData.push(v);
        else contentData.push(v);
      });

      result.Contents = null;
      result.ConfigData = gsn.mapObject(configData, 'Headline');
      result.ContentData = gsn.mapObject(contentData, 'SortBy');
      var contentList = [];
      for (var i = 0; i < contentData.length; i++) {
        contentList.push(contentData[i]);
      }
      
      if (contentList.length > 0) {
        result.ContentList = gsn.sortOn(contentList, "SortBy");
      }
    }

    return result;
  };
  //#endregion

}).call(this);
(function (window, gsn, angular, undefined) {
  'use strict';

  /**
   * @ngdoc overview
   * @name angulartics.gsn.ga
   * Enables analytics support for Google Analytics (http://google.com/analytics)
   */
  angular.module('angulartics.gsn.ga', ['angulartics'])
  .config(['$analyticsProvider', function ($analyticsProvider) {
    $analyticsProvider.init = function () {
      // GA already supports buffered invocations so we don't need
      // to wrap these inside angulartics.waitForVendorApi
      if ($analyticsProvider.settings) {
        $analyticsProvider.settings.trackRelativePath = true;
      }
      
      var firstTracker = (gsn.isNull(gsn.config.GoogleAnalyticAccountId1, '').length > 0);
      var secondTracker = (gsn.isNull(gsn.config.GoogleAnalyticAccountId2, '').length > 0);

      if (window.ga) {
        // creating google analytic object
        if (firstTracker) {
          ga('create', gsn.config.GoogleAnalyticAccountId1, 'auto');

          if (secondTracker) {
            ga('create', gsn.config.GoogleAnalyticAccountId2, 'auto', { 'name': 'trackerTwo' });
          }
        } else if (secondTracker) {
          secondTracker = false;
          ga('create', gsn.config.GoogleAnalyticAccountId2, 'auto');
        }

        // enable demographic
        ga('require', 'displayfeatures');
      }
                                         
      // GA already supports buffered invocations so we don't need
      // to wrap these inside angulartics.waitForVendorApi

      $analyticsProvider.registerPageTrack(function (path) {   
        // begin tracking
        if (window.ga) {
          ga('send', 'pageview', path);

          if (secondTracker) {
            ga('trackerTwo.send', 'pageview', path);
          }
        }
        
        // piwik tracking
        if (window._paq) {
          _paq.push(['setCustomUrl', path]);
          _paq.push(['trackPageView']);
        }
        
        // quantcast tracking
        if (window._qevents) {
          _qevents.push({
            qacct: "p-1bL6rByav5EUo"
          });
        }
      });

      /**
      * Track Event in GA
      * @name eventTrack
      *
      * @param {string} action Required 'action' (string) associated with the event
      * @param {object} properties Comprised of the mandatory field 'category' (string) and optional  fields 'label' (string), 'value' (integer) and 'noninteraction' (boolean)
      *
      * @link https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#SettingUpEventTracking
      *
      * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/events
      */
      $analyticsProvider.registerEventTrack(function (action, properties) {
        // GA requires that eventValue be an integer, see:
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventValue
        // https://github.com/luisfarzati/angulartics/issues/81
        if (properties.value) {
          var parsed = parseInt(properties.value, 10);
          properties.value = isNaN(parsed) ? 0 : parsed;
        }

        if (window.ga) {
          if (properties.noninteraction) {
            ga('send', 'event', properties.category, action, properties.label, properties.value, { nonInteraction: 1 });
            if (secondTracker) {
              ga('trackerTwo.send', 'event', properties.category, action, properties.label, properties.value, { nonInteraction: 1 });
            }
          } else {
            ga('send', 'event', properties.category, action, properties.label, properties.value);
            if (secondTracker) {
              ga('trackerTwo.send', 'event', properties.category, action, properties.label, properties.value);
            }
          }
        }
        
        if (window.Piwik) {
          var tracker = Piwik.getAsyncTracker();
          tracker.trackEvent(properties.category, action, properties.label, properties.value);
        }
      });
    };
  }]);
})(window, gsn, angular);
(function (gsn, angular, undefined) {
  'use strict';
  /* fake definition of angular-facebook if there is none */
  angular.module('facebook', []);
  var serviceId = 'gsnApi';
  angular.module('gsn.core', ['ngRoute', 'ngSanitize', 'facebook'])
      .service(serviceId, ['$rootScope', '$window', '$timeout', '$q', '$http', '$location', '$localStorage', '$sce', '$route', gsnApi]);

  function gsnApi($rootScope, $window, $timeout, $q, $http, $location, $localStorage, $sce, $route) {
    var returnObj = { previousDefer: null };
    var profileStorage = $localStorage;

    //#region gsn pass-through methods
    // return defaultValue if null - isNull(val, defaultIfNull)
    returnObj.isNull = gsn.isNull;

    // return defaultValue if NaN - isNaN(val, defaultIfNaN)
    returnObj.isNaN = gsn.isNaN;

    // sort a collection base on a field name - sortOn(list, 'field')
    returnObj.sortOn = gsn.sortOn;

    // group a list by a field name/attribute - groupBy(list, 'key') - result array with (key, items) property
    returnObj.groupBy = gsn.groupBy;

    // map a list to object, similar to reduce method - mapObject(list, 'key') - result object by key as id
    returnObj.mapObject = gsn.mapObject;

    // iterator method - forEach(list, function(v,k,list));
    returnObj.forEach = gsn.forEach;

    // shallow extend method - extend(dest, src)
    returnObj.extend = gsn.extend;

    returnObj.getContentUrl = function(url) {
      return $sce.trustAsResourceUrl(gsn.getContentUrl(url));
    };
    
    returnObj.getThemeUrl = function (url) {
      return $sce.trustAsResourceUrl(gsn.getThemeUrl(url));
    };

    returnObj.cleanKeyword = gsn.cleanKeyword;

    returnObj.loadIframe = gsn.loadIframe;

    returnObj.loadScripts = gsn.loadScripts;
    
    returnObj.userAgent = gsn.userAgent;
    
    returnObj.browser = gsn.browser;

    returnObj.parsePartialContentData = gsn.parsePartialContentData;
    //#endregion

    //#region gsn.config pass-through       
    returnObj.getConfig = function () {
      return gsn.config;
    };
    
    returnObj.getApiUrl = function () {
      return gsn.config.ApiUrl;
    };
    
    returnObj.getStoreUrl = function () {
      return gsn.config.StoreServiceUrl;
    };

    returnObj.getContentServiceUrl = function (method) {
      return returnObj.getApiUrl() + '/Content/' + method + '/' + returnObj.getChainId() + '/' + returnObj.isNull(returnObj.getSelectedStoreId(), '0') + '/';
    };
    
    returnObj.getYoutechCouponUrl = function () {
      return gsn.config.YoutechCouponUrl;
    };

    returnObj.getRoundyProfileUrl = function() {
      return gsn.config.RoundyProfileUrl;
    };

    returnObj.getProductServiceUrl = function () {
      return gsn.config.ProductServiceUrl;
    };

    returnObj.getShoppingListApiUrl = function () {
      return gsn.config.ShoppingListServiceUrl;
    };

    returnObj.getProfileApiUrl = function () {
      return gsn.config.ProfileServiceUrl;
    };

    returnObj.getLoggingApiUrl = function () {
      return gsn.config.LoggingServiceUrl;
    };

    returnObj.getUseLocalStorage = function () {
      return returnObj.isNull(gsn.config.UseLocalStorage, false);
    };

    returnObj.getVersion = function () {
      /// <summary>Get the application version</summary>

      return gsn.config.Version;
    };

    returnObj.getGoogleSiteSearchCode = function () {
      return gsn.config.GoogleSiteSearchCode;
    };

    returnObj.getGoogleSiteVerificationId = function () {
      return gsn.config.GoogleSiteVerificationId;
    };

    returnObj.getEnableCircPlus = function () {
      return returnObj.isNull(gsn.config.EnableCircPlus, 'false') == 'true';
    };
    
    returnObj.getEnableShopperWelcome = function () {
      return returnObj.isNull(gsn.config.EnableShopperWelcome, 'false') == 'true';
    };

    returnObj.isBetween = function (value, min, max) {
      return value > min && value < max;
    };

    returnObj.getFacebookPermission = function () {
      // if empty, get at least email permission
      return returnObj.isNull(gsn.config.FacebookPermission, 'email');
    };

    returnObj.getGoogleAnalyticAccountId1 = function () {
      return returnObj.isNull(gsn.config.GoogleAnalyticAccountId1, '');
    };

    returnObj.getGoogleAnalyticAccountId2 = function () {
      return returnObj.isNull(gsn.config.GoogleAnalyticAccountId2, '');
    };

    returnObj.getEmailRegEx = function () {
      return gsn.config.EmailRegex;
    };

    returnObj.getDfpNetworkId = function () {
      return gsn.config.DfpNetworkId;
    };

    returnObj.getMaxResultCount = function () {
      return gsn.config.MaxResultCount ? gsn.config.MaxResultCount : 50;
    };

    returnObj.getServiceUnavailableMessage = function () {
      return gsn.config.ServiceUnavailableMessage;
    };

    returnObj.getChainId = function () {
      return gsn.config.ChainId;
    };

    returnObj.getChainName = function () {
      return gsn.config.ChainName;
    };

    returnObj.getHomeData = function () {
      return gsn.config.HomePage;
    };

    returnObj.getRegistrationFromEmailAddress = function () {
      return gsn.config.RegistrationFromEmailAddress;
    };

    returnObj.htmlFind = function(html, find) {
      return angular.element('<div>' + html + '</div>').find(find).length;
    };
    
    returnObj.equalsIgnoreCase = function (val1, val2) {
      return angular.lowercase(val1) == angular.lowercase(val2);
    };

    returnObj.toLowerCase = function (str) {
      return angular.lowercase(str);
    };

    returnObj.goUrl = function(url, target) {
      /// <summary>go to url</summary>

      try {
        // attempt to hide any modal
        angular.element('.modal').modal('hide');
      } catch(e) {
      }

      if (returnObj.isNull(target, '') == '_blank') {
        $window.open(url, '');
        return;
      } else if (returnObj.isNull(target, '') == '_reload') {
        if ($window.top) {
          $window.top.location = url;
        } else {
          $window.location = url;
        }

        return;
      }

      $location.url(url);
    };
    //#endregion

    returnObj.parseStoreSpecificContent = function(contentData) {
      var contentDataResult = {};
      var myContentData = contentData;
      var storeId = returnObj.isNull(returnObj.getSelectedStoreId(), 0);
      
      // determine if contentData is array
      if (contentData && contentData.Id) {
        myContentData = [contentData];
      }
      
      var i = 0;
      angular.forEach(myContentData, function (v, k) {
        var storeIds = returnObj.isNull(v.StoreIds, []);
          
        // get first content as default or value content without storeids
        if (i <= 0 && storeIds.length <= 0) {
          contentDataResult = v;
        }
        i++;

        if (storeId <= 0) {
          return;
        }
          
        angular.forEach(storeIds, function (v1, k1) {
          if (storeId == v1) {
            contentDataResult = v;
          }
        });
      });

      return contentDataResult;
    };
    
    returnObj.getThemeContent = function (contentPosition) {
      return returnObj.parseStoreSpecificContent(returnObj.getHomeData().ContentData[contentPosition]);
    };

    returnObj.getThemeConfig = function (name) {
      return returnObj.parseStoreSpecificContent(returnObj.getHomeData().ConfigData[name]);
    };
    
    returnObj.getThemeConfigDescription = function (name, defaultValue) {
      var resultObj = returnObj.getThemeConfig(name).Description;
      return returnObj.isNull(resultObj, defaultValue);
    };
    
    returnObj.getFullPath = function (path, includePort) {
      var normalizedPath = (returnObj.isNull(path, '') + '').replace(/$\/+/gi, '');
      if (normalizedPath.indexOf('http') > -1) {
        return path;
      }
      if ($location.host() == 'localhost') {
        includePort = true;
      }

      normalizedPath = ($location.protocol() + '://' + $location.host() + (includePort ? ':' + $location.port() : '') + ('/' + normalizedPath).replace(/(\/\/)+/gi, '\/'));
      return normalizedPath;
    };
    
    returnObj.getPageCount = function (data, pageSize) {
      data = data || [];
      return (Math.ceil(data.length / pageSize) || 1);
    };
    
    //#region storeId, shoppingListId, anonymousToken, etc...
    returnObj.getSelectedStoreId = function () {
      return profileStorage.storeId;
    };

    returnObj.setSelectedStoreId = function (storeId) {
      // make sure we don't set a bad store id
      var storeIdInt = parseInt(storeId);
      if (returnObj.isNaN(storeIdInt, 0) <= 0) {
        storeId = null;
      }
      
      var previousStoreId = profileStorage.storeId;
      profileStorage.storeId = storeId;
      $rootScope.$broadcast('gsnevent:store-setid', {newValue: storeId, oldValue: previousStoreId });
    };

    returnObj.getProfileId = function () {
      var accessToken = getAccessToken();
      return returnObj.isNaN(parseInt(returnObj.isNull(accessToken.user_id, 0)), 0);
    };

    returnObj.getShoppingListId = function () {
      return returnObj.isNull(profileStorage.shoppingListId, 0);
    };

    returnObj.setShoppingListId = function (shoppingListId, dontBroadcast) {
      profileStorage.shoppingListId = returnObj.isNull(shoppingListId, 0);

      if (dontBroadcast) return;

      $rootScope.$broadcast('gsnevent:shoppinglist-setid', shoppingListId);
    };
    //#endregion

    // wait until some function eval to true, also provide a timeout default to 2 seconds
    returnObj.waitUntil = function(evalFunc, timeout) {
      var deferred = $q.defer();
      var timeUp = false;
      $timeout(function() {
        timeUp = true;
      }, timeout || 2000);
      
      function doWait() {
        if (timeUp || evalFunc()) {
          deferred.resolve({ success: !timeUp });
        }
        
        $timeout(doWait, 200);
      }

      doWait();
      return deferred.promise;
    };
    
    returnObj.getApiHeaders = function () {
      // assume access token data is available at this point
      var accessTokenData = getAccessToken();
      var payload = {
        site_id: returnObj.getChainId(),
        store_id: returnObj.getSelectedStoreId(),
        profile_id: returnObj.getProfileId(),
        access_token: accessTokenData.access_token,
        'Content-Type': 'application/json'
      };

      return payload;
    };

    returnObj.isAnonymous = function () {
      /// <summary>Determine if a user is logged in.</summary>

      var accessTokenData = getAccessToken();

      return returnObj.isNull(accessTokenData.grant_type, '') == 'anonymous';
    };

    returnObj.isLoggedIn = function () {
      /// <summary>Determine if a user is logged in.</summary>

      var accessTokenData = getAccessToken();

      return returnObj.isNull(accessTokenData.grant_type, '') == 'password';
    };

    returnObj.logOut = function () {
      /// <summary>Log a user out.</summary>

      // attempt to reset to anonymous token
      var previousProfileId = returnObj.getProfileId();
      var data = getAnonymousToken();
      setAccessToken(data);

      // if invalid anonymous token, cause a login
      if (returnObj.isNull(data.expires_dt, 0) <= 0) {

        // TODO: rethink this as it may cause infinit loop on browser if server is down
        returnObj.getAccessToken();
      }

      $rootScope.$broadcast('gsnevent:logout', { ProfileId: previousProfileId });
    };

    returnObj.doAuthenticate = function (payload) {
      // make the auth call
      $http.post(gsn.config.AuthServiceUrl + "/Token2", payload, { headers: { 'Content-Type': 'application/json', shopping_list_id: returnObj.getShoppingListId() } })
          .success(function (response) {
            // Since server automatically send grant_type ('anonymous'/'password') for refresh payload
            // DO NOT SET: response.grant_type = payload.grant_type;
            response.expires_dt = (new Date().getTime()) + 1000 * response.expires_in;
            
            setAccessToken(response);
            var defer = returnObj.previousDefer;
            if (defer) {
              returnObj.previousDefer = null;
              defer.resolve(response);
            }
            
            $rootScope.$broadcast('gsnevent:login-success', { success: true, payload: payload, response: response });
          }).error(function (response) {
            var refreshTokenFailed = (payload.grant_type == 'refresh_token' && returnObj.isNull(response.ExceptionMessage, '').indexOf('expired') > 0);

            // if refresh failed, it is being handled in 'gsnevent:auth-invalidrefresh'
            if (!refreshTokenFailed) {
              // if anonymous login failed, something must be wrong with the server
              // a message should be display on the UI side?
              $rootScope.$broadcast('gsnevent:login-failed', { success: true, payload: payload, response: response });
            }
          });
    };

    returnObj.setAccessToken = setAccessToken;
    
    returnObj.getAccessToken = function () {
      var deferred = returnObj.isNull(returnObj.previousDefer, null) === null ? $q.defer() : returnObj.previousDefer;

      // check access token
      var accessTokenPayload = getAccessTokenPayload();

      // if valid token, resolve
      if (returnObj.isNull(accessTokenPayload, null) === null) {
        returnObj.previousDefer = null;
        $timeout(function () {
          deferred.resolve({ success: true, response: getAccessToken() });
        }, 10);

        return deferred.promise;
      } else {

        // do not proceed if a defer is going on
        if (returnObj.isNull(returnObj.previousDefer, null) !== null) {
          return returnObj.previousDefer.promise;
        }

        returnObj.previousDefer = deferred;
        returnObj.doAuthenticate(accessTokenPayload);
      }

      return deferred.promise;
    };

    // when it doesn't have defer
    //  -- it will create a defer and return promise
    //  -- it will make http request and call defer resolve on success
    // when it has defer or data, it will return the promise
    returnObj.httpGetOrPostWithCache = function (cacheObject, url, payload) {
      // when it has data, it will simulate resolve and return promise
      // when it doesn't have defer, it will create a defer and trigger request
      // otherwise, just return the promise
      if (cacheObject.response) {
        // small timeout to simulate async
        $timeout(function () {
          cacheObject.deferred.resolve(cacheObject.response);
        }, 50);
      }
      else if (returnObj.isNull(cacheObject.deferred, null) === null) {
        cacheObject.deferred = $q.defer();
        var successHandler = function (response) {
          cacheObject.response = { success: true, response: response };
          cacheObject.deferred.resolve(cacheObject.response);
        };
        var errorHandler = function (response) {
          cacheObject.response = { success: false, response: response };
          cacheObject.deferred.resolve(cacheObject.response);
        };

        if (url.indexOf('/undefined') > 0) {
          errorHandler('Client error: invalid request.');
        } else {
          returnObj.getAccessToken().then(function () {
            cacheObject.url = url;
            if (payload) {
              $http.post(url, payload, { headers: returnObj.getApiHeaders() }).success(successHandler).error(errorHandler);
            } else {
              $http.get(url, { headers: returnObj.getApiHeaders() }).success(successHandler).error(errorHandler);
            }
          });
        }
      }

      return cacheObject.deferred.promise;
    };

    returnObj.isValidCaptcha = function (challenge, response) {
      var defer = $q.defer();
      $http.post(gsn.config.AuthServiceUrl + "/ValidateCaptcha", { challenge: challenge, response: response }, { headers: { 'Content-Type': 'application/json' } })
          .success(function (rsp) {
            defer.resolve((rsp == 'true'));
          }).error(function (rsp) {
            defer.resolve(false);
          });
      return defer.promise;
    };

    returnObj.goBack = function () {
      $timeout(function () {
        $window.history.back();
      }, 10);
    };

    returnObj.initApp = function () {
      $rootScope.appState = 'initializing';
      initStorage();
      
      // injecting getContentUrl and getThemeUrl for css
      $rootScope.getContentUrl = returnObj.getContentUrl;
      $rootScope.getThemeUrl = returnObj.getThemeUrl;
      $rootScope.getContentServiceUrl = returnObj.getContentServiceUrl;
      $rootScope.gsnApi = returnObj;
      
      // setting the default layout
      var configData = returnObj.getHomeData().ConfigData;
      if (configData) {
        var layoutConfig = configData.layout;
        if (layoutConfig) {
          $rootScope.defaultLayout = gsn.getThemeUrl('/views/layout' + layoutConfig.Description + '/layout.html');
        }
      }

      var accessTokenData = getAccessToken();
      var hasValidAccessToken = (returnObj.isNull(accessTokenData.expires_dt, 0) > 0 && accessTokenData.expires_dt > new Date().getTime());

      if (!hasValidAccessToken) {
        // get and set to anonymous
        var anonymousTokenData = getAnonymousToken();
        setAccessToken(anonymousTokenData);
      }
      
      // give the UI 2/10 of a second to be ready
      $timeout(function () {
        $rootScope.appState = 'ready';
      }, 200);
    };

    //#region authentication event handling
    $rootScope.$on('gsnevent:auth-expired', function (evt, args) {
      var accessTokenData = getAccessToken();

      // invalidate the token
      if (accessTokenData.access_token) {
        accessTokenData.expires_dt = 0;
        setAccessToken(accessTokenData);
      }

      // trigger authentication after token invalidation
      returnObj.getAccessToken();
    });

    $rootScope.$on('gsnevent:auth-invalidrefresh', function (evt, args) {
      var accessTokenData = getAccessToken();
      if (accessTokenData.grant_type == 'anonymous') {
        // anonymous refresh expired so clear anonymous token
        setAnonymousToken();
      } else {
        // non-anonymous refresh expired, reset current credential to anonymous
      }

      returnObj.logOut();
      $route.reload();
    });
    //#endregion

    return returnObj;

    //#region Internal Methods 
    function getAccessTokenPayload() {
      var accessTokenData = getAccessToken();
      var hasValidAccessToken = (returnObj.isNull(accessTokenData.expires_dt, 0) > 0 && accessTokenData.expires_dt > new Date().getTime());

      if (hasValidAccessToken) {
        return null;
      }

      // payload default to anonymous authentication
      var payload = {
        grant_type: "anonymous",
        client_id: returnObj.getChainId(),
        access_type: 'offline'
      };

      // if previous accessToken as refresh_token capability, then try to refresh
      if (typeof (accessTokenData.refresh_token) != 'undefined') {
        payload.grant_type = 'refresh_token';
        payload.refresh_token = accessTokenData.refresh_token;
      }

      return payload;
    }

    function getAccessToken() {
      return returnObj.isNull(profileStorage.accessToken, {});
    }

    function setAccessToken(data) {
      profileStorage.accessToken = data || {};

      if (data) {
        var profileId = parseInt(returnObj.isNull(data.user_id, 0));
        if (returnObj.isNaN(profileId, 0) > 0) {
          $rootScope.$broadcast('gsnevent:profile-setid', profileId);
        }

        // finally store anonymous token
        if (data.grant_type == 'anonymous') {
          setAnonymousToken(data);
        }
      }
    }

    function getAnonymousToken() {
      return returnObj.isNull($localStorage.anonymousToken, {});
    }

    function setAnonymousToken(token) {
      var tk = returnObj.isNull(token, {});

      $localStorage.anonymousToken = tk;
    }

    function initStorage() {
      // do nothing for now
    }

//#endregion
  }
})(gsn, angular);
// bridging between Digital Store, ExpressLane, and Advertisment
(function (angular, undefined) {
  'use strict';
  var serviceId = 'gsnAdvertising';
  angular.module('gsn.core').service(serviceId, ['$timeout', '$location', 'gsnProfile', 'gsnApi', '$window', gsnAdvertising]);

  function gsnAdvertising($timeout, $location, gsnProfile, gsnApi, $window) {
    var returnObj = {};
    var myGsn = $window.Gsn;

    myGsn.Advertising.on('clickRecipe', function (data) {
      $timeout(function () {
        $location.url('/recipe?id=' + data.detail.RecipeId);
      });
    });

    myGsn.Advertising.on('clickProduct', function (data) {
      if (data.type != "gsnevent:clickProduct") return;

      $timeout(function () {
        var product = data.detail;
        if (product) {
          var item = {
            Quantity: gsnApi.isNaN(parseInt(product.Quantity), 1),
            ItemTypeId: 7,
            Description: gsnApi.isNull(product.Description, '').replace(/^\s+/gi, ''),
            CategoryId: product.CategoryId,
            BrandName: product.BrandName,
            AdCode: product.AdCode
          };

          gsnProfile.addItem(item);
        }
      });
    });

    myGsn.Advertising.on('clickLink', function (data) {
      if (data.type != "gsnevent:clickLink") return;

      $timeout(function () {
        var linkData = data.detail;
        if (linkData) {
          var url = gsnApi.isNull(linkData.Url, '');
          var lowerUrl = angular.lowercase(url);
          var target = gsnApi.isNull(linkData.Target, '');
          if (lowerUrl.indexOf('recipecenter') > 0) {
            url = '/recipecenter';
          }

          if (target == '_blank') {
            // this is a link out to open in new window
            $window.open(url, '');
          } else {
            // assume this is an internal redirect
            $location.url(url);
          }
        }
      });
    });

    myGsn.Advertising.on('clickBrickOffer', function (data) {
      if (data.type != "gsnevent:clickBrickOffer") return;

      $timeout(function () {
        var linkData = data.detail;
        if (linkData) {
          var url = gsnApi.getProfileApiUrl() + '/BrickOffer/' + gsnApi.getProfileId() + '/' + linkData.OfferCode;

          // open brick offer
          $window.open(url, '');
        }
      });
    });

    return returnObj;
  }
})(angular);
(function (angular, undefined) {
  'use strict';
  var serviceId = 'gsnDfp';
  angular.module('gsn.core').service(serviceId, ['$rootScope', 'gsnApi', 'gsnStore', 'gsnProfile', '$sessionStorage', '$window', '$timeout', '$location', gsnDfp]);

  function gsnDfp($rootScope, gsnApi, gsnStore, gsnProfile, $sessionStorage, $window, $timeout, $location) {
    var service = {
      doRefresh: doRefresh,
      lastRefreshTime: null,
      targeting: { dept: [] },
      isLoading: false,
      refreshExisting: true,
      refreshExistingCircPlus: true,
      dfpNetworkId: '',
      enableCircPlus: gsnApi.getEnableCircPlus(),
      enableShopperWelcome: gsnApi.getEnableShopperWelcome(),
      isIE: gsnApi.browser.isIE,
      hasDisplayedShopperWelcome: false,
      shopperWelcomeInProgress: false,
      circPlusBody: gsnApi.getChainId() < 214 || gsnApi.getChainId() > 218 ? null : '<div class="gsn-slot-container"><div class="cpslot cpslot2" data-companion="true" data-dimensions="300x50"></div></div><div class="gsn-slot-container"><div class="cpslot cpslot1" data-companion="true" data-dimensions="300x100,300x120"></div></div>',
      delayBetweenLoad: 5          // in seconds
    };
    
    $rootScope.$on('gsnevent:shoppinglistitem-updating', function (event, shoppingList, item) {
      var currentListId = gsnApi.getShoppingListId();
      if (shoppingList.ShoppingListId == currentListId) {
        var items = gsnProfile.getShoppingList().allItems().slice(0, 10);
        service.targeting.dept = getAdDepts(items);
        service.doRefresh(true);
      }
    });

    $rootScope.$on('$routeChangeSuccess', function (event, next) {
      service.lastRefreshTime = 0;
      service.currentPath = angular.lowercase(gsnApi.isNull($location.path(), ''));
    });

    $rootScope.$on('gsnevent:loadads', function (event, next) {
      service.refreshExistingRegular = false;
      service.refreshExistingCircPlus = false;

      $timeout(function () {
        if (!canContinue()) return;
        service.doRefresh();
      }, 0);
    });

    $rootScope.$on('gsnevent:digitalcircular-pagechanging', function (evt, data) {
      // { plugin: plug, circularIndex: circIdx, pageIndex: pageIdx });
      // scroll to top     
      service.doRefresh();

      if (angular.element($window).scrollTop() > 140) {
        $window.scrollTo(0, 120);
      }
    });

    init();
    
    return service;

    // initialization
    function init() {
      if (service.isIE) {
        service.delayBetweenLoad = 15;
      }
    }
    
    // determien if refresh can continue
    function canContinue() {
      if (angular.element('.gsnunit').length <= 0) return false;
      // if (service.isIE) return false;
      if (service.shopperWelcomeInProgress) return false;
      
      // WARNING: do custom delay below instead of using timeout or you get $rootScope $digest issue
      var currentTime = new Date().getTime();
      var seconds = (currentTime - gsnApi.isNull(service.lastRefreshTime, 0)) / 1000;
      return (seconds > service.delayBetweenLoad);
    }

    // attempt to update network id
    function updateNetworkId() {
      gsnStore.getStore().then(function (rst) {
        if (service.store != rst) {
          var baseNetworkId = gsnApi.getDfpNetworkId().replace(/\/$/gi, '');
          
          service.store = rst;
          if (service.store) {
            try {
              baseNetworkId += '/' + service.store.City + '-' + service.store.StateName + '-' + service.store.PostalCode + '-' + service.store.StoreId;
              baseNetworkId = baseNetworkId.replace(/(undefined)+/gi, '').replace(/\s+/gi, '');
            } catch(e) {
              baseNetworkId = gsnApi.getDfpNetworkId().replace(/\/$/gi, '');
            }
          }
          
          if (service.dfpNetworkId != baseNetworkId) {
            service.dfpNetworkId = baseNetworkId;
            service.refreshExistingRegular = false;
            service.refreshExistingCircPlus = false;
          }
        }
      });
    }

    // refresh method    

    function doRefreshInternal(refreshCircPlus, timeout) {
      // targetted campaign
      if (parseFloat(gsnApi.isNull($sessionStorage.GsnCampaign, 0)) <= 0) {

        doCampaignRefresh();
        // don't need to continue with the refresh since it's being patched through get campaign above
        return;
      }

      // refreshing adpods
      setTimeout(doRefreshAdPods, timeout || 50);

      // only refresh if circplus is enabled
      if (!service.enableCircPlus) return;
      if (!refreshCircPlus) return;

      // refreshing circplus
      setTimeout(doRefreshCircPlus, timeout || 500);
    }

    function doRefresh(refreshCircPlus, timeout) {
      if (!canContinue()) return;
      service.lastRefreshTime = new Date().getTime();

      // make sure current network id has store info and stuff
      updateNetworkId();
      
      if (gsnApi.isNull(service.dfpNetworkId, '').length < 4) {
        service.dfpNetworkId = gsnApi.getDfpNetworkId().replace(/\/$/gi, '');
      }
      
      service.shopperWelcomeInProgress = true;
      
      $.gsnSw2({
        chainId: gsnApi.getChainId(),
        dfpID: service.dfpNetworkId,
        //displayWhenExists: '.gsnunit',  
        displayWhenExists: '.gsnadunit,.gsnunit',
        enableSingleRequest: false,
        apiUrl: gsnApi.getApiUrl() + '/ShopperWelcome/GetShopperWelcome/',
        onClose: function (evt) {
          
          service.hasDisplayedShopperWelcome = true;
          service.shopperWelcomeInProgress = false;
          service.targeting.brand = Gsn.Advertising.getBrand();
          if (!service.targeting.brand) {
            delete service.targeting.brand;
          }
          
          doRefreshInternal(refreshCircPlus, timeout);
        }
      });
    }

    // campaign refresh
    function doCampaignRefresh()
    {
      $sessionStorage.GsnCampaign = gsnApi.getProfileId();

      // try to get campaign
      gsnProfile.getCampaign().then(function (rst) {
        if (rst.success) {
          service.targeting.dept.length = 0;
          angular.forEach(rst.response, function (v, k) {
            service.targeting.dept.push(v.Value);
          });
        }

        // allow for another fresh
        service.lastRefreshTime = null;

        // cause another refresh
        doRefresh();
      });
    }
    
    // adpods refresh
    function doRefreshAdPods() {
      var targeting = angular.copy(service.targeting);
      var kw = ('/' + gsnApi.isNull(service.currentPath, '')).replace(/\/+$/gi, '').substr(service.currentPath.lastIndexOf('/'));
      targeting.dept = gsnApi.isNull(targeting.dept, []);
      targeting.kw = kw.replace(/[^a-z]/gi, '');
      
      angular.element.gsnDfp({
        dfpID: service.dfpNetworkId,
        setTargeting: targeting,
        inViewOnly: true,
        enableSingleRequest: false,    // *IMPORTANT* false is needed for SPA - otherwise you'll get empty ads
        refreshExisting: service.refreshExistingRegular
      });

      service.refreshExistingRegular = true;
    }
    
    // circplus refresh
    function doRefreshCircPlus() {
      // only refresh if circplus is enabled
      if (!service.enableCircPlus) return;
      var depts = gsnApi.isNull(service.targeting.dept, []);
      if (depts.length <= 0) {
        depts = ['produce'];
      }
      
      angular.element.circPlus({
        dfpID: service.dfpNetworkId,
        inViewOnly: true,
        setTargeting: { dept: depts[0] },
        // enableSingleRequest: true,  dont set this value, please leave it as true by default
        refreshExisting: service.refreshExistingCircPlus,
        bodyTemplate: service.circPlusBody
      });

      service.refreshExistingCircPlus = true;
    }

    //#region Internal Methods        
    function getAdDepts(items) {
      var result = [];
      var categories = gsnStore.getCategories();
      var u = {};

      angular.forEach(items, function (item, idx) {
        if (gsnApi.isNull(item.CategoryId, null) === null) return;
        
        if (categories[item.CategoryId]) {
          var newKw = gsnApi.cleanKeyword(categories[item.CategoryId].CategoryName);
          if (u.hasOwnProperty(newKw)) {
            return;
          }
          result.push(newKw);
          u[newKw] = 1;
        }
      });
      return result;
    }
    //#endregion
  }
})(angular);

(function (angular, undefined) {
  'use strict';
  var serviceId = 'gsnList';
  angular.module('gsn.core').factory(serviceId, ['$rootScope', '$http', 'gsnApi', '$q', gsnList]);

  function gsnList($rootScope, $http, gsnApi, $q) {

    // just a shopping list object
    function myShoppingList(shoppingListId, shoppingList) {
      var returnObj = { ShoppingListId: shoppingListId, itemIdentity: 1 };
      var $mySavedData = { list: shoppingList, items: {}, hasLoaded: false, countCache: 0 };

      returnObj.getItemKey = function (item) {
        var itemKey = item.ItemTypeId;
        if (item.ItemTypeId == 7 || item.AdCode) {
          itemKey = item.AdCode + gsnApi.isNull(item.BrandName, '') + gsnApi.isNull(item.Description, '');
        }
        
        return itemKey + '_' + item.ItemId;
      };

      // replace local item with server item
      function processServerItem(serverItem, localItem) {
        if (serverItem) {
          var itemKey = returnObj.getItemKey(localItem);
          delete $mySavedData.items[itemKey];
          
          // set new server item order
          serverItem.Order = localItem.Order;

          // Add the new server item.
          $mySavedData.items[returnObj.getItemKey(serverItem)] = serverItem;

          // Since we are chainging the saved data, the count is suspect.
          $mySavedData.countCache = 0;
        }
      }

      returnObj.syncItem = function (itemToSync) {
        var existingItem = returnObj.getItem(itemToSync.ItemId, itemToSync.ItemTypeId) || itemToSync;
        if (existingItem != itemToSync) {
          existingItem.Quantity = itemToSync.Quantity;
        }

        if (parseInt(existingItem.Quantity) > 0) {
          // build new item to make sure posting of only required fields
          var itemToPost = angular.copy(existingItem);

          /* jshint -W069 */
          delete itemToPost['BarcodeImageUrl'];
          delete itemToPost['BottomTagLine'];
          delete itemToPost['Description1'];
          delete itemToPost['Description2'];
          delete itemToPost['Description3'];
          delete itemToPost['Description4'];
          delete itemToPost['EndDate'];
          delete itemToPost['ImageUrl'];
          delete itemToPost['SmallImageUrl'];
          delete itemToPost['StartDate'];
          delete itemToPost['TopTagLine'];
          delete itemToPost['TotalDownloads'];
          delete itemToPost['TotalDownloadsAllowed'];
          delete itemToPost['Varieties'];
          /* jshint +W069 */

          $rootScope.$broadcast('gsnevent:shoppinglistitem-updating', returnObj, existingItem, $mySavedData);

          gsnApi.getAccessToken().then(function () {

            var url = gsnApi.getShoppingListApiUrl() + '/UpdateItem/' + returnObj.ShoppingListId;
            var hPayload = gsnApi.getApiHeaders();
            hPayload.shopping_list_id = returnObj.ShoppingListId;
            $http.post(url, itemToPost, { headers: hPayload }).success(function (response) {
              if (response.Id) {
                processServerItem(response, existingItem);
              }
              
              $rootScope.$broadcast('gsnevent:shoppinglist-changed', returnObj);
            }).error(function () {
              // reset to previous quantity on failure
              if (existingItem.OldQuantity) {
                existingItem.NewQuantity = existingItem.OldQuantity;
                existingItem.Quantity = existingItem.OldQuantity;
              }
            });
          });
        } else {
          returnObj.removeItem(existingItem);
        }

        $rootScope.$broadcast('gsnevent:shoppinglist-changed', returnObj);
      };

      // add item to list
      returnObj.addItem = function (item, deferSync) {
        if (gsnApi.isNull(item.ItemId, 0) <= 0) {

          // this is to help with getItemKey?
          item.ItemId = (returnObj.itemIdentity++);
        }
        
        $mySavedData.countCache = 0;
        var existingItem = $mySavedData.items[returnObj.getItemKey(item)];

        if (gsn.isNull(existingItem, null) === null) {
          // remove any ties to existing shopping list
          delete item.Id;
          delete item.ShoppingListItemId;
          item.ShoppingListId = returnObj.ShoppingListId;

          existingItem = item;
          $mySavedData.items[returnObj.getItemKey(existingItem)] = existingItem;

        }
        else { // update existing item

          var newQuantity = gsnApi.isNaN(parseInt(item.Quantity), 1);
          var existingQuantity = gsnApi.isNaN(parseInt(existingItem.Quantity), 1);
          if (newQuantity > existingQuantity) {
            existingItem.Quantity = newQuantity;
          } else {
            existingItem.Quantity = existingQuantity + newQuantity;
          }
        }

        if (existingItem.IsCoupon) {

          // Get the temp quantity.
          var tmpQuantity = gsnApi.isNaN(parseInt(existingItem.Quantity), 0);

          // Now, assign the quantity.
          existingItem.Quantity = (tmpQuantity > 0) ? tmpQuantity : 1;
        }

        existingItem.Order = (returnObj.itemIdentity++);

        if (!gsnApi.isNull(deferSync, false)) {
          returnObj.syncItem(existingItem);
        }

        return existingItem;
      };

      returnObj.addItems = function (items) {
        var deferred = $q.defer();
        var toAdd = [];
        angular.forEach(items, function (v, k) {
          var rst = angular.copy(returnObj.addItem(v, true));
          toAdd.push(rst);
        });

        $rootScope.$broadcast('gsnevent:shoppinglistitems-updating', returnObj);

        $mySavedData.countCache = 0;
        gsnApi.getAccessToken().then(function () {

          var url = gsnApi.getShoppingListApiUrl() + '/SaveItems/' + returnObj.ShoppingListId;
          var hPayload = gsnApi.getApiHeaders();
          hPayload.shopping_list_id = returnObj.ShoppingListId;
          $http.post(url, toAdd, { headers: hPayload }).success(function (response) {
            $rootScope.$broadcast('gsnevent:shoppinglist-changed', returnObj);
            deferred.resolve({ success: true, response: response });
          }).error(function () {
            deferred.resolve({ success: false, response: response });
          });
        });

        return deferred.promise;
      };

      // remove item from list
      returnObj.removeItem = function (inputItem, deferRemove) {
        var item = returnObj.getItem(inputItem);
        if (item) {
          item.Quantity = 0;
          delete $mySavedData.items[returnObj.getItemKey(item)];

          if (deferRemove) return returnObj;

          $mySavedData.countCache = 0;
          gsnApi.getAccessToken().then(function () {
            $rootScope.$broadcast('gsnevent:shoppinglist-item-removing', returnObj, item);

            var url = gsnApi.getShoppingListApiUrl() + '/DeleteItems/' + returnObj.ShoppingListId;
            var hPayload = gsnApi.getApiHeaders();
            hPayload.shopping_list_id = returnObj.ShoppingListId;
            $http.post(url, [item.Id || item.ItemId], { headers: hPayload }).success(function (response) {
              $rootScope.$broadcast('gsnevent:shoppinglist-changed', returnObj);
            });
          });
        }

        return returnObj;
      };

      returnObj.removeItems = function (itemList) {
        var deferred = $q.defer();
        var toRemove = [];

        $mySavedData.countCache = 0;
        angular.forEach(itemList, function (v, k) {
          var key = returnObj.getItemKey(item);
          var listItem = returnObj.getItem(key);
          if (listItem) {
            toRemove.push(v.Id);
            item.Quantity = 0;
            delete $mySavedData.items[key];
          }
        });

        gsnApi.getAccessToken().then(function () {
          $rootScope.$broadcast('gsnevent:shoppinglist-items-removing', returnObj, item);

          var url = gsnApi.getShoppingListApiUrl() + '/DeleteItems/' + returnObj.ShoppingListId;
          var hPayload = gsnApi.getApiHeaders();
          hPayload.shopping_list_id = returnObj.ShoppingListId;
          $http.post(url, toRemove, { headers: hPayload }).success(function (response) {
            $rootScope.$broadcast('gsnevent:shoppinglist-changed', returnObj);
            deferred.resolve({ success: true, response: response });
          }).error(function (response) {
            deferred.resolve({ success: false, response: response });
          });
        });

        return deferred.promise;
      };

      // get item by object or id
      returnObj.getItem = function (itemId, itemTypeId) {
        // just return whatever found, no need to validate item
        // it's up to the user to call isValidItem to validate
        var adCode, brandName, myDescription;
        if (typeof (itemId) == "object") {
          adCode = itemId.AdCode;
          brandName = itemId.BrandName;
          myDescription = itemId.Description;
          itemTypeId = itemId.ItemTypeId;
          itemId = itemId.ItemId;
        }
        
        var myItemKey = returnObj.getItemKey({ ItemId: itemId, ItemTypeId: gsnApi.isNull(itemTypeId, 8), AdCode: adCode, BrandName: brandName, Description: myDescription });
        return $mySavedData.items[myItemKey];
      };

      returnObj.isValidItem = function (item) {
        var itemType = typeof (item);

        if (itemType !== 'undefined' && itemType !== 'function') {
          return (item.Quantity > 0);
        }

        return false;
      };

      // return all items
      returnObj.allItems = function () {
        var result = [];
        var items = $mySavedData.items;
        angular.forEach(items, function (item, index) {
          if (returnObj.isValidItem(item)) {
            result.push(item);
          }
        });

        return result;
      };

      // get count of items
      returnObj.getCount = function () {
        if ($mySavedData.countCache > 0) return $mySavedData.countCache;
        
        var count = 0;
        var items = $mySavedData.items;
        angular.forEach(items, function(item, index) {
          if (returnObj.isValidItem(item)) {
            count += gsnApi.isNaN(parseInt(item.Quantity), 0);
          }
        });
        
        $mySavedData.countCache = count;
        return count;
      };

      // clear items
      returnObj.clearItems = function () {
        // clear the items
        $mySavedData.items = {};

        $mySavedData.countCache = 0;
        returnObj.saveChanges();
      };

      returnObj.getTitle = function () {
        return ($mySavedData.list) ? $mySavedData.list.Title : '';
      };

      returnObj.getStatus = function () {
        return ($mySavedData.list) ? $mySavedData.list.StatusId : 1;
      };

      // cause shopping list delete
      returnObj.deleteList = function () {
        // call DeleteShoppingList          

        $mySavedData.countCache = 0;
        gsnApi.getAccessToken().then(function () {

          var url = gsnApi.getShoppingListApiUrl() + '/Delete/' + returnObj.ShoppingListId;
          var hPayload = gsnApi.getApiHeaders();
          hPayload.shopping_list_id = returnObj.ShoppingListId;
          $http.post(url, {}, { headers: hPayload }).success(function (response) {
            // do nothing                      
            $rootScope.$broadcast('gsnevent:shoppinglist-deleted', returnObj);
          });
        });

        return returnObj;
      };

      // save changes
      returnObj.saveChanges = function () {
        if (returnObj.savingDeferred) return returnObj.savingDeferred.promise;
        var deferred = $q.defer();
        returnObj.savingDeferred = deferred;

        $mySavedData.countCache = 0;
        var syncitems = [];

        // since we immediately update item with server as it get added to list
        // all we need is to send back the item id to tell server item still on list
        // this is also how we mass delete items
        var items = returnObj.allItems();
        angular.forEach(items, function (item) {
          syncitems.push(item.ItemId);
        });

        gsnApi.getAccessToken().then(function () {

          var url = gsnApi.getShoppingListApiUrl() + '/DeleteOtherItems/' + returnObj.ShoppingListId;
          var hPayload = gsnApi.getApiHeaders();
          hPayload.shopping_list_id = returnObj.ShoppingListId;
          $http.post(url, syncitems, { headers: hPayload }).success(function (response) {
            deferred.resolve({ success: true, response: returnObj });
            returnObj.savingDeferred = null;

            $rootScope.$broadcast('gsnevent:shoppinglist-changed', returnObj);
          }).error(function (response) {
            deferred.resolve({ success: false, response: response });
            returnObj.savingDeferred = null;
          });
        });

        return deferred.promise;
      };

      // cause change to shopping list title
      returnObj.setTitle = function (title) {
        var deferred = $q.defer();

        $mySavedData.countCache = 0;
        gsnApi.getAccessToken().then(function () {

          var url = gsnApi.getShoppingListApiUrl() + '/Update/' + returnObj.ShoppingListId + '?title=' + encodeURIComponent(title);
          var hPayload = gsnApi.getApiHeaders();
          hPayload.shopping_list_id = returnObj.ShoppingListId;
          $http.post(url, {}, { headers: hPayload }).success(function (response) {
            deferred.resolve({ success: true, response: returnObj });
            $mySavedData.list.Title = title;

            // Send these two broadcast messages.
            $rootScope.$broadcast('gsnevent:shopping-list-saved');
            $rootScope.$broadcast('gsnevent:shoppinglist-changed', returnObj);
          }).error(function (response) {
            console.log(returnObj.ShoppingListId + ' setTitle error: ' + response);
            deferred.resolve({ success: false, response: response });
          });
        });

        return deferred.promise;
      };

      returnObj.hasLoaded = function () {
        return $mySavedData.hasLoaded;
      };

      returnObj.getListData = function() {
        return angular.copy($mySavedData.list);
      };

      function processShoppingList(result) {
        $mySavedData.items = {};

        angular.forEach(result, function (item, index) {
          item.Order = index;
          $mySavedData.items[returnObj.getItemKey(item)] = item;
        });

        $mySavedData.hasLoaded = true;
        returnObj.itemIdentity = result.length + 1;
        $rootScope.$broadcast('gsnevent:shoppinglist-loaded', returnObj, result);
      }

      returnObj.updateShoppingList = function (savedData) {
        if (returnObj.deferred) return returnObj.deferred.promise;

        var deferred = $q.defer();
        returnObj.deferred = deferred;
        $mySavedData.items = {};
        
        $mySavedData.countCache = 0;
        if (returnObj.ShoppingListId > 0) {
          if (savedData) {
            processShoppingList(savedData);
            $rootScope.$broadcast('gsnevent:shoppinglist-loaded', returnObj, savedData);
            deferred.resolve({ success: true, response: returnObj });
            returnObj.deferred = null;
          } else {


            gsnApi.getAccessToken().then(function () {
              // call GetShoppingList(int shoppinglistid, int profileid)
              var url = gsnApi.getShoppingListApiUrl() + '/ItemsBy/' + returnObj.ShoppingListId + '?nocache=' + (new Date()).getTime();

              var hPayload = gsnApi.getApiHeaders();
              hPayload.shopping_list_id = returnObj.ShoppingListId;
              $http.get(url, { headers: hPayload }).success(function (response) {
                processShoppingList(response);
                deferred.resolve({ success: true, response: returnObj });
                returnObj.deferred = null;
              }).error(function (response) {
                $rootScope.$broadcast('gsnevent:shoppinglist-loadfail', response);
                deferred.resolve({ success: false, response: response });
                returnObj.deferred = null;
              });
            });
          }
        }

        return returnObj.deferred.promise;
      };

      return returnObj;
    }

    return myShoppingList;
  }
})(angular);
// collection of misc service and factory
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  // $notication
  myModule.service('$notification', ['$rootScope', '$window', function ($rootScope, $window) {
    var service = {
      alert: function (message) {
        if (!$window.isPhoneGap) {
          $window.alert(message);
          return;
        }

        navigator.notification.alert(message, null, '', 'OK');
      },
      confirm: function (message, callbackFn, title, buttonLabels) {
        if (gsn.isNull(buttonLabels, null) === null) {
          buttonLabels = 'OK,Cancel';
        }

        if (!$window.isPhoneGap) {
          callbackFn($window.confirm(message) ? 1 : 2);
          return;
        }

        navigator.notification.confirm(
                message,       // message
                callbackFn,    // callback to invoke with index of button pressed
                title,         // title
                buttonLabels.split(',')   // buttonLabels
            );
      },
      prompt: function (message, callbackFn, title, defaultText, buttonLabels) {
        if (gsn.isNull(buttonLabels, null) === null) {
          buttonLabels = 'OK,Cancel';
        }
        if (gsn.isNull(defaultText, null) === null) {
          defaultText = '';
        }

        if (!$window.isPhoneGap) {
          var answer = $window.prompt(message, defaultText);
          callbackFn({
            buttonIndex: (answer ? 1 : 2),
            input1: answer
          });
          return;
        }

        navigator.notification.prompt(
           message,        // message
           callbackFn,     // callback to invoke
           title,          // title
           buttonLabels.split(','),
           defaultText
       );
      }
    };

    return service;

    //#region Internal Methods        

    //#endregion
  }]);

  // FeedService: google feed
  myModule.factory('FeedService', ['$http', 'gsnApi', function ($http, gsnApi) {
    return {
      parseFeed: function (url, maxResult) {
        return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=' + gsnApi.isNull(maxResult, 50) + '&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
      }
    };
  }]);

  // gsnAuthenticationHandler to handle expired refresh token
  myModule.factory('gsnAuthenticationHandler', ['$rootScope', '$q', function ($rootScope, $q) {
    var service = {
      responseError: function (response, code) {
        // intercept 401
        if (response.status == 401) {
          $rootScope.$broadcast('gsnevent:auth-expired', arguments);
        } else if (response.status == 400) {
          if (response.data && typeof response.data == 'string') {
            if ((response.data.indexOf('refresh_token is invalid or has expired') > -1) || (response.data.indexOf('Illegal attempt to refresh an anonymous token for user that is no longer anonymous.') > -1)) {
              $rootScope.$broadcast('gsnevent:auth-invalidrefresh', arguments);
            }
          }
        }

        // do something on error
        return $q.reject(response);
      }
    };

    return service;
    //#region Internal Methods        

    //#endregion
  }]);

  myModule.directive('bsDisplayMode', ['$window', '$timeout', function ($window, $timeout) {
    return {
      template: '<div class="visible-xs"></div><div class="visible-sm"></div><div class="visible-md"></div><div class="visible-lg"></div>',
      restrict: 'EA',
      replace: false,
      link: function (scope, elem, attrs) {
        var markers = elem.find('div');

        function update() {
          angular.forEach(markers, function (element) {
            if (angular.element(element).is(":visible")) {
              scope[attrs.bsDisplayMode] = element.className;
            }
          });
        }

        angular.element($window).bind('resize', function () {
          // use timeout to overcome scope apply
          $timeout(update, 300);
        });

        update();
      }
    };
  }]);

  myModule.directive('ngScrollTop', ['$window', '$timeout', function ($window, $timeout) {
    var directive = {
      link: link,
      restrict: 'A',
    };
    //If more than 1 scrollTop on page - disable show/hide of element
    var countScrollTop = 0;
    
    return directive;
    
    function link(scope, element, attrs) {
      countScrollTop++;
      var scrollTop = parseInt(angular.element($window).scrollTop());
      scope[attrs.ngScrollTop] = scrollTop;
      
      angular.element($window).on('scroll', function () {
        $timeout(function () {
          //Else use timeout to overcome scope apply
          scrollTop = parseInt(angular.element($window).scrollTop());
          scope[attrs.ngScrollTop] = scrollTop;

          element.css({ 'display': ((scrollTop > parseInt(attrs.offset)) && countScrollTop == 1) ? 'block' : '' });
        }, 300);
      });

      element.on('click', function () {
        angular.element($window).scrollTop(0);
      });
      
      scope.$on('$destroy', function() {
         countScrollTop--;
      });
    }
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var serviceId = 'gsnPrinter';
  angular.module('gsn.core').factory(serviceId, ['$rootScope', '$timeout', '$http', 'gsnApi', '$notification', '$window', '$log', '$analytics', 'gsnProfile', gsnPrinter]);

  function gsnPrinter($rootScope, $timeout, $http, gsnApi, $notification, $window, $log, $analytics, gsnProfile) {
    // Usage: Printing and CouponsInc integration service 
    //    allow for wrapping dangerous and stupid couponsinc global method outside of framework
    //    to improve framework unit testing
    //
    // Summary: 
    //
    // Creates: 2013-12-28 TomN
    // 

    var service = {
      initPrinter: initPrinter,
      printerCode: 0,
      hasInit: false,
      printed: false,
      printNow: false,
      coupons: [],
      callBack: null,
      checkStatus: false,
    };

    // overriding existing function
    $window.showResultOfDetectControl = function (code) {
      if (service.printed) return;
      var codeNum = gsnApi.isNaN(parseFloat(code), 0);

      if (codeNum > 0) {
        service.printerCode = codeNum;
        doPrint();
      } else {
        service.hasInit = false;
        if (service.printed) return;

        var sBlockedMessage = 'It\'s possible that the CI coupon printer installed plugin has been disabled.  Please make sure to enable CI coupon printer browser plugin.';
        if (code == 'BLOCKED') {
          if (service.callBack && service.callBack.blocked)
            service.callBack.blocked();
          else
            $notification.alert(sBlockedMessage);
          return;
        } else if (code == 'ERROR') {

          sBlockedMessage = 'The CI coupon printer has thrown an error that cannot be recovered.  You may need to uninstall and reinstall the CI coupon printer to fix this issue.';
          $notification.alert(sBlockedMessage);
        }
        else {
          // cause download to printer   
          
          if (typeof (ci_downloadFFSilent) === 'function') {
            if (service.printed) return;

            if (service.callBack && service.callBack.notInstalled)
              service.callBack.notInstalled(ci_downloadFFSilent);
            else
              $timeout(ci_downloadFFSilent, 5);
          }
        }

        // show coupon printer download instruction event
        $rootScope.$broadcast('gsnevent:printerdownload-instruction', service);
      }
    };
    
    return service;

    function createCouponsIntHtml() {
      var idDiv = angular.element('#ci_div1');
      if (idDiv.length <= 0) {
        var els = angular.element('<div id="ci_div1"></div><div id="ci_div2"></div><iframe src="about:blank" id="pmgr" width="1" height="1" style="visibility: hidden"></iframe>');
        var body = angular.element('body');
        angular.forEach(els, function (el) {
          body[0].appendChild(el);
        });
      }
    }
    
    function doPrint() {
      // make sure printing is on the UI thread
      $timeout(doPrintInternal, 50);
    }
    
    function doPrintInternal() {

      // do not proceed if there is no coupon to print
      if (service.coupons <= 0) return;

      // setup error message
      var sErrorMessage = 'Your coupon(s) were unavailable for printing. You may have already printed this coupon the maximum number of times.';
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getShoppingListApiUrl() + '/CouponPrintScript/' + gsnApi.getChainId() + '?nocache=' + (new Date()).getTime();
        var couponIds = [];
        var couponidz = '';
        var couponClasses = [];
        angular.forEach(service.coupons, function (v, k) {
          couponIds.push(v.ProductCode);
          couponidz += ',' + v.ProductCode;
          couponClasses.push('.coupon-message-' + v.ProductCode);
        });

        var couponElements = angular.element(couponClasses.join(','));
        if (service.printed) return;
        service.printed = true;

        $http.post(url, { Coupons: couponIds, DeviceId: service.printerCode }, { headers: gsnApi.getApiHeaders() })
            .success(function (response) {
              if (response.Success) {

                if (couponElements.length <= 0) return;
                
                $timeout(function () {
                  if (!service.checkStatus)
                    couponElements.html('Printing...');
                  
                  var printErrorIds = '';
                  // process coupon error message
                  var errors = gsnApi.isNull(response.ErrorCoupons, []);
                  if (errors.length > 0) {
                    angular.forEach(errors, function (item) {
                      angular.element('.coupon-message-' + item.CouponId).html(item.ErrorMessage);
                      printErrorIds += ',' + item.CouponId;
                    });

                    $rootScope.$broadcast('gsnevent:couponprinting-error', errors);
                  }

                  if (service.callBack && service.callBack.failedCoupons)
                    service.callBack.failedCoupons(errors);

                  if (service.checkStatus)
                    return;
                  
                  if (service.callBack && service.callBack.readyAlert) {
                    service.callBack.readyAlert(service.coupons.length - errors.length, function () { startPrint(errors, couponElements, response); });
                  } else {
                    // somehow, we need this alert.  I think coupons inc need time to sync.
                    sErrorMessage = 'Click "OK" to print your manufacturer coupon(s).';
                    if (service.printNow) {
                      sErrorMessage += '  Use the "Print" button to print your List.';
                    }
                    if (service)
                      $notification.confirm(sErrorMessage, function(result) {
                        if (result == 1) {
                          startPrint(errors, couponElements, response);
                        }
                      });
                  }
                }, 50);
              } else {
                $timeout(function() {
                  $notification.alert(sErrorMessage);
                }, 50);
              }
            }).error(function (response) {
              $timeout(function() {
                couponElements.html('Print Limit Reached');
                $notification.alert(sErrorMessage);
              }, 50);
            });
      });
    }
    
    function startPrint(errors, couponElements, response) {
      angular.forEach(service.coupons, function (v) {
        gsnProfile.addPrinted(v.ProductCode);
      });
      if (service.callBack && service.callBack.result) {
        var failed = errors.length;
        var printed = service.coupons.length - errors.length;
        service.callBack.result(printed, failed);
      }
      printCoupons(response.DeviceId, response.Token);
    }

    function initPrinter(coupons, printNow, callBack, checkStatus) {
      createCouponsIntHtml();
      service.coupons = gsnApi.isNull(coupons, []);
      service.checkStatus = checkStatus;
      service.printNow = printNow;
      service.callBack = callBack;
      var couponClasses = [];
      angular.forEach(service.coupons, function (v, k) {
        couponClasses.push('.coupon-message-' + v.ProductCode);
      });
      if (!service.callBack)
        $timeout(function () {
          angular.element(couponClasses.join(',')).html('Checking...');
        }, 5);
      
      // if the printer already been initialized, then just print
      if (gsnApi.isNaN(parseInt(service.printerCode), 0) > 0) {
        service.printed = false;
        // this should be on the UI thread
        doPrint();
      } else {

        if (service.hasInit) return;
        service.hasInit = true;
        
        var scriptUrl = gsnApi.getApiUrl() + '/ShoppingList/CouponInitScriptFromBrowser/' + gsnApi.getChainId() + '?callbackFunc=showResultOfDetectControl&nocache=' + gsnApi.getVersion();
        gsnApi.loadScripts([scriptUrl], function () {
           // no need to do anything, the server-side script can execute on its own.
        });
      }
    }

    //#region Internal Methods        
    function printCoupons(pid, strToken) {
      /// <summary>
      ///     Actual method fo printing coupon.
      ///     - the token determine which coupon we sent to couponsinc
      ///     - it load an iframe that will trigger the printer plugin
      /// </summary>
      /// <param name="Pid" type="Object"></param>
      /// <param name="strToken" type="Object"></param>

      if (gsnApi.isNull(strToken, '').length > 0) {
        var strUrl = 'http://insight.coupons.com/cos20/printmanager.aspx';
        strUrl += '?PID=' + pid;
        strUrl += '&PrintCartToken=' + encodeURIComponent(strToken);
        strUrl += '&PostBackURL=' + encodeURIComponent('http://insight.coupons.com/cos20/ThankYou.aspx');
        
        var pframe = angular.element("#pmgr");
        if (pframe.length > 0) {
          pframe.attr("src", strUrl);
        }
        else {
          $log.warn('Frame does not exist');
        }
      }
    }
    //#endregion
  }
})(angular);

(function (angular, undefined) {
  'use strict';
  var serviceId = 'gsnProfile';
  angular.module('gsn.core').service(serviceId, ['$rootScope', '$http', 'gsnApi', '$q', 'gsnList', 'gsnStore', '$location', '$timeout', '$sessionStorage','$localStorage', 'gsnRoundyProfile', gsnProfile]);

  function gsnProfile($rootScope, $http, gsnApi, $q, gsnList, gsnStore, $location, $timeout, $sessionStorage, $localStorage, gsnRoundyProfile) {
    var returnObj = {},
        previousProfileId = gsnApi.getProfileId(),
        $profileDefer = null,
        $creatingDefer = null;
    var $savedData = { allShoppingLists: {}, profile: null, profileData: { scoredProducts: {}, circularItems: {}, availableCoupons: {}, myPantry: {} } };

    returnObj.getShoppingListId = gsnApi.getShoppingListId;

    returnObj.getProfileId = gsnApi.getProfileId;

    returnObj.createNewShoppingList = function () {
      /// <summary>Create a new shopping list.</summary>

      if ($creatingDefer) return $creatingDefer.promise;

      $creatingDefer = $q.defer();

      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getShoppingListApiUrl() + '/Create/' + gsnApi.getProfileId();
        $http.post(url, {}, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          var result = response;
          $savedData.allShoppingLists[result.Id] = gsnList(result.Id, result);
          gsnApi.setShoppingListId(result.Id);
          $rootScope.$broadcast('gsnevent:shoppinglist-created', $savedData.allShoppingLists[result.Id]);
          $creatingDefer.resolve({ success: true, response: $savedData.allShoppingLists[result.Id] });
          $creatingDefer = null;
        }).error(function (response) {
          $creatingDefer.resolve({ success: false, response: response });
          $creatingDefer = null;
        });
      });

      return $creatingDefer.promise;
    };

    returnObj.login = function (user, pass) {
      var payload = {
        grant_type: "password",
        client_id: gsnApi.getChainId(),
        access_type: 'offline',
        username: user,
        password: pass
      };

      gsnApi.doAuthenticate(payload);
    };

    returnObj.loginFacebook = function (user, facebookToken) {
      var payload = {
        grant_type: "facebook",
        client_id: gsnApi.getChainId(),
        access_type: 'offline',
        username: user,
        password: facebookToken
      };

      gsnApi.doAuthenticate(payload);
    };

    // when initialize
    // if no profile id, it should create a shopping list to get a new profile id and set to current
    returnObj.initialize = function () {
      // get profile
      var profileId = parseInt(gsnApi.isNull(returnObj.getProfileId(), 0));
      if (profileId > 0) {
        returnObj.getProfile(true);
      }

      gsnStore.initialize();
    };

    // when user log out
    // it should reset shopping list
    returnObj.logOut = function () {
      gsnApi.logOut();
      $localStorage.clipped = [];
      $localStorage.printed = [];
      $localStorage.preClipped = {};
    };

    // proxy method to add item to current shopping list
    returnObj.addItem = function (item) {
      var shoppingList = returnObj.getShoppingList();
      if (shoppingList) {
        if (gsnApi.isNull(item.ItemTypeId, 0) <= 0) {
          item.ItemTypeId = 6;   // Misc or Own Item type
        }

        shoppingList.addItem(item);
      }
    };

    // proxy method to add items to current shopping list
    returnObj.addItems = function (item) {
      var shoppingList = returnObj.getShoppingList();

      // TODO: throw error for no current shopping list?
      return shoppingList.addItems(item);
    };

    returnObj.isOnList = function (item) {
      var shoppingList = returnObj.getShoppingList();
      if (shoppingList) {
        var slItem = shoppingList.getItem(item.ItemId, item.ItemTypeId);
        return gsnApi.isNull(slItem, null) !== null;
      }

      return false;
    };

    // proxy method to remove item of current shopping list
    returnObj.removeItem = function (item) {
      var shoppingList = returnObj.getShoppingList();
      if (shoppingList) {
        shoppingList.removeItem(item);
      }
    };

    // delete shopping list provided id
    returnObj.deleteShoppingList = function (list) {
      list.deleteList();
      delete $savedData.allShoppingLists[list.ShoppingListId];
    };

    // get shopping list provided id
    returnObj.getShoppingList = function (shoppingListId) {
      if (gsnApi.isNull(shoppingListId, null) === null) shoppingListId = returnObj.getShoppingListId();

      var result = $savedData.allShoppingLists[shoppingListId];
      return result;
    };

    // get all shopping lists
    returnObj.getShoppingLists = function () {
      var result = [];
      angular.forEach($savedData.allShoppingLists, function (v, k) {
        result.push(v);
      });

      gsnApi.sortOn(result, 'ShoppingListId');
      result.reverse();
      return result;
    };

    // get count of current shopping list
    returnObj.getShoppingListCount = function () {
      var list = returnObj.getShoppingList();
      return list ? list.getCount() : 0;
    };

    // get the profile object
    returnObj.getProfile = function (callApi) {
      if ($profileDefer) return $profileDefer.promise;

      $profileDefer = $q.defer();
      if (gsnApi.isNull($savedData.profile, null) === null || callApi) {
        // at this point, we already got the id so proceed to reset other data 
        $timeout(function () {
          // reset other data
          $savedData = { allShoppingLists: {}, profile: null, profileData: { scoredProducts: {}, circularItems: {}, availableCoupons: {}, myPantry: {} } };
          returnObj.refreshShoppingLists();
        }, 5);


        gsnApi.getAccessToken().then(function () {

          // don't need to load profile if anonymous
          if (gsnApi.isAnonymous()) {
            $savedData.profile = { "Id": returnObj.getProfileId(), "SiteId": gsnApi.getChainId(), "PrimaryStoreId": gsnApi.getSelectedStoreId() };

            $rootScope.$broadcast('gsnevent:profile-load-success', { success: true, response: $savedData.profile });
            $profileDefer.resolve({ success: true, response: $savedData.profile });
            $profileDefer = null;
          } else {
          
            // cause Roundy profile to load from another method
            if (gsnApi.getConfig().hasRoundyProfile) {
              gsnRoundyProfile.getProfile().then(function(rst) {
                if (rst.success) {
                  $savedData.profile = rst.response;
                  $rootScope.$broadcast('gsnevent:profile-load-success', { success: true, response: $savedData.profile });
                  $profileDefer.resolve(rst);
                  $profileDefer = null;
                }
                else {
                  gsnLoadProfile();
                }
              });
              
            } else {
              gsnLoadProfile();
            }
          }
        });

      } else {
        $timeout(function () {
          $profileDefer.resolve({ success: true, response: $savedData.profile });
          $profileDefer = null;
        }, 10);
      }

      return $profileDefer.promise;
    };

    function gsnLoadProfile() {
      var url = gsnApi.getProfileApiUrl() + "/By/" + returnObj.getProfileId();
      $http.get(url, { headers: gsnApi.getApiHeaders() }).success(function (response) {
        $savedData.profile = response;
        $rootScope.$broadcast('gsnevent:profile-load-success', { success: true, response: $savedData.profile });
        $profileDefer.resolve({ success: true, response: $savedData.profile });
        $profileDefer = null;
      }).error(function (response) {
        $rootScope.$broadcast('gsnevent:profile-load-failed', { success: false, response: response });
        $profileDefer.resolve({ success: false, response: response });
        $profileDefer = null;
      });
    }

    // when user register
    // it should convert anonymous profile to perm
    returnObj.registerProfile = function (p) {
      return registerOrUpdateProfile(p, false);
    };

    returnObj.changePassword = function (userName, currentPassword, newPassword) {
      var deferred = $q.defer();

      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getProfileApiUrl() + "/ChangePassword";
        $http.post(url, { UserName: userName, Password: currentPassword, NewPassword: newPassword }, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: (response == 'true'), response: response });
        }).error(function (response) {
          deferred.resolve({ success: false, response: response });
        });
      });

      return deferred.promise;
    };

    // when user recover password
    // it should call api and return server result 
    returnObj.recoverPassword = function (payload) {
      var deferred = $q.defer();

      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getProfileApiUrl() + '/RecoverPassword';
        $http.post(url, payload, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: (response == 'true'), response: response });
        }).error(function (response) {
          deferred.resolve({ success: false, response: response });
        });
      });

      return deferred.promise;
    };

    returnObj.recoverUsername = function (payload) {
      var deferred = $q.defer();

      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getProfileApiUrl() + '/RecoverUsername';
        $http.post(url, payload, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: (response == 'true'), response: response });
        }).error(function (response) {
          deferred.resolve({ success: false, response: response });
        });
      });

      return deferred.promise;
    };

    returnObj.unsubscribeEmail = function (email) {
      var deferred = $q.defer();

      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getProfileApiUrl() + '/Unsubscribe/?email=' + encodeURIComponent(email);
        $http.post(url, { email: email }, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          deferred.resolve({ success: false, response: response });
        });
      });

      return deferred.promise;
    };

    // when user update profile
    // it should restore user old password if none is provided
    returnObj.updateProfile = function (p) {
      return registerOrUpdateProfile(p, true);
    };

    // when user is a registered user
    // allow for shopping lists refresh
    returnObj.refreshShoppingLists = function () {
      if (returnObj.refreshingDeferred) return returnObj.refreshingDeferred.promise;

      // determine if logged in
      // sync list
      var deferred = $q.defer();
      returnObj.refreshingDeferred = deferred;
      $savedData.allShoppingLists = {};

      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getShoppingListApiUrl() + '/List/' + gsnApi.getProfileId();
        $http.get(url, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
              var list = response[i];
              list.ShoppingListId = list.Id;
              var shoppingList = gsnList(list.ShoppingListId, list);
              $savedData.allShoppingLists[list.ShoppingListId] = shoppingList;

              // grab the first shopping list and make it current list id
              if (i === 0) {
                // ajax load first shopping list
                shoppingList.updateShoppingList();

                gsnApi.setShoppingListId(list.ShoppingListId);
              }
            }
          } else {
            returnObj.createNewShoppingList();
          }

          returnObj.refreshingDeferred = null;

          $rootScope.$broadcast('gsnevent:shoppinglists-loaded', { success: true, response: response });
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {

          returnObj.refreshingDeferred = null;
          deferred.resolve({ success: false, response: response });
        });
      });

      return deferred.promise;
    };

    returnObj.getMyCircularItems = function () {
      var url = gsnApi.getProfileApiUrl() + '/GetCircularItems/' + gsnApi.getProfileId();
      return gsnApi.httpGetOrPostWithCache($savedData.profileData.circularItems, url);
    };

    returnObj.getMyPantry = function (departmentId, categoryId) {
      var url = gsnApi.getProfileApiUrl() + '/GetPantry/' + gsnApi.getProfileId() + '?' + 'departmentId=' + gsnApi.isNull(departmentId, '') + '&categoryId=' + gsnApi.isNull(categoryId, '');
      return gsnApi.httpGetOrPostWithCache($savedData.profileData.myPantry, url);
    };

    returnObj.getMyProducts = function () {
      var url = gsnApi.getProfileApiUrl() + '/GetScoredProducts/' + gsnApi.getProfileId();
      return gsnApi.httpGetOrPostWithCache($savedData.profileData.scoredProducts, url);
    };

    returnObj.getMyRecipes = function () {
      var url = gsnApi.getProfileApiUrl() + '/GetSavedRecipes/' + gsnApi.getProfileId();
      return gsnApi.httpGetOrPostWithCache({}, url);
    };

    returnObj.rateRecipe = function (recipeId, rating) {
      var url = gsnApi.getProfileApiUrl() + '/RateRecipe/' + recipeId + '/' + gsnApi.getProfileId() + '/' + rating;
      return gsnApi.httpGetOrPostWithCache({}, url, {});
    };

    returnObj.getMyRecipe = function (recipeId) {
      var url = gsnApi.getProfileApiUrl() + '/GetSavedRecipe/' + gsnApi.getProfileId() + '/' + recipeId;
      return gsnApi.httpGetOrPostWithCache({}, url);
    };

    returnObj.saveRecipe = function (recipeId, comment) {
      var url = gsnApi.getProfileApiUrl() + '/SaveRecipe/' + recipeId + '/' + gsnApi.getProfileId() + '?comment=' + encodeURIComponent(comment);
      return gsnApi.httpGetOrPostWithCache({}, url, {});
    };

    returnObj.saveProduct = function (productId, comment) {
      var url = gsnApi.getProfileApiUrl() + '/SaveProduct/' + productId + '/' + gsnApi.getProfileId() + '?comment=' + encodeURIComponent(comment);
      return gsnApi.httpGetOrPostWithCache({}, url, {});
    };

    returnObj.selectStore = function (storeId) {
      var url = gsnApi.getProfileApiUrl() + '/SelectStore/' + gsnApi.getProfileId() + '/' + storeId;
      return gsnApi.httpGetOrPostWithCache({}, url, {});
    };

    returnObj.getCampaign = function () {
      var url = gsnApi.getProfileApiUrl() + '/GetCampaign/' + gsnApi.getProfileId();
      return gsnApi.httpGetOrPostWithCache({}, url);
    };

    returnObj.resetCampaign = function () {
      $sessionStorage.GsnCampaign = 0;
    };

    returnObj.sendContactUs = function (payload) {
      var deferred = $q.defer();

      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getProfileApiUrl() + "/SendContactUs";

        $http.post(url, payload, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          deferred.resolve({ success: false, response: response });
        });
      });

      return deferred.promise;
    };

    returnObj.sendEmail = function (payload) {
      var deferred = $q.defer();

      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getProfileApiUrl() + "/SendEmail";

        $http.post(url, payload, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          deferred.resolve({ success: false, response: response });
        });
      });

      return deferred.promise;
    };

    returnObj.clipCoupon = function(productCode) {
      if (!$localStorage.clipped)
        $localStorage.clipped = [];
      if ($localStorage.clipped.indexOf(productCode) < 0)
        $localStorage.clipped.push(productCode);
    };

    returnObj.unclipCoupon = function(productCode) {
      var index = $localStorage.clipped.indexOf(productCode);
      $localStorage.clipped.splice(index, 1);
    };

    returnObj.getClippedCoupons = function() {
      return $localStorage.clipped;
    };

    returnObj.savePreclippedCoupon = function (item) {
      $localStorage.preClipped = item;
    };

    returnObj.getPreclippedCoupon = function() {
      return $localStorage.preClipped;
    };
    
    returnObj.addPrinted = function (productCode) {
      if (!$localStorage.printed)
        $localStorage.printed = [];
      if ($localStorage.printed.indexOf(productCode) < 0)
        $localStorage.printed.push(productCode);
    };

    returnObj.getPrintedCoupons = function () {
      return $localStorage.printed;
    };

    //#region Events Handling
    $rootScope.$on('gsnevent:shoppinglist-item-response', function (event, args) {
      var response = args[1],
          existingItem = args[2],
          mySavedData = args[3];

      // only process server response if logged in
      if (gsnApi.isLoggedIn()) {

        if (existingItem.ItemId != response.ItemId) {
          delete mySavedData.items[existingItem.ItemId];
          existingItem.ItemId = response.ItemId;
        }

        // retain order
        if (existingItem.zPriceMultiple) {
          response.PriceMultiple = existingItem.zPriceMultiple;
        }

        response.Order = existingItem.Order;
        mySavedData.items[existingItem.ItemId] = response.d;
      }
    });

    $rootScope.$on('gsnevent:profile-setid', function (event, profileId) {
      // attempt to load profile
      if (previousProfileId != profileId) {
        previousProfileId = profileId;
        returnObj.getProfile(true);
        returnObj.resetCampaign();
      }
    });

    $rootScope.$on('gsnevent:profile-load-success', function (event, result) {
      // attempt to set store id
      if (gsnApi.isNull(result.response.PrimaryStoreId, 0) > 0) {
        gsnApi.setSelectedStoreId(result.response.PrimaryStoreId);
      }
    });
    
    $rootScope.$on('gsnevent:store-setid', function (event, values) {
      if (values.newValue != values.oldValue) {
        // must check for null because it could be that user just
        // logged in and he/she would no longer have the anonymous shopping list
        var currentList = returnObj.getShoppingList();
        if (currentList) {
          currentList.updateShoppingList();
        }
      }
    });

    //#endregion

    //#region helper methods
    function registerOrUpdateProfile(profile, isUpdate) {
      /// <summary>Helper method for registering or update profile</summary>

      var deferred = $q.defer();

      // clean up model before proceeding
      // there should not be any space in email or username
      var email = gsnApi.isNull(profile.Email, '').replace(/\s+/gi, '');
      var username = gsnApi.isNull(profile.UserName, '').replace(/\s+/gi, '');
      if (username.length <= 0) {
        username = email;
      }

      // set empty to prevent update
      if (email.length <= 0) {
        email = null;
      }
      if (username.length <= 0) {
        username = null;
      }

      // setting up the payload, should we also add another level of validation here?
      var payload = {
        Email: email,
        UserName: username,
        Password: gsnApi.isNull(profile.Password, ''),
        ReceiveEmail: gsnApi.isNull(profile.ReceiveEmail, true),   
        ReceiveSms: gsnApi.isNull(profile.ReceiveSms, true),        
        Phone: gsnApi.isNull(profile.Phone, '').replace(/[^0-9]+/gi, ''),
        PrimaryStoreId: gsnApi.isNull(profile.PrimaryStoreId, gsnApi.getSelectedStoreId()),
        FirstName: gsnApi.isNull(profile.FirstName, '').replace(/[`]+/gi, '\''),
        LastName: gsnApi.isNull(profile.LastName, '').replace(/[`]+/gi, '\''),
        ExternalId: profile.ExternalId,
        WelcomeSubject: profile.WelcomeSubject,
        WelcomeMessage: profile.WelcomeMessage,
        FacebookUserId: profile.FacebookUserId,
        SiteId: gsnApi.getChainId(),
        Id: gsnApi.getProfileId()
      };

      // set empty to prevent update
      if (payload.Password === '') {
        payload.Password = null;
      }
      if (payload.LastName === '') {
        payload.LastName = null;
      }
      if (payload.FirstName === '') {
        payload.FirstName = null;
      }
      if (gsnApi.isNull(payload.PrimaryStoreId, 0) <= 0) {
        payload.PrimaryStoreId = null;
      }
      if (gsnApi.isNull(profile.ExternalId, '').length <= 0) {
        profile.ExternalId = null;
      }
      if (gsnApi.isNull(profile.FacebookUserId, '').length <= 0) {
        profile.FacebookUserId = null;
      }
      
      if (payload.UserName.length < 3) {
        deferred.resolve({ success: false, response: 'Email/UserName must be at least 3 characters.' });
        return deferred.promise;
      }
      
      if (!isUpdate && (gsnApi.isNull(profile.FacebookToken, '').length <= 0)) {
        if (gsnApi.isNull(payload.Password, '').length < 6) {
          deferred.resolve({ success: false, response: 'Password must be at least 6 characters.' });
          return deferred.promise;
        }
      }
      
      if (!gsnApi.getEmailRegEx().test(payload.Email)) {
        deferred.resolve({ success: false, response: 'Email is invalid.' });
        return deferred.promise;
      }

      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getProfileApiUrl() + (isUpdate ? "/Update" : "/Register");
        if (gsnApi.isNull(profile.FacebookToken, '').length > 1) {
          url += 'Facebook';
          payload.Password = profile.FacebookToken;
        }

        $http.post(url, payload, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          // set current profile to response
          $savedData.profile = response;
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {

          deferred.resolve({ success: false, response: response });
        });
      });

      return deferred.promise;
    }
    //#endregion

    return returnObj;
  }
})(angular);

(function (angular, undefined) {
  'use strict';
  var serviceId = 'gsnRoundyProfile';
  angular.module('gsn.core').service(serviceId, ['gsnApi', '$http', '$q', '$rootScope', '$timeout', gsnRoundyProfile]);

  function gsnRoundyProfile(gsnApi, $http, $q, $rootScope, $timeout) {

    var returnObj = {};

    returnObj.profile = {};
    returnObj.getProfileDefer = null;

    function init() {
      returnObj.profile = {
        Email: null,
        PrimaryStoreId: null,
        FirstName: null,
        LastName: null,
        Phone: null,
        AddressLine1: null,
        AddressLine2: null,
        City: null,
        State: null,
        PostalCode: null,
        FreshPerksCard: null,
        ReceiveEmail: false,
        Id: null,
        IsECard:false
      };
    }

    init();

    returnObj.saveProfile = function(profile) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getRoundyProfileUrl() + '/SaveProfile/' + gsnApi.getChainId();

        if (profile.PostalCode) {
          profile.PostalCode = profile.PostalCode.substr(0, 5);
        }
        $http.post(url, profile, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          errorBroadcast(response, deferred);
        });
      });
      return deferred.promise;
    };

    returnObj.validateLoyaltyCard = function (loyaltyCardNumber) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getRoundyProfileUrl() + '/ValidateLoyaltyCard/' + gsnApi.getChainId() + '/' + gsnApi.getProfileId() + '?loyaltyCardNumber=' + loyaltyCardNumber;
        $http.get(url, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          errorBroadcast(response, deferred);
        });
      });
      return deferred.promise;
    };

    returnObj.removeLoyaltyCard = function (profileId) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getRoundyProfileUrl() + '/RemoveLoyaltyCard/' + gsnApi.getChainId() + '/' + gsnApi.getProfileId();
        $http.get(url, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          errorBroadcast(response, deferred);
        });
      });
      return deferred.promise;
    };

    returnObj.getProfile = function (force) {
      var returnDefer;
      if (returnObj.profile.FirstName && !force) {
        returnDefer = $q.defer();
        $timeout(function () { returnDefer.resolve({ success: true, response: returnObj.profile }); }, 500);
      } else if (returnObj.getProfileDefer) {
        returnDefer = returnObj.getProfileDefer;
      } else {
        returnObj.getProfileDefer = $q.defer();
        returnDefer = returnObj.getProfileDefer;
        gsnApi.getAccessToken().then(function () {
          var url = gsnApi.getRoundyProfileUrl() + '/GetProfile/' + gsnApi.getChainId() + '/' + gsnApi.getProfileId();
          $http.get(url, { headers: gsnApi.getApiHeaders() }).success(function (response) {
            returnObj.profile = response;
            if (response.ExternalId)
              returnObj.profile.FreshPerksCard = response.ExternalId;
            if (response.PostalCode)
              while (returnObj.profile.PostalCode.length < 5) {
                returnObj.profile.PostalCode += '0';
              }
            returnDefer.resolve({ success: true, response: response });
            returnObj.getProfileDefer = null;
          }).error(function (response) {
            errorBroadcast(response, returnDefer);
          });
        });
      }
      return returnDefer.promise;
    };

    returnObj.mergeAccounts = function (newCardNumber, updateProfile) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getRoundyProfileUrl() + '/MergeAccounts/' + gsnApi.getChainId() + '/' + gsnApi.getProfileId() + '?newCardNumber=' + newCardNumber + '&updateProfile=' + updateProfile;
        $http.post(url, {}, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          errorBroadcast(response, deferred);
        });
      });
      return deferred.promise;
    };

    returnObj.removePhone = function () {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getRoundyProfileUrl() + '/SavePhoneNumber/' + gsnApi.getChainId() + '/' + gsnApi.getProfileId() + '?phoneNumber=' + '';
        $http.post(url, {}, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          returnObj.profile.Phone = null;
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          errorBroadcast(response, deferred);
        });
      });
      return deferred.promise;
    };

    returnObj.savePhonNumber = function (phoneNumber) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getRoundyProfileUrl() + '/SavePhoneNumber/' + gsnApi.getChainId() + '/' + gsnApi.getProfileId() + '?phoneNumber=' + phoneNumber;
        $http.post(url, {}, { headers: gsnApi.getApiHeaders() }).success(function (response) {          
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          errorBroadcast(response, deferred);
        });
      });
      return deferred.promise;
    };

    returnObj.isValidPhone = function (phoneNumber) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getRoundyProfileUrl() + '/IsValidPhone/' + gsnApi.getChainId() + '/' + returnObj.profile.FreshPerksCard + '?phone=' + phoneNumber;
        $http.get(url, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          errorBroadcast(response, deferred);
        });
      });
      return deferred.promise;
    };

    returnObj.profileByCardNumber = function (cardNumber) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getRoundyProfileUrl() + '/ProfileBy/' + gsnApi.getChainId() + '/' + cardNumber;
        $http.get(url, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          if (typeof response == 'object' && response.FirstName) {
            deferred.resolve({ success: true, response: response });
          } else {
            errorBroadcast(response, deferred);
          }
        }).error(function (response) {
          errorBroadcast(response, deferred);
        });
      });
      return deferred.promise;
    };

    returnObj.registerLoyaltyCard = function (profile) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getRoundyProfileUrl() + '/RegisterLoyaltyCard/' + gsnApi.getChainId() + '/' + gsnApi.getProfileId();
        if (profile.PostalCode) {
          profile.PostalCode = profile.PostalCode.substr(0, 5);
        }
        $http.post(url, profile, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          errorBroadcast(response, deferred);
        });
      });
      return deferred.promise;
    };

    returnObj.registerELoyaltyCard = function (profile) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getRoundyProfileUrl() + '/RegisterELoyaltyCard/' + gsnApi.getChainId() + '/' + gsnApi.getProfileId();
        if (profile.PostalCode) {
          profile.PostalCode = profile.PostalCode.substr(0, 5);
        }
        $http.post(url, profile, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          errorBroadcast(response, deferred);
        });
      });
      return deferred.promise;
    };

    returnObj.associateLoyaltyCardToProfile = function (cardNumber) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getRoundyProfileUrl() + '/AssociateLoyaltyCardToProfile/' + gsnApi.getChainId() + '/' + gsnApi.getProfileId() + '?loyaltyCardNumber=' + cardNumber;
        $http.get(url, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          deferred.resolve({ success: true, response: response });
        }).error(function (response) {
          errorBroadcast(response, deferred);
        });
      });
      return deferred.promise;
    };

    $rootScope.$on('gsnevent:logout', function () {
      init();
    });

    return returnObj;

    function errorBroadcast(response, deferred) {
      deferred.resolve({ success: false, response: response });
      $rootScope.$broadcast('gsnevent:roundy-error', { success: false, response: response });
    }
  }
})(angular);

// Actual Api Service
(function (myGsn, angular, undefined) {
  'use strict';
  var serviceId = '$gsnSdk';
  angular.module('gsn.core').service(serviceId, ['$window', '$timeout', '$rootScope', 'gsnApi', 'gsnProfile', 'gsnStore', 'gsnDfp', 'gsnYoutech', $gsnSdk]);

  function $gsnSdk($window, $timeout, $rootScope, gsnApi, gsnProfile, gsnStore, gsnDfp, gsnYoutech) {
    var returnObj = {
      hasInit: false
    };

    returnObj.init = function (options) {
      if (returnObj.hasInit) return;
      
      returnObj.hasInit = true;
      var currentToken = null;
      var onCallback = function(callbackFunction, data) {
        if (typeof(callbackFunction) == 'function') {
          callbackFunction({ success: true, response: data });
        }
      };
      
      var rpc = new easyXDM.Rpc(options, {
        remote: {
          triggerEvent: {}
        },
        local: {
          authenticate: function(grantType, user, pass) { gsnApi.doAuthenticate({ grant_type: grantType, client_id: gsnApi.getChainId(), access_type: 'offline', username: user, password: pass }); },
          apiGet: function (cacheObject, url, callbackFunction) { gsnApi.httpGetOrPostWithCache(cacheObject || {}, url).then(callbackFunction); },
          apiPost: function (cacheObject, url, postData, callbackFunction) { gsnApi.httpGetOrPostWithCache(cacheObject || {}, url, postData || {}).then(callbackFunction); },
          
          getToken: function (callbackFunction) { onCallback(callbackFunction, getToken());}, 
          getSiteId: function (callbackFunction) { onCallback(callbackFunction, gsnApi.getChainId()); }, 
          getStoreId: function (callbackFunction) { onCallback(callbackFunction, gsnApi.getSelectedStoreId()); },
          getProfileId: function (callbackFunction) { onCallback(callbackFunction, gsnApi.getProfileId()); },
          getShoppingListId: function (callbackFunction) { onCallback(callbackFunction, gsnApi.getSelectedShoppingListId()); }, 
          getConfig: function (callbackFunction) { onCallback(callbackFunction, gsnApi.getConfig()); },   
          
          mylist_addItem: function(item, callbackFunction) { gsnProfile.addItem(item); onCallback(callbackFunction); },
          mylist_updateItem: function (item, callbackFunction) { gsnProfile.addItem(item); onCallback(callbackFunction); },
          mylist_deleteItem: function(callbackFunction) { gsnProfile.removeItem(item); onCallback(callbackFunction); },
          mylist_deleteList: function (callbackFunction) { gsnProfile.deleteShoppingList(); onCallback(callbackFunction); },
          mylist_startNewList: function(callbackFunction) { gsnProfile.createNewShoppingList().then(callbackFunction); },
          mylist_refreshList: function (callbackFunction) { gsnProfile.getShoppingList().updateShoppingList().then(callbackFunction); },    
          mylist_getTitle: function (callbackFunction) { onCallback(callbackFunction, gsnProfile.getShoppingList().getTitle()); },         
          mylist_getCount: function (callbackFunction) { onCallback(callbackFunction, gsnProfile.getShoppingListCount()); },
          
          profile_register: function (profile, callbackFunction) { gsnProfile.registerProfile(profile).then(callbackFunction); },
          profile_update: function (profile, callbackFunction) { gsnProfile.updateProfile(profile).then(callbackFunction);},             
          profile_recoverUsername: function (email, callbackFunction) { gsnProfile.recoverUsername({Email: email}).then(callbackFunction); },   
          profile_recoverPassword: function (email, callbackFunction) { gsnProfile.recoverPassword({Email: email}).then(callbackFunction); },    
          profile_changePassword: function (userName, currentPassword, newPassword, callbackFunction) { gsnProfile.changePassword(userName, currentPassword, newPassword).then(callbackFunction); },      
          profile_selectStore: function (storeId, callbackFunction) { gsnProfile.selectStore(storeId).then(callbackFunction); },
          profile_get: function(callbackFunction) { gsnProfile.getProfile().then(function (data) { onCallback(callbackFunction, data); }); },   
          profile_logOut: function(callbackFunction) { gsnProfile.logOut(); onCallback(callbackFunction); },
          profile_isLoggedIn: function (callbackFunction) { onCallback(callbackFunction, getToken().grant_type !== 'anonymous'); },
          profile_getStore: function (callbackFunction) { gsnStore.getStore().then(function (store) { callbackFunction({ success: (gsnApi.isNull(store, null) !== null), response: store }); }); },
          
          store_hasCompleteCircular: function (callbackFunction) { onCallback(callbackFunction, gsnStore.hasCompleteCircular()); },
          store_getCircular: function(callbackFunction) { onCallback(callbackFunction, gsnStore.getCircularData()); },                
          store_getCategories: function (callbackFunction) { onCallback(callbackFunction, gsnStore.getCategories()); },                
          store_getInventoryCategories: function (callbackFunction) { onCallback(callbackFunction, gsnStore.getInventoryCategories()); },
          store_getSaleItemCategories: function (callbackFunction) { onCallback(callbackFunction, gsnStore.getSaleItemCategories()); },    
          store_refreshCircular: function (forceRefresh, callbackFunction) { onCallback(callbackFunction, gsnStore.refreshCircular(forceRefresh)); }, 
          store_searchProducts: function (searchTerm, callbackFunction) { gsnStore.searchProducts(searchTerm).then(callbackFunction); },                 
          store_searchRecipes: function (searchTerm, callbackFunction) { gsnStore.searchRecipes(searchTerm).then(callbackFunction); },                    
          store_getAvailableVarieties: function (circularItemId, callbackFunction) { gsnStore.getAvailableVarieties(circularItemId).then(callbackFunction); },
          store_getAskTheChef: function (callbackFunction) { gsnStore.getAskTheChef().then(callbackFunction); },                     
          store_getFeaturedArticle: function (callbackFunction) { gsnStore.getFeaturedArticle().then(callbackFunction); },              
          store_getCookingTip: function (callbackFunction) { gsnStore.getCookingTip().then(callbackFunction); },                          
          store_getTopRecipes: function (callbackFunction) { gsnStore.getTopRecipes().then(callbackFunction); },                            
          store_getFeaturedRecipe: function (callbackFunction) { gsnStore.getFeaturedRecipe().then(callbackFunction); },                      
          store_getManufacturerCoupons: function (callbackFunction) { onCallback(callbackFunction, gsnStore.getManufacturerCoupons()); },              
          store_getManufacturerCouponTotalSavings: function (callbackFunction) { gsnStore.getManufacturerCouponTotalSavings().then(callbackFunction); }, 
          store_getStates: function (callbackFunction) { gsnStore.getStates().then(callbackFunction); },                                       
          store_getInstoreCoupons: function (callbackFunction) { onCallback(callbackFunction, gsnStore.getInstoreCoupons()); },                 
          store_getYoutechCoupons: function (callbackFunction) { onCallback(callbackFunction, gsnStore.getYoutechCoupons()); },                      
          store_getRecipe: function (recipeId, callbackFunction) { gsnStore.getFeaturedRecipe(recipeId).then(callbackFunction); },                    
          store_getStaticContent: function (contentName, callbackFunction) { gsnStore.getStaticContent(contentName).then(callbackFunction); },         
          store_getArticle: function (articleId, callbackFunction) { gsnStore.getArticle(articleId).then(callbackFunction); },                          
          store_getSaleItems: function (departmentId, categoryId, callbackFunction) { gsnStore.getSaleItems(departmentId, categoryId).then(callbackFunction); },   
          store_getInventory: function (departmentId, categoryId, callbackFunction) { gsnStore.getInventory(departmentId, categoryId).then(callbackFunction); },   
          store_getSpecialAttributes: function (callbackFunction) { gsnStore.getSpecialAttributes().then(callbackFunction); },
          store_getMealPlannerRecipes: function (callbackFunction) { gsnStore.getMealPlannerRecipes().then(callbackFunction); },                                 
          store_getAdPods: function (callbackFunction) { gsnStore.getAdPods().then(callbackFunction); },
          store_getStores: function (callbackFunction) { getStores().then(function (data) { onCallback(callbackFunction, data); }); }
        }
      });

      // check every second for changes in access_token
      setInterval(function () {
        var apiToken = getToken();
        if (apiToken) {
          var localToken = gsnApi.isNull(currentToken, {});
          if (localToken.user_id !== apiToken.user_id) {
            currentToken = apiToken;
            // if profile changed, initiate profile refresh in gsnProfile by setting access token  
            var profileId = parseInt(currentToken.user_id);
            gsnApi.setAccessToken(currentToken);
            rpc.triggerEvent({ type: 'gsnevent:profile-changed', arg: profileId });
          }
        }
      }, 2000);

      $rootScope.$on('gsnevent:login-success', function (evt, rst) {
        rpc.triggerEvent({ type: 'gsnevent:login-success', arg: rst.response });
      });

      $rootScope.$on('gsnevent:login-failed', function (evt, rst) {
        rpc.triggerEvent({ type: 'gsnevent:login-failed', arg: rst.response });
      });

      function getToken() {
        var rawToken = localStorage.getItem('gsnStorage-accessToken');
        return (typeof (rawToken) === 'string') ? angular.fromJson(rawToken) : {};
      }
    };
    
    return returnObj;
  }
})(window.Gsn, angular);
(function (angular, undefined) {
  'use strict';
  var storageKey = 'gsnStorage-';
  var fallbackStorage = {};

  /*jshint -W030 */
  angular.module('gsn.core').
      factory('$localStorage', createStorage('localStorage')).
      factory('$sessionStorage', createStorage('sessionStorage'));

  function createStorage(storageType) {
    return [
        '$rootScope',
        '$window',
        '$log',

        function (
            $rootScope,
            $window,
            $log
        ) {
          function isStorageSupported(storageType) {
            var supported = $window[storageType];

            // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage
            // is available, but trying to call .setItem throws an exception below:
            // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
            if (supported && storageType === 'localStorage') {
              var key = '__' + Math.round(Math.random() * 1e7);

              try {
                localStorage.setItem(key, key);
                localStorage.removeItem(key);
              }
              catch (err) {
                supported = false;
              }
            }

            return supported;
          }

          // #9: Assign a placeholder object if Web Storage is unavailable to prevent breaking the entire AngularJS app
          var webStorage = isStorageSupported(storageType) || ($log.warn('This browser does not support Web Storage!'), fallbackStorage),
              $storage = {
                $default: function (items) {
                  for (var k in items) {
                    angular.isDefined($storage[k]) || ($storage[k] = items[k]);
                  }

                  return $storage;
                },
                $reset: function (items) {
                  for (var k in $storage) {
                    '$' === k[0] || delete $storage[k];
                  }

                  return $storage.$default(items);
                }
              },
              currentStorage,
              _debounce;

          for (var i = 0, k; i < webStorage.length; i++) {
            // #8, #10: `webStorage.key(i)` may be an empty string (or throw an exception in IE9 if `webStorage` is empty)
            (k = webStorage.key(i)) && storageKey === k.slice(0, storageKey.length) && ($storage[k.slice(storageKey.length)] = angular.fromJson(webStorage.getItem(k)));
          }

          currentStorage = angular.copy($storage);

          $rootScope.$watch(function () {
            _debounce || (_debounce = setTimeout(function () {
              _debounce = null;

              if (!angular.equals($storage, currentStorage)) {
                angular.forEach($storage, function (v, k) {
                  angular.isDefined(v) && '$' !== k[0] && webStorage.setItem(storageKey + k, angular.toJson(v));

                  delete currentStorage[k];
                });

                for (var k in currentStorage) {
                  webStorage.removeItem(storageKey + k);
                }

                currentStorage = angular.copy($storage);
              }
            }, 100));
          });
          
          // #6: Use `$window.addEventListener` instead of `angular.element` to avoid the jQuery-specific `event.originalEvent`
          'localStorage' === storageType && $window.addEventListener && $window.addEventListener('storage', function (event) {
            if (storageKey === event.key.slice(0, storageKey.length)) {
              // hack to support older safari (iPad1 or when browsing in private mode)
              // this assume that gsnStorage should never set anything to null.  Empty object yes, no null.
              if (typeof (event.newValue) === 'undefined') return;
              
              event.newValue ? $storage[event.key.slice(storageKey.length)] = angular.fromJson(event.newValue) : delete $storage[event.key.slice(storageKey.length)];

              currentStorage = angular.copy($storage);

              $rootScope.$apply();
            }
          }); 

          return $storage;
        }
    ];
  }
})(angular);


(function (angular, undefined) {
  'use strict';
  var serviceId = 'gsnStore';
  angular.module('gsn.core').service(serviceId, ['$rootScope', '$http', 'gsnApi', '$q', '$window', '$timeout', '$sessionStorage', '$localStorage', '$location', gsnStore]);

  function gsnStore($rootScope, $http, gsnApi, $q, $window, $timeout, $sessionStorage, $localStorage, $location) {
    var returnObj = {};

    // cache current user selection

    var $localCache = {
      manufacturerCoupons: {},
      instoreCoupons: {},
      youtechCoupons: {},
      quickSearchItems: {},
      topRecipes: {},
      faAskTheChef: {},
      faCookingTip: {},
      faArticle: {},
      faRecipe: {},
      faVideo: {},
      mealPlanners: {},
      manuCouponTotalSavings: {},
      states: {},
      adPods: {},
      specialAttributes: {},
      circular: null,
      storeList: null,
      rewardProfile: {},
      allVideos: []
    };

    var betterStorage = $sessionStorage;

    // cache current processed circular data
    var $circularProcessed = {
      circularByTypeId: {},
      categoryById: {},
      brandById: {},
      itemsById: {},
      staticCircularById: {},
      storeCouponById: {},
      manuCouponById: {},
      youtechCouponById: {}
    };

    var $previousGetStore,
        processingQueue = [];

    // get circular by type id
    returnObj.getCircular = function (circularTypeId) {
      var result = $circularProcessed.circularByTypeId[circularTypeId];
      return result;
    };

    // get all categories
    returnObj.getCategories = function () {
      return $circularProcessed.categoryById;
    };

    // get all categories
    returnObj.getInventoryCategories = function () {
      return gsnApi.isNull(betterStorage.circular, {}).InventoryCategories;
    };

    returnObj.getSaleItemCategories = function () {
      return gsnApi.isNull(betterStorage.circular, {}).SaleItemCategories;
    };

    // refres current store circular
    returnObj.refreshCircular = function (forceRefresh) {
      if ($localCache.circularIsLoading) return;

      $localCache.storeId = gsnApi.getSelectedStoreId();
      $localCache.circular = {};
      $localCache.circularIsLoading = true;
      $rootScope.$broadcast("gsnevent:circular-loading");

      var url = gsnApi.getStoreUrl() + '/AllContent/' + $localCache.storeId;
      gsnApi.httpGetOrPostWithCache({}, url).then(function (rst) {
        if (rst.success) {
          $localCache.circular = rst.response;
          betterStorage.circular = rst.response;

          // resolve is done inside of method below
          processCircularData();
          $localCache.circularIsLoading = false;
        } else {
          $localCache.circularIsLoading = false;
          $rootScope.$broadcast("gsnevent:circular-failed", rst);
        }
      });
    };


    returnObj.searchProducts = function (searchTerm) {
      var url = gsnApi.getStoreUrl() + '/SearchProduct/' + gsnApi.getSelectedStoreId() + '?q=' + encodeURIComponent(searchTerm);
      return gsnApi.httpGetOrPostWithCache({}, url);
    };

    returnObj.searchRecipes = function (searchTerm) {
      var url = gsnApi.getStoreUrl() + '/SearchRecipe/' + gsnApi.getChainId() + '?q=' + encodeURIComponent(searchTerm);
      return gsnApi.httpGetOrPostWithCache({}, url);
    };

    returnObj.getAvailableVarieties = function (circularItemId) {
      var url = gsnApi.getStoreUrl() + '/GetAvailableVarieties/' + circularItemId;
      return gsnApi.httpGetOrPostWithCache({}, url);
    };

    returnObj.getQuickSearchItems = function () {
      var url = gsnApi.getStoreUrl() + '/GetQuickSearchItems/' + gsnApi.getChainId();
      return gsnApi.httpGetOrPostWithCache($localCache.quickSearchItems, url);
    };
    
    // get all stores from cache
    returnObj.getStores = function () {
      var deferred = $q.defer();
      if (gsnApi.isNull($previousGetStore, null) !== null) {
        return $previousGetStore.promise;
      }

      $previousGetStore = deferred;
      var storeList = betterStorage.storeList;
      if (gsnApi.isNull(storeList, []).length > 0) {
        $timeout(function () {
          $previousGetStore = null;
          deferred.resolve({ success: true, response: storeList });
          parseStoreList(storeList);
        }, 10);
      } else {
        $rootScope.$broadcast("gsnevent:storelist-loading");
        gsnApi.getAccessToken().then(function () {
          var url = gsnApi.getStoreUrl() + '/List/' + gsnApi.getChainId();
          $http.get(url, { headers: gsnApi.getApiHeaders() }).success(function (response) {
            $previousGetStore = null;

            var stores = response;
            if (typeof (stores) != "string") {
              gsnApi.forEach(stores, function (store) {
                store.Settings = gsnApi.mapObject(store.StoreSettings, 'StoreSettingId');
                store.StateName = store.LinkState.Abbreviation;
              });

              betterStorage.storeList = stores;
            }

            deferred.resolve({ success: true, response: stores });
            $rootScope.$broadcast("gsnevent:storelist-loaded");
            parseStoreList(stores);
          });
        });
      }

      return deferred.promise;
    };

    // get the current store
    returnObj.getStore = function () {
      var deferred = $q.defer();
      returnObj.getStores().then(function (rsp) {
        var data = gsnApi.mapObject(rsp.response, 'StoreId');
        var result = data[gsnApi.getSelectedStoreId()];
        deferred.resolve(result);
      });

      return deferred.promise;
    };

    // get item by id
    returnObj.getItem = function (id) {
      var result = $circularProcessed.itemsById[id];
      return (gsn.isNull(result, null) !== null) ? result : null;
    };

    returnObj.getAskTheChef = function () {
      var url = gsnApi.getStoreUrl() + '/FeaturedArticle/' + gsnApi.getChainId() + '/1';
      return gsnApi.httpGetOrPostWithCache($localCache.faAskTheChef, url);
    };

    returnObj.getFeaturedArticle = function () {
      var url = gsnApi.getStoreUrl() + '/FeaturedArticle/' + gsnApi.getChainId() + '/2';
      return gsnApi.httpGetOrPostWithCache($localCache.faArticle, url);
    };
    
    returnObj.getFeaturedVideo = function () {
      var url = gsnApi.getStoreUrl() + '/FeaturedVideo/' + gsnApi.getChainId();
      return gsnApi.httpGetOrPostWithCache($localCache.faVideo, url);
    };

    returnObj.getRecipeVideos = function() {
      var url = gsnApi.getStoreUrl() + '/RecipeVideos/' + gsnApi.getChainId();
      return gsnApi.httpGetOrPostWithCache($localCache.allVideos, url);
    };
    
    returnObj.getCookingTip = function () {
      var url = gsnApi.getStoreUrl() + '/FeaturedArticle/' + gsnApi.getChainId() + '/3';
      return gsnApi.httpGetOrPostWithCache($localCache.faCookingTip, url);
    };

    returnObj.getTopRecipes = function () {
      var url = gsnApi.getStoreUrl() + '/TopRecipes/' + gsnApi.getChainId() + '/' + gsnApi.getMaxResultCount();
      return gsnApi.httpGetOrPostWithCache($localCache.topRecipes, url);
    };

    returnObj.getFeaturedRecipe = function () {
      var url = gsnApi.getStoreUrl() + '/FeaturedRecipe/' + gsnApi.getChainId();
      return gsnApi.httpGetOrPostWithCache($localCache.faRecipe, url);
    };

    returnObj.getCoupon = function (couponId, couponType) {
      return couponType == 2 ? $circularProcessed.manuCouponById[couponId] : (couponType == 10 ? $circularProcessed.storeCouponById[couponId] : $circularProcessed.youtechCouponById[couponId]);
    };

    returnObj.getManufacturerCoupons = function () {
      return $localCache.manufacturerCoupons;
    };

    returnObj.getOrLoadManufacturerCoupons = function() {
      var url = gsnApi.getStoreUrl() + '/ManufacturerCoupons/' + gsnApi.getSelectedStoreId();
      return gsnApi.httpGetOrPostWithCache($localCache.manufacturerCoupons, url);
    };

    returnObj.getManufacturerCouponTotalSavings = function () {
      var url = gsnApi.getStoreUrl() + '/GetManufacturerCouponTotalSavings/' + gsnApi.getChainId();
      return gsnApi.httpGetOrPostWithCache($localCache.manuCouponTotalSavings, url);
    };

    returnObj.getStates = function () {
      var url = gsnApi.getStoreUrl() + '/GetStates';
      return gsnApi.httpGetOrPostWithCache($localCache.states, url);
    };

    returnObj.getInstoreCoupons = function () {
      return $localCache.instoreCoupons;
    };

    returnObj.getYoutechCoupons = function () {
      return $localCache.youtechCoupons;
    };

    returnObj.getOrLoadYoutechCoupons = function() {
      var url = gsnApi.getStoreUrl() + '/YoutechCoupons/' + gsnApi.getSelectedStoreId();
      return gsnApi.httpGetOrPostWithCache($localCache.youtechCoupons, url);
    };

    returnObj.getRecipe = function (recipeId) {
      var url = gsnApi.getStoreUrl() + '/RecipeBy/' + recipeId;
      return gsnApi.httpGetOrPostWithCache({}, url);
    };

    returnObj.getStaticContent = function (contentName) {
      var url = gsnApi.getStoreUrl() + '/GetPartials/' + gsnApi.getChainId() + '/';
      var storeId = gsnApi.isNull(gsnApi.getSelectedStoreId(), 0);
      if (storeId > 0) {
        url += storeId + '/';
      }
      url += '?name=' + encodeURIComponent(contentName);
      
      return gsnApi.httpGetOrPostWithCache({}, url);
    };
    
    returnObj.getPartial = function (contentName) {
      var url = gsnApi.getContentServiceUrl('GetPartial');
      url += '?name=' + encodeURIComponent(contentName);

      return gsnApi.httpGetOrPostWithCache({}, url);
    };

    returnObj.getArticle = function (articleId) {
      var url = gsnApi.getStoreUrl() + '/ArticleBy/' + articleId;
      return gsnApi.httpGetOrPostWithCache({}, url);
    };

    returnObj.getSaleItems = function (departmentId, categoryId) {
      var url = gsnApi.getStoreUrl() + '/FilterSaleItem/' + gsnApi.getSelectedStoreId() + '?' + 'departmentId=' + gsnApi.isNull(departmentId, '') + '&categoryId=' + gsnApi.isNull(categoryId, '');
      return gsnApi.httpGetOrPostWithCache({}, url);
    };

    returnObj.getInventory = function (departmentId, categoryId) {
      var url = gsnApi.getStoreUrl() + '/FilterInventory/' + gsnApi.getSelectedStoreId() + '?' + 'departmentId=' + gsnApi.isNull(departmentId, '') + '&categoryId=' + gsnApi.isNull(categoryId, '');
      return gsnApi.httpGetOrPostWithCache({}, url);
    };

    returnObj.getSpecialAttributes = function () {
      var url = gsnApi.getStoreUrl() + '/GetSpecialAttributes/' + gsnApi.getChainId();
      return gsnApi.httpGetOrPostWithCache($localCache.specialAttributes, url);
    };
    
    returnObj.getMealPlannerRecipes = function () {
      var url = gsnApi.getStoreUrl() + '/GetMealPlannerRecipes/' + gsnApi.getChainId();
      return gsnApi.httpGetOrPostWithCache($localCache.mealPlanners, url);
    }; 

    returnObj.getAdPods = function () {
      var url = gsnApi.getStoreUrl() + '/ListSlots/' + gsnApi.getChainId();
      return gsnApi.httpGetOrPostWithCache($localCache.adPods, url);
    };

    // similar to getStores except the data is from cache
    returnObj.getStoreList = function () {
      if (gsnApi.isNull($localCache.storeList, null) === null) {
        $localCache.storeList = betterStorage.storeList;
      }

      return $localCache.storeList;
    };

    returnObj.hasCompleteCircular = function () {
      var circ = returnObj.getCircularData();
      var result = false;
      if (circ) {
        $localCache.storeId = circ.StoreId;
        result = gsnApi.isNull(circ.Circulars, false);
      }

      if (!result && (gsnApi.isNull(gsnApi.getSelectedStoreId(), 0) > 0)) {
        returnObj.refreshCircular();
      }
      
      return result;
    };

    returnObj.getCircularData = function () {
      if (gsnApi.isNull($localCache.circular, null) === null) {
        $localCache.circular = betterStorage.circular;
      }
      
      return $localCache.circular;
    };

    returnObj.initialize = function (isApi) {
      /// <summary>Initialze store data. this method should be
      /// written such that, it should do a server retrieval when parameter is null.
      /// </summary>

      if (gsnApi.getUseLocalStorage()) {
        betterStorage = $localStorage;
      }

      gsnApi.initApp();

      // call api to get stores
      returnObj.getStores();

      if (returnObj.hasCompleteCircular()) {
        // async init data
        $timeout(function() {
          processCircularData();
        }, 0);
      }

      if (gsnApi.isNull(isApi, null) !== null) {
        returnObj.getAdPods();
        returnObj.getManufacturerCouponTotalSavings();
      }
    };

    $rootScope.$on('gsnevent:store-setid', function (event, values) {
      var storeId = values.newValue;
      var requireRefresh = (gsnApi.isNull($localCache.storeId, 0) != storeId);
      
      // attempt to load circular
      if (requireRefresh) {
        $localCache.storeId = storeId;
        $localCache.circularIsLoading = false;
      }
      
      // always call update circular on set storeId or if it has been more than 2 minutes      
      var currentTime = new Date().getTime();
      var seconds = (currentTime - gsnApi.isNull(betterStorage.circularLastUpdate, 0)) / 1000;
      if ((requireRefresh && !$localCache.circularIsLoading) || (seconds > 120)) {
        returnObj.refreshCircular();
      }
    });

    return returnObj;

    //#region helper methods
    function parseStoreList(storeList) {
      var selectFirstStore = ($location.search()).selectFirstStore;
      storeList = gsnApi.isNull(storeList, []);
      if (storeList.length == 1 || selectFirstStore) {
        if (storeList[0].StoreId != gsnApi.isNull(gsnApi.getSelectedStoreId(), 0)) {
          gsnApi.setSelectedStoreId(storeList[0].StoreId);
        }
      }
    }
    
    function processManufacturerCoupon() {
      // process manufacturer coupon
      var circular = returnObj.getCircularData();
      $localCache.manufacturerCoupons.items = circular.ManufacturerCoupons;
      gsnApi.forEach($localCache.manufacturerCoupons.items, function (item) {
        item.CategoryName = gsnApi.isNull($circularProcessed.categoryById[item.CategoryId], { CategoryName: '' }).CategoryName;
        $circularProcessed.manuCouponById[item.ItemId] = item;
      });
    }

    function processInstoreCoupon() {
      var circular = returnObj.getCircularData();

      // process in-store coupon
      $localCache.instoreCoupons.items = circular.InstoreCoupons;
      gsnApi.forEach($localCache.instoreCoupons.items, function (item) {
        item.CategoryName = gsnApi.isNull($circularProcessed.categoryById[item.CategoryId], { CategoryName: '' }).CategoryName;
        $circularProcessed.storeCouponById[item.ItemId] = item;
      });
    }

    function processYoutechCoupon() {
      var circular = returnObj.getCircularData();

      // process youtech coupon
      $localCache.youtechCoupons.items = circular.YoutechCoupons;
      gsnApi.forEach($localCache.youtechCoupons.items, function (item) {
        item.CategoryName = gsnApi.isNull($circularProcessed.categoryById[item.CategoryId], {CategoryName: ''}).CategoryName;
        $circularProcessed.youtechCouponById[item.ItemId] = item;
      });
    }

    function processCoupon() {
      if ($circularProcessed) {
        $timeout(processManufacturerCoupon, 50);
        $timeout(processInstoreCoupon, 50);
        $timeout(processYoutechCoupon, 50);
      }
    }

    function processCircularData() {
      var circular = returnObj.getCircularData();
      if (gsnApi.isNull(circular, null) === null) return;

      betterStorage.circularLastUpdate = new Date().getTime();
      $localCache.storeId = circular.StoreId;
      processingQueue.length = 0;

      // process category into key value pair
      processingQueue.push(function () {
        var categoryById = gsnApi.mapObject(circular.Categories, 'CategoryId');

        categoryById[null] = { CategoryId: null, CategoryName: '' };
        categoryById[-1] = { CategoryId: -1, CategoryName: 'Misc. Items' };
        categoryById[-2] = { CategoryId: -2, CategoryName: 'Ingredients' };
        $circularProcessed.categoryById = categoryById;
      });

      processingQueue.push(function () {
        var brandById = gsnApi.mapObject(circular.Brands, 'BrandId');
        brandById[null] = { BrandId: null, BrandName: '' };
        brandById[0] = { BrandId: 0, BrandName: '' };
        $circularProcessed.brandById = brandById;
      });

      var circularTypes = gsnApi.mapObject(circular.CircularTypes, 'Code');
      var circularByTypes = [];
      var staticCirculars = [];
      var items = [];

      // foreach Circular
      gsnApi.forEach(circular.Circulars, function (circ) {
        processCircular(circ, items, circularTypes, staticCirculars, circularByTypes);
      });

      processingQueue.push(function () {
        gsnApi.sortOn(items, 'Description');

        // set all items
        circularByTypes.push({ CircularTypeId: 99, CircularType: 'All Circulars', items: items });
      });

      // set result
      processingQueue.push(function () {
        $circularProcessed.itemsById = gsnApi.mapObject(items, 'ItemId');
      });

      processingQueue.push(function () {
        $circularProcessed.circularByTypeId = gsnApi.mapObject(circularByTypes, 'CircularTypeId');
      });

      processingQueue.push(function () {
        $circularProcessed.staticCircularById = gsnApi.mapObject(staticCirculars, 'CircularTypeId');
      });

      processCoupon();

      processingQueue.push(function () {
        $rootScope.$broadcast('gsnevent:circular-loaded', { success: true, response: circular });
      });

      processWorkQueue();

    }

    function processWorkQueue() {
      if (processingQueue.length > 0) {
        // this make sure that work get executed in sequential order
        processingQueue.shift()();
        $timeout(processWorkQueue, 50);
      }
    }

    function processCircular(circ, items, circularTypes, staticCirculars, circularByTypes) {
      // process pages
      var pages = circ.Pages;
      var itemCount = 0;
      gsnApi.sortOn(pages, 'PageNumber');
      circ.pages = pages;
      circ.CircularType = circularTypes[circ.CircularTypeId].Name;
      var circularMaster = {
        CircularPageId: pages[0].CircularPageId,
        CircularType: circ.CircularType,
        CircularTypeId: circ.CircularTypeId,
        ImageUrl: pages[0].ImageUrl,
        SmallImageUrl: pages[0].SmallImageUrl,
        items: []
      };

      // foreach Page in Circular
      gsnApi.forEach(pages, function (page) {
        itemCount += page.Items.length;

        processingQueue.push(function () {
          processCircularPage(items, circularMaster, page);
        });
      });

      processingQueue.push(function () {
        if (gsnApi.isNull(itemCount, 0) > 0) {
          circularByTypes.push(circularMaster);
        } else {
          circularMaster.items = pages;
          staticCirculars.push(circularMaster);
        }
      });
    }

    function processCircularPage(items, circularMaster, page) {
      // foreach Item on Page
      gsnApi.forEach(page.Items, function (item) {
        circularMaster.items.push(item);
        items.push(item);
      });
    }
    //#endregion
  }
})(angular);
(function (angular, undefined) {
  'use strict';
  var serviceId = 'gsnYoutech';
  angular.module('gsn.core').service(serviceId, ['$rootScope', 'gsnApi', 'gsnProfile', 'gsnStore', '$q', '$http', gsnYoutech]);

  function gsnYoutech($rootScope, gsnApi, gsnProfile, gsnStore, $q, $http) {
    // Usage: Youtech coupon integration service
    //        Written here as an example of future integration
    //
    // Summary: 
    //    - When youtech api url exists, make call to get and cache total savings
    //    - When profile change occurred, make call to get any available coupon for card
    //
    // Creates: 2013-12-28 TomN
    // 

    var service = {
      isValidCoupon: isValidCoupon,
      hasValidCard: hasValidCard,
      addCouponTocard: addCouponToCard,     
      removeCouponFromCard: removeCouponFromCard,
      isOldRoundyCard: isOldRoundyCard,
      isAvailable: isAvailable,
      isOnCard: isOnCard,
      hasRedeemed: hasRedeemed,
      hasCard: hasCard,
      enable: true
    };
    var $saveData = initData();

    $rootScope.$on('gsnevent:logout', function (event, result) {
      if (!service.enable) {
        return;
      }

      $saveData = initData();
    });

    $rootScope.$on('gsnevent:profile-load-success', function (event, result) {
      if (!service.enable) {
        return;
      }
      
      initData();

      if ($saveData.youtechCouponUrl.length > 2) {
        
        //    - When profile change occurred, make call to get any available coupon for card
        $saveData.currentProfile = result.response;
        loadCardCoupon();
      }
    });
    
    $rootScope.$on('gsnevent:store-persisted', function (event, result) {
      if (!service.enable) {
        return;
      }

      initData();

      if ($saveData.currentProfile && $saveData.youtechCouponUrl.length > 2) {
        loadCardCoupon();
      }
    });

    return service;

    //#region Internal Methods 
    function initData() {
      return {
        youtechCouponUrl: gsnApi.isNull(gsnApi.getYoutechCouponUrl(), ''),
        cardCouponResponse: null,
        availableCouponById: {},
        takenCouponById: {},
        redeemedCouponById: {},
        isValidResponse: false,
        currentProfile: {}
      };
    }

    function hasCard() {
      return (gsnApi.isNull($saveData.currentProfile.ExternalId, '').length > 0);
    }

    function isOldRoundyCard() {
      return hasCard() && (gsnApi.isNaN(parseFloat($saveData.currentProfile.ExternalId), 0) < 48203769258);
    }

    function hasValidCard() {
      return hasCard() && $saveData.isValidResponse;
    }

    function isValidCoupon(couponId) {
      return (isAvailable(couponId) || isOnCard(couponId));
    }

    function isAvailable(couponId) {
      return (gsnApi.isNull($saveData.availableCouponById[couponId], null) !== null);
    }

    function isOnCard(couponId) {
      return (gsnApi.isNull($saveData.takenCouponById[couponId], null) !== null);
    }
    
    function hasRedeemed(couponId) {
      return (gsnApi.isNull($saveData.redeemedCouponById[couponId], null) !== null);
    }

    function handleFailureEvent(eventName, deferred, couponId, response) {
      deferred.resolve({ success: false, response: response });
      $rootScope.$broadcast(eventName, couponId);
    }

    function addCouponToCard(couponId) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = $saveData.youtechCouponUrl + '/AddToCard/' + gsnApi.getProfileId() + '/' + couponId;
        $http.post(url, {}, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          $saveData.takenCouponById[couponId] = true;
          delete $saveData.availableCouponById[couponId];
          deferred.resolve({ success: true, response: response });
          $rootScope.$broadcast('gsnevent:youtech-cardcoupon-added', couponId);
        }).error(function (response) {
          handleFailureEvent('gsnevent:youtech-cardcoupon-addfail', deferred, couponId, response);
        });
      });
      return deferred.promise;
    }

    function removeCouponFromCard(couponId) {
      var deferred = $q.defer();
      gsnApi.getAccessToken().then(function () {
        var url = $saveData.youtechCouponUrl + '/RemoveFromCard/' + gsnApi.getProfileId() + '/' + couponId;
        $http.post(url, {}, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          if (response.Success) {
            $saveData.availableCouponById[couponId] = true;
            delete $saveData.takenCouponById[couponId];
            deferred.resolve({ success: true, response: response });
            $rootScope.$broadcast('gsnevent:youtech-cardcoupon-removed', couponId);
          } else {
            handleFailureEvent('gsnevent:youtech-cardcoupon-removefail', deferred, couponId, response.Message);
          }
        }).error(function (response) {
          handleFailureEvent('gsnevent:youtech-cardcoupon-removefail', deferred, couponId, response);
        });
      });
      return deferred.promise;
    }

    function loadCardCoupon() {
      gsnApi.getAccessToken().then(function () {
        var url = $saveData.youtechCouponUrl + '/GetProfileCoupons/' + gsnApi.getProfileId();
        $http.get(url, { headers: gsnApi.getApiHeaders() }).success(function (response) {
          // process card coupon response
          if (response.Success) {
            var i = 0;
            $saveData.isValidResponse = true;
            try {
              $saveData.cardCouponResponse = response.Response;
              if ($saveData.cardCouponResponse.availableCoupons) {
                $saveData.availableCouponById = gsnApi.mapObject($saveData.cardCouponResponse.availableCoupons.coupon, 'couponId');
              }
              if ($saveData.cardCouponResponse.available_ids) {
                $saveData.availableCouponById = {};
                for (i = 0; i < $saveData.cardCouponResponse.available_ids.length; i++) {
                  $saveData.availableCouponById[$saveData.cardCouponResponse.available_ids[i]] = true;
                }
              }
              
              if ($saveData.cardCouponResponse.takenCoupons) {
                $saveData.takenCouponById = gsnApi.mapObject($saveData.cardCouponResponse.takenCoupons.coupon, 'couponId');
              }

              var toParse = gsnApi.isNull($saveData.cardCouponResponse.taken_ids, $saveData.cardCouponResponse.clipped_active_ids);
              
              if (toParse) {
                $saveData.takenCouponById = {};
                for (i = 0; i < toParse.length; i++) {
                  $saveData.takenCouponById[toParse[i]] = true;
                }
              }
              
              // add clipped_redeemed_ids
              toParse = $saveData.cardCouponResponse.clipped_redeemed_ids;
              if (toParse) {
                $saveData.redeemedCouponById = {};
                for (i = 0; i < toParse.length; i++) {
                  $saveData.takenCouponById[toParse[i]] = true;
                  $saveData.redeemedCouponById[toParse[i]] = true;
                }
              }

            } catch (e) { }

            $rootScope.$broadcast('gsnevent:youtech-cardcoupon-loaded', service);
            return;
          }

          $saveData.isValidResponse = false;
          $rootScope.$broadcast('gsnevent:youtech-cardcoupon-loadfail', service);
        }).error(function (response) {
          $saveData.isValidResponse = false;
          $rootScope.$broadcast('gsnevent:youtech-cardcoupon-loadfail', service);
        });
      });
    }
    //#endregion
  }
})(angular);
