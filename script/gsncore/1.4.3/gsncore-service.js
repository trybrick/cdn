/*!
gsn.core - 1.4.3
GSN API SDK
Build date: 2015-02-26 09-06-26 
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
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.filter('defaultIf', ['gsnApi', function (gsnApi) {
    // Usage: testValue | defaultIf:testValue == 'test' 
    //    or: testValue | defaultIf:someTest():defaultValue
    // 
    // Creates: 2014-04-02
    // 

    return function (input, conditional, defaultOrFalseValue) {
      var localCondition = conditional;
      if (typeof(conditional) == "function") {
        localCondition = conditional();
      }
      return localCondition ? defaultOrFalseValue : input;
    };
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.filter('groupBy', ['gsnApi', function (gsnApi) {
    // Usage: for doing grouping
    // 
    // Creates: 2013-12-26
    // 

    return function (input, attribute) {
      return gsnApi.groupBy(input, attribute);
    };
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.filter('pagingFilter', function () {
    // Usage: for doing paging, item in list | pagingFilter:2:1
    // 
    // Creates: 2013-12-26
    // 

    return function (input, pageSize, currentPage) {
      return input ? input.slice(currentPage * pageSize, (currentPage + 1) * pageSize) : [];
    };
  });

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.filter('tel', function () {
    // Usage: phone number formating phoneNumber | tel
    // 
    // Creates: 2014-9-1
    // 

    return function (tel) {
      if (!tel) return '';

      var value = tel.toString();    
      return  value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);        
    };
  });

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  /**
  * This directive help dynamically create a list of numbers.
  * usage: data-ng-repeat="n in [] | range:1:5"
  * @directive range
  */
  myModule.filter('range', [function () {
    return function (input, min, max) {
      min = parseInt(min); //Make string input int
      max = parseInt(max);
      for (var i = min; i < max; i++) {
        input.push(i);
      }

      return input;
    };
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.filter('removeAspx', ['gsnApi', function (gsnApi) {
    // Usage: for removing aspx
    // 
    // Creates: 2014-01-05
    // 

    return function (text) {
      return gsnApi.isNull(text, '').replace(/(.aspx\"|.gsn\")+/gi, '"');
    };
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.filter('trustedHtml', ['gsnApi', '$sce', function (gsnApi, $sce) {
    // Usage: allow for binding html
    // 
    // Creates: 2014-01-05
    // 

    return function (text) {
      return $sce.trustAsHtml(text);
    };
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnAdUnit', ['gsnStore', '$timeout', 'gsnApi', '$rootScope', '$http', '$templateCache', '$interpolate', function (gsnStore, $timeout, gsnApi, $rootScope, $http, $templateCache, $interpolate) {
    // Usage: create an adunit and trigger ad refresh
    // 
    // Creates: 2014-04-05 TomN
    // 
    var directive = {
      restrict: 'A',
      link: link
    };
    return directive;

    function link(scope, elm, attrs) {
      scope.templateHtml = null;
      var tileId = gsnApi.isNull(attrs.gsnAdUnit, '');
      if (tileId.length > 0) {
        var templateUrl = gsnApi.getThemeUrl('/../common/views/tile' + tileId + '.html');
        var templateLoader = $http.get(templateUrl, { cache: $templateCache });
        var hasTile = false;


        templateLoader.success(function(html) {
          scope.templateHtml = html;
        }).then(linkTile);
      }

      function linkTile() {
        if (tileId.length > 0) {
          if (hasTile && scope.templateHtml) {
            elm.html(scope.templateHtml);
            var html = $interpolate(scope.templateHtml)(scope);
            elm.html(html);

            // broadcast message
            $rootScope.$broadcast('gsnevent:loadads');
          }
        } else {
          if (hasTile) {
            // find adunit
            elm.find('.gsnadunit').addClass('gsnunit');
            
            // broadcast message
            $rootScope.$broadcast('gsnevent:loadads');
          }
        }
      }      

      gsnStore.getAdPods().then(function(rsp) {
        if (rsp.success) {
          // check if tile is in response
          // rsp.response;
          if (attrs.tile) {
            for (var i = 0; i < rsp.response.length; i++) {
              var tile = rsp.response[i];
              if (tile.Code == attrs.tile) {
                hasTile = true;
                break;
              }
            }
          } else {
            hasTile = true;
          }

          linkTile();
        }
      });
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnAutoFillSync', ['$timeout', function ($timeout) {
    // Usage: Fix syncing issue with autofill form
    // 
    // Creates: 2014-08-28 TomN
    // 
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };
    return directive;

    function link(scope, elm, attrs, ngModel) {
      var origVal = elm.val();
      $timeout(function () {
        var newVal = elm.val();
        if (ngModel.$pristine && origVal !== newVal) {
          ngModel.$setViewValue(newVal);
        }
      }, 500);
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnAutoFocus', ['$timeout', function ($timeout) {
    var directive = {
      restrict: 'EA',
      link: link
    };
    return directive;

    function link(scope, element, attrs) {

      function focusIt() {
        $timeout(function() {
          element[0].focus();
        }, 0);
      }

      scope.$watch(function () {
        if (attrs.watch) {
          var parentArr = $('.' + attrs.watch);
          if (parentArr.length > 0) {
            var parent = parentArr[parentArr.length - 1];
            return (window.getComputedStyle(parent).display === 'block');
          }
        }
        return false;
      }, function () {
        $timeout(function () {
          focusIt();
        }, 300);
      });
    }
    
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnCarousel', ['gsnApi', '$timeout', '$window', function (gsnApi, $timeout, $window) {
    // Usage:   Display slides
    // 
    // Creates: 2014-01-06
    // 
    var directive = {
      link: link,
      restrict: 'EA',
      scope: true
    };
    return directive;

    function link(scope, element, attrs) {
      var options = {
        interval: attrs.interval,
        reverse: attrs.reverse | false
      },
      cancelRefresh,
      wasRunning = false,
      isPlaying = false;
      
      scope.$slideIndex = 0;
      scope.activate = activate;
      scope.slides = [];
      
      // determine if slide show is current playing
      scope.isPlaying = function() {
        return isPlaying;
      };
      
      // play slide show
      scope.play = function() {
        isPlaying = true;
        
        slideTimer();
      };
      
      // pause slide show
      scope.stop = function() {
        isPlaying = false;
        
        if (gsnApi.isNull(cancelRefresh, null) !== null) {
          $timeout.cancel(cancelRefresh);
        }
      };
      
      // go to next slide
      scope.next = function() {
        scope.$slideIndex = doIncrement(scope.$slideIndex, 1);
      };
      
      // go to previous slide
      scope.prev = function() {
        scope.$slideIndex = doIncrement(scope.$slideIndex, -1);
      };

      // go to specfic slide index
      scope.selectIndex = function(slideIndex) {
        scope.$slideIndex = slideIndex;
      };

      // get the current slide
      scope.currentSlide = function() {
        return scope.slides[scope.currentIndex()];
      };
      
      // add slide
      scope.addSlide = function(slide) {
        scope.slides.push(slide);
      };

      // remove a slide
      scope.removeSlide = function(slide) {
        //get the index of the slide inside the carousel
        var index = scope.indexOf(slide);
        slides.splice(index, 1);
      };

      // get a slide index
      scope.indexOf = function (slide) {
        if (typeof(slide.indexOf) !== 'undefined') {
          return slide.indexOf(slide);
        }
        else if (typeof (scope.slides.length) != 'undefined') {
          // this is a loop because of indexOf does not work in IE
          for (var i = 0; i < scope.slides.length; i++) {
            if (scope.slides[i] == slide) {
              return i;
            }
          }
        }

        return -1;
      };
      
      // get current slide index
      scope.currentIndex = function () {
        var reverseIndex = (scope.slides.length - scope.$slideIndex - 1) % scope.slides.length;
        reverseIndex = (reverseIndex < 0) ? 0 : scope.slides.length - 1;
        
        return options.reverse ? reverseIndex : scope.$slideIndex;
      };
      
      // watch index and make sure it doesn't get out of range
      scope.$watch('$slideIndex', function(newValue) {
        var checkValue = doIncrement(scope.$slideIndex, 0);
        
        // on index change, make sure check value is correct
        if (checkValue != newValue) {
          scope.$slideIndex = checkValue;
        }
      });
      
      // cancel timer if it is running
      scope.$on('$destroy', scope.stop);
      
      scope.activate();
      
      //#region private functions
      // initialize
      function activate() {
        if (gsnApi.isNull(scope[attrs.slides], []).length <= 0) {
          $timeout(activate, 200);
          return;
        }
        
        isPlaying = gsnApi.isNull(options.interval, null) !== null;
        scope.slides = scope[attrs.slides];
        scope.selectIndex(0);
        
        // trigger the timer
        slideTimer();
        var win = angular.element($window);
        win.blur(function() {
          wasRunning = scope.isPlaying();
          scope.stop();
        });
        
        win.focus(function() {
          if (wasRunning) {
            scope.play();
          }
        });
      }

      // the slide timer
      function slideTimer() {
        if (!isPlaying) {
          return;
        }
        
        cancelRefresh = $timeout(function doWork() {
          if (!isPlaying) {
            return;
          }

          scope.next();
          
          // set new refresh interval
          cancelRefresh = $timeout(doWork, options.interval);
          
          // empty return to further prevent memory leak
          return;
        }, options.interval);
      }
      
      // safe increment
      function doIncrement(slideIndex, inc) {
        var newValue = slideIndex + inc;
        newValue = ((newValue < 0) ? scope.slides.length - 1 : newValue) % scope.slides.length;
        return gsnApi.isNaN(newValue, 0);
      }
      //#endregion
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnCouponPopover', ['$window', function ($window) {

    var directive = {
      restrict: 'EA',
      scope: true,
      link: link
    };
    
    return directive;

    function appendEllipsis(element, attrs) {
      if ($(element)[0].scrollHeight>97 && !$(element.find('.ellipsis')).length) {

         var isOpenedByClick = false;
          $(element).css('height', '96px');
          $(element).append('<button class="ellipsis  pull-right">...</button>');

          $(element.find('.ellipsis')).popover({
            html: true,
            content: attrs.popoverHtml,
            placement: 'top',
            container: 'body',
            trigger: 'manual'
          });

          $(element.find('.ellipsis')).bind('click', function () {
            if (!$('.popover').length) {
              $(this).focus();
            }
            else {
              $(this).blur();
            }
          });

          $(element.find('.ellipsis')).bind('mouseover', function () {
            if (!$('.popover').length) {
              $(this).focus();
            }
          });

          $(element.find('.ellipsis')).bind('mouseout', function () {
            if (!isOpenedByClick)
              $(this).blur();
          });


          $(element.find('.ellipsis')).bind('blur', function () {
            $(this).popover('hide');
            isOpenedByClick = false;
          });

          $(element.find('.ellipsis')).bind('focus', function () {
            $(this).popover('show');
          });

          $(element.find('p')).bind('click', function () {
            var eliipsis = $(element.find('.ellipsis'));
            if (!$('.popover').length) {
              eliipsis.focus();
              isOpenedByClick = true;
            }
            else {
              eliipsis.blur();
            }
          });

      } 
      if ($(element)[0].clientHeight == $(element)[0].scrollHeight && $(element.find('.ellipsis')).length)
      {
        $(element.find('.ellipsis')).remove();
        $(element.find('p')).unbind('click');
      }
      
    }

    function link(scope, element, attrs) {

      scope.$watch('$viewContentLoaded',
        function () { appendEllipsis(element, attrs); });

      scope.$watch(function () {
        return $window.innerWidth;
      }, function () { appendEllipsis(element, attrs); });

    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnDigitalCirc', ['$timeout', '$rootScope', '$analytics', 'gsnApi', function ($timeout, $rootScope, $analytics, gsnApi) {
    // Usage: create classic hovering digital circular
    // 
    // Creates: 2013-12-12 TomN
    // 
    var directive = {
      restrict: 'EA',
      scope: false,
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.gsnDigitalCirc, function (newValue) {
        if (newValue) {
          if (newValue.Circulars.length > 0) {
            var el = element.find('div');
            el.digitalCirc({
              data: newValue,
              browser: gsnApi.browser,
              onItemSelect: function (plug, evt, item) {
                // must use timeout to sync with UI thread
                $timeout(function () {
                  $rootScope.$broadcast('gsnevent:digitalcircular-itemselect', item);
                }, 50);
              },
              onCircularDisplaying: function (plug, circIdx, pageIdx) {
                // must use timeout to sync with UI thread
                $timeout(function () {
                  // trigger ad refresh for circular page changed
                  $rootScope.$broadcast('gsnevent:digitalcircular-pagechanging', { plugin: plug, circularIndex: circIdx, pageIndex: pageIdx });
                }, 50);

                var circ = plug.getCircular(circIdx);
                if (circ) {
                  $analytics.eventTrack('PageChange', { category: 'Circular_Type' + circ.CircularTypeId + '_P' + (pageIdx + 1), label: circ.CircularDescription, value: pageIdx });
                }
              }
            });
          }
        }
      });
    }
  }]);
})(angular);
(function (angular, undefined) {
  var createDirective, module, pluginName, _i, _len, _ref;

  module = angular.module('gsn.core');

  createDirective = function (name) {
    return module.directive(name, ['gsnStore', 'gsnApi', function (gsnStore, gsnApi) {
      return {
        restrict: 'AC',
        scope: true,
        link: function (scope, element, attrs) {
          var currentStoreId = gsnApi.getSelectedStoreId();

          if (attrs.contentPosition) {
            var dynamicData = gsnApi.parseStoreSpecificContent(gsnApi.getHomeData().ContentData[attrs.contentPosition]);
            if (dynamicData && dynamicData.Description) {
              element.html(dynamicData.Description);
              return;
            }
          }

          scope.item = {};
          if (name == 'gsnFtArticle') {
            gsnStore.getFeaturedArticle().then(function (result) {
              if (result.success) {
                scope.item = result.response;
              }
            });
          }
          else if (name == 'gsnFtRecipe') {
            gsnStore.getFeaturedRecipe().then(function (result) {
              if (result.success) {
                scope.item = result.response;
              }
            });
          }
          else if (name == 'gsnFtAskthechef') {
            gsnStore.getAskTheChef().then(function (result) {
              if (result.success) {
                scope.item = result.response;
              }
            });
          }
          else if (name == 'gsnFtVideo') {
            gsnStore.getFeaturedVideo().then(function (result) {
              if (result.success) {
                scope.item = result.response;
              }
            });
          }
          else if (name == 'gsnFtCookingtip') {
            gsnStore.getCookingTip().then(function (result) {
              if (result.success) {
                scope.item = result.response;
              }
            });
          }
          else if (name == 'gsnFtConfig') {
            scope.item = gsnApi.parseStoreSpecificContent(gsnApi.getHomeData().ConfigData[attrs.gsnFtConfig]);
          }
          else if (name == 'gsnFtContent') {
            // do nothing, content already being handled by content position
          }
        }
      };
    }]);
  };

  _ref = ['gsnFtArticle', 'gsnFtRecipe', 'gsnFtAskthechef', 'gsnFtCookingtip', 'gsnFtVideo', 'gsnFtConfig', 'gsnFtContent'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    pluginName = _ref[_i];
    createDirective(pluginName);
  }

})(angular);

(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnFlexibleWidth', [function () {
    var directive = {
      restrict: 'EA',
      scope: true,
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      function updateWidth() {
        element.css({
          width: element.parent()[0].offsetWidth + 'px'
        });
      }

      updateWidth();
      $(window).resize(updateWidth);
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnFlowPlayer', ['$timeout', 'gsnApi', '$rootScope', '$routeParams', function ($timeout, gsnApi, $rootScope, $routeParams) {
    // Usage: add 3rd party videos
    // 
    // Creates: 2013-12-12 TomN
    // 
    var directive = {
      restrict: 'EA',
      replace: true,
      scope: true,
      link: link
    };
    return directive;

    function link(scope, element, attrs) {

      scope.play = function (url, title) {

        scope.videoTitle = title;
        scope.videoName = name;

        flowplayer(attrs.gsnFlowPlayer, attrs.swf, {
          clip: {
            url: url,
            autoPlay: true,
            autoBuffering: true // <- do not place a comma here
          }
        });

        $rootScope.$broadcast('gsnevent:loadads');
      };

      if ($routeParams.title) {
        scope.videoTitle = $routeParams.title;
      }

      $timeout(function () {
        var el = angular.element('a[title="' + scope.vm.featuredVideo.Title + '"]');
        el.click();
      }, 500);
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnFluidVids', ['$sce', function ($sce) {
    // Usage: add 3rd party videos
    // 
    // Creates: 2013-12-12 TomN
    // 
    var directive = {
      restrict: 'EA',
      replace: true,
      scope: true,
      link: link,
      template: '<div class="fluidvids">' +
          '<iframe data-ng-src="{{ video }}" allowfullscreen="" frameborder="0"></iframe>' +
          '</div>'
    };
    return directive;

    function link(scope, element, attrs) {
      element.on('scroll', function () {
        var ratio = (attrs.height / attrs.width) * 100;
        element[0].style.paddingTop = ratio + '%';
      });

      scope.video = $sce.trustAsResourceUrl(attrs.gsnFluidVids);
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnFrame', ['$interpolate', '$http', '$templateCache', 'gsnApi', function ($interpolate, $http, $templateCache, gsnApi) {
    // Usage: add static content frame
    // 
    // Creates: 2013-12-12 TomN
    // 
    var directive = {
      restrict: 'A',
      scope: { item: '=' },
      link: link
    };
    return directive;

    function link(scope, elm, attrs) {

      var templateUrl = gsnApi.getThemeUrl(attrs.gsnFrame);
      var templateLoader = $http.get(templateUrl, { cache: $templateCache });
      scope.templateHtml = '';

      templateLoader.success(function (html) {
        scope.templateHtml = html;
      }).then(function (response) {
        var html = $interpolate(scope.templateHtml)(scope.item);
        html = html.replace('<title></title>', '<title>' + scope.item.Title + '</title>');
        html = html.replace('<body></body>', '<body>' + scope.item.Description + '</body>');
        var iframe = gsnApi.loadIframe(elm, html);
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('id', 'static-content-frame');
      });
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnHtmlCapture', ['$window', '$timeout', function ($window, $timeout) {
    // Usage:   bind html back into some property
    // 
    // Creates: 2014-01-06
    // 
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      var timeout = parseInt(attrs.timeout);
      var continousMonitor = timeout > 0;

      if (timeout <= 0) {
        timeout = 200;
      }

      var refresh = function () {
        scope.$apply(attrs.gsnHtmlCapture + ' = "' + element.html().replace(/"/g, '\\"') + '"');
        var noData = scope[attrs.gsnHtmlCapture].replace(/\s+/gi, '').length <= 0;
        if (noData) {
          $timeout(refresh, timeout);
          return;
        }
        if (continousMonitor) {
          $timeout(refresh, timeout);
        }
      };

      $timeout(refresh, timeout);
    }
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnLogin', ['gsnApi', '$route', '$routeParams', '$location', 'gsnProfile', function (gsnApi, $route, $routeParams, $location, gsnProfile) {
    // Usage: login capability
    // 
    // Creates: 2013-12-12 TomN
    // 
    var directive = {
      restrict: 'EA',
      controller: ['$scope', '$element', '$attrs', controller]
    };
    return directive;

    function controller($scope, $element, $attrs) {
      $scope.activate = activate;
      $scope.profile = {};
      $scope.fromUrl = null;

      $scope.hasSubmitted = false;    // true when user has click the submit button
      $scope.isValidSubmit = true;    // true when result of submit is valid
      $scope.isSubmitting = false;    // true if we're waiting for result from server

      function activate() {
        $scope.fromUrl = decodeURIComponent(gsnApi.isNull($routeParams.fromUrl, ''));
      }

      $scope.$on('gsnevent:login-success', function (evt, result) {
        if ($scope.currentPath == '/signin') {
          if ($scope.fromUrl) {
            $location.url($scope.fromUrl);
          } else if ($scope.isLoggedIn) {
            $location.url('/');
          }
        } else {
          // reload the page to accept the login
          $route.reload();
        }

        $scope.$emit('gsnevent:closemodal');
      });

      $scope.$on('gsnevent:login-failed', function (evt, result) {
        $scope.isValidSubmit = false;
        $scope.isSubmitting = false;
      });
      
      $scope.login = function () {
        $scope.isSubmitting = true;
        $scope.hasSubmitted = true;
        gsnProfile.login($element.find('#usernameField').val(), $element.find('#passwordField').val());
      };
      $scope.activate();

      //#region Internal Methods        
      //#endregion
    }
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnModal', ['$compile', 'gsnApi', '$timeout', '$location', '$window', '$rootScope', function ($compile, gsnApi, $timeout, $location, $window, $rootScope) {
    // Usage: to show a modal
    // 
    // Creates: 2013-12-20 TomN
    // 
    var directive = {
      link: link,
      scope: true,
      restrict: 'AE'
    };

    $rootScope.$on('gsnevent:closemodal', function () {
      angular.element('.myModalForm').modal('hide');
    });

    return directive;

    function link(scope, element, attrs) {
      var modalUrl = scope.$eval(attrs.gsnModal);
      var template = '<div class="myModalForm modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalForm" aria-hidden="true"><div class="modal-dialog" data-ng-include="\'' + modalUrl + '\'"></div></div>';
      var $modalElement = null;

      function closeModal() {
        if ($modalElement) {
          $modalElement.find('iframe').each(function () {
            var src = angular.element(this).attr('src');
            angular.element(this).attr('src', null).attr('src', src);
          });
        }
        var modal = angular.element('.myModalForm').modal('hide');

        if (!attrs.showIf) {
          modal.addClass('myModalFormHidden');
        }
      }

      scope.closeModal = closeModal;

      scope.goUrl = function (url, target) {
        if (gsnApi.isNull(target, '') == '_blank') {
          $window.open(url, '');
          return;
        }

        $location.url(url);
        scope.closeModal();
      };

      scope.showModal = showModal;

      function showModal(e) {
        if (e) {
          e.preventDefault();
        }

        angular.element('.myModalFormHidden').remove();
        if (attrs.item) {
          scope.item = scope.$eval(attrs.item);
        }

        $modalElement = angular.element($compile(template)(scope));
        $modalElement.modal('show');

      }

      if (attrs.showIf) {
        scope.$watch(attrs.showIf, function (newValue) {
          if (newValue > 0) {
            $timeout(showModal, 50);
          }
        });
      }

      if (attrs.show) {
        scope.$watch(attrs.show, function (newValue) {
          if (newValue) {
            $timeout(showModal, 550);
          } else {
            $timeout(closeModal, 550);
          }
        });
      }
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('numbersOnly', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input. 
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue === undefined) return '';
          var transformedInput = inputValue.replace(/[^0-9]/g, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    };
  });
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnPartial', ['$timeout', 'gsnStore', 'gsnApi', function ($timeout, gsnStore, gsnApi) {
    // Usage:   bind rss feed to some property
    // 
    // Creates: 2014-01-06
    // 
    var directive = {
      link: link,
      restrict: 'EA',
      scope: true,
    };
    return directive;

    function link(scope, element, attrs) {
      scope.version   = attrs.version || '1';
      scope.activate  = activate;
      scope.notFound  = false;
      scope.hasScript = false;
      scope.partialContents = [];
      scope.firstContent = {};
      scope.searchContentName = gsnApi.isNull(attrs.gsnPartial.replace(/^\/+/gi, ''), '').replace(/[\-]/gi, ' ');
      scope.contentName = angular.lowercase(scope.searchContentName);

      function activate() {
        var contentName = scope.contentName;

        // attempt to retrieve static content remotely
        if (scope.version == '2') {
          gsnStore.getPartial(contentName).then(function (rst) {
            if (rst.success) {
              processData2(rst.response);
            } else {
              scope.notFound = true;
            }
          });
        } else {
          gsnStore.getStaticContent(contentName).then(function(rst) {
            if (rst.success) {
              processData(rst.response);
            } else {
              scope.notFound = true;
            }
          });
        }
      }

      scope.activate();

      //#region Internal Methods        

      function processData2(data) {
         if (data) {
           processData(data.Contents || []);
         }
      }

      function processData(data) {
        var hasScript = false;
        var result = [];
        if (!angular.isArray(data) || gsnApi.isNull(data, []).length <= 0) {
          scope.notFound = true;
          return;
        }

        // make sure we sort the static content correctly
        gsnApi.sortOn(data, 'SortBy');

        // detect for script in all contents so we can render inside of iframe
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          if (item.IsMetaData) continue;
          result.push(item);
          
          if (!hasScript && item.Description) {
            // find scripts
            hasScript = /<\/script>/gi.test(item.Description + '');
          }
        }
        
        scope.hasScript = hasScript;
        
        // make first element
        if (data.length >= 1) {
          scope.firstContent = result[0];
        }

        scope.partialContents = result;
      }
      //#endregion
    }
  }]);
})(angular);
(function (angular, $, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');
  
  myModule.directive('gsnPartialContent', ['$timeout', 'gsnStore', 'gsnApi', function ($timeout, gsnStore, gsnApi) {
    // Usage:   allow for store specific partial content
    // 
    // Creates: 2015-02-26
    // 
    var directive = {
      link: link,
      restrict: 'EA',
      scope: true,
    };
    return directive;

    function link(scope, element, attrs) {
      scope.activate = activate;
      scope.notFound = false;
      scope.partialContents = [];
      scope.contentDetail = {
        url: gsnApi.isNull(attrs.gsnPartialContent.replace(/^\/+/gi, ''), '').replace(/[\-]/gi, ' '),
        name: '',
        subName: ''
      };
      var partialData = { ContentData: {}, ConfigData: {}, ContentList: [] };

      function activate() {
        // parse contentName by forward slash
        var contentNames = scope.contentDetail.url.split('/');
        if (contentNames.length > 1) {
          scope.contentDetail.subName = contentNames[1];
        }

        scope.contentDetail.name = contentNames[0];

        if (scope.contentDetail.url.indexOf('.aspx') > 0) {
          // do nothing for aspx page
          scope.notFound = true;
          return;
        }

        // attempt to retrieve static content remotely
        gsnStore.getPartial(scope.contentDetail.name).then(function (rst) {
          if (rst.success) {
            processData(rst.response);
          } else {
            scope.notFound = true;
          }
        });
      }

      scope.getContentList = function () {
        var result = [];
        for (var i = 0; i < partialData.ContentList.length; i++) {
          var data = result.push(gsnApi.parseStoreSpecificContent(partialData.ContentList[i]));
          if (data.Description) {
            if (gsnApi.isNull(scope.contentDetail.subName, 0).length <= 0) {
              result.push(data);
              continue;
            }

            if (angular.lowercase(data.Headline) == scope.contentDetail.subName || data.SortBy == scope.contentDetail.subName) {
              result.push(data);
            }
          }
        }
        
        return result;
      };

      scope.getContent = function (index) {
        return result.push(gsnApi.parseStoreSpecificContent(partialData.ContentData[index]));
      };

      scope.getConfig = function (name) {
        return gsnApi.parseStoreSpecificContent(partialData.ConfigData[name]);
      };

      scope.getConfigDescription = function (name, defaultValue) {
        var resultObj = scope.getConfig(name).Description;
        return gsnApi.isNull(resultObj, defaultValue);
      };

      scope.activate();

      //#region Internal Methods        
      function processData(data) {
        partialData = gsnApi.parsePartialContentData(data);
        scope.partialContents = scope.getContentList();
      }
      //#endregion
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnPathPixel', ['$sce', 'gsnApi', '$interpolate', '$timeout', function ($sce, gsnApi, $interpolate, $timeout) {
    // Usage: add pixel tracking on a page/path basis
    // 
    // Creates: 2013-12-12 TomN
    // 
    var directive = {
      restrict: 'EA',
      scope: true,
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      var currentPath = '';
      scope.$on('$routeChangeSuccess', function (evt, next, current) {
        var matchPath = angular.lowercase(gsnApi.isNull(attrs.path, ''));

        if (matchPath.length <= 0 || gsnApi.isNull(scope.currentPath, '').indexOf(matchPath) >= 0) {
          if (currentPath == scope.currentPath) {
            return;
          }
          
          $timeout(function() {
            element.html('');
            currentPath = scope.currentPath;
            scope.ProfileId = gsnApi.getProfileId();
            scope.CACHEBUSTER = new Date().getTime();

            // profileid is required
            if (scope.ProfileId <= 0) {
              if (attrs.gsnPathPixel.indexOf('ProfileId') > 0) return;
            }

            scope.StoreId = gsnApi.getSelectedStoreId();
            scope.ChainId = gsnApi.getChainId();
            var url = $sce.trustAsResourceUrl($interpolate(attrs.gsnPathPixel.replace(/\[+/gi, '{{').replace(/\]+/gi, '}}'))(scope));
            element.html('<img src="' + url + '" style="visibility: hidden !important; width: 0px; height: 0px; display: none !important; opacity: 0 !important;" class="trackingPixel hidden"/>');
          }, 50);
        }
      });
    }
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive("gsnPopover", ['$window', '$interpolate', '$timeout', function ($window, $interpolate, $timeout) {
    // Usage:   provide mouse hover capability
    // 
    // Creates: 2014-01-16
    // 
    var directive = {
      link: link,
      restrict: 'AE'
    };
    return directive;

    function link(scope, element, attrs) {
      var text = '',
          title = attrs.title || '';

      // wait until finish interpolation
      $timeout(function () {
        text = angular.element(attrs.selector).html() || '';
      }, 50);

      element.qtip({
        content: {
          text: function () {
            var rst = $interpolate('<div>' + text + '</div>')(scope).replace('data-ng-src', 'src');
            return rst;
          },
          title: function () {
            var rst = $interpolate('<div>' + title + '</div>')(scope).replace('data-ng-src', 'src');
            return (rst.replace(/\s+/gi, '').length <= 0) ? null : rst;
          }
        },
        style: {
          classes: attrs.classes || 'qtip-light qtip-rounded qtip-shadow'
        },
        show: {
          event: 'click mouseover',
          solo: true
        },
        hide: {
          distance: 1500
        },
        position: {
          // my: 'bottom left', 
          at: 'bottom left'
        }
      });

      scope.$on("$destroy", function () {
        element.qtip('destroy', true); // Immediately destroy all tooltips belonging to the selected elements
      });
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnProfileInfo', ['gsnApi', 'gsnProfile', function (gsnApi, gsnProfile) {
    // Usage: add profile info header
    // 
    // Creates: 2013-12-12 TomN
    // 
    var directive = {
      restrict: 'EA',
      scope: true,
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      function setProfileData() {
        gsnProfile.getProfile().then(function (rst) {
          if (rst.success) {
            //if (scope.profile != rst.response) {
              scope.profile = rst.response;
              element.html('');
              var html = '<p>welcome, ' + scope.profile.FirstName + ' ' + scope.profile.LastName + '</p>';
              if (scope.profile.FacebookUserId) {
                html = '<a href="/profile"><img alt="temp customer image" class="accountImage" src="http:\/\/graph.facebook.com\/' + scope.profile.FacebookUserId + '\/picture?type=small" \/><\/a>' + html;
              }
              element.html(html);
            //}
          }
        });
      }

      setProfileData();
      scope.$on('gsnevent:profile-load-success', setProfileData);
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnProfilePixel', ['$sce', 'gsnApi', '$interpolate', '$timeout', function ($sce, gsnApi, $interpolate, $timeout) {
    // Usage: add 3rd party pixel tracking on a profile basis
    // 
    // Creates: 2013-12-12 TomN
    // 
    var directive = {
      restrict: 'EA',
      scope: true,
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      scope.$watch(gsnApi.getProfileId, function (newValue) {
        $timeout(function() {
          element.html('');
          scope.CACHEBUSTER = new Date().getTime();
          scope.ProfileId = newValue;
          scope.StoreId = gsnApi.getSelectedStoreId();
          scope.ChainId = gsnApi.getChainId();
          var url = $sce.trustAsResourceUrl($interpolate(attrs.gsnProfilePixel.replace(/\[+/gi, '{{').replace(/\]+/gi, '}}'))(scope));

          element.html('<img src="' + url + '" style="visibility: hidden !important; width: 0px; height: 0px; display: none !important; opacity: 0 !important;" class="trackingPixel hidden"/>');
        }, 50);
      });
    }
  }]);
})(angular);
(function (window, angular, undefined) {
  'use strict';

  angular.module('gsn.core').directive('gsnRedirect', ['$routeParams', 'gsnApi', '$location', 'gsnStore', function ($routeParams, gsnApi, $location, gsnStore) {
    // Usage:  To support redirecting
    // 
    // Creates: 2014-02-03 TomN
    // 
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      
      function followRedirect() {
        var toUrl = gsnApi.isNull($routeParams[attrs.gsnRedirect], '/');

        // This is not injectable, but we define as directive here so we can unit test the controllers
        // so this is bad code, but I don't know how else we going to support 3rd party iframe requirement WTF?
        if (window.top) {
          window.top.location = toUrl;
        } else {
          $location.path(toUrl);
        }
      }

      var storeNumber = $routeParams.storenumber;
      if (storeNumber) {
        scope.$on('gsnevent:store-setid', followRedirect);
        
        // select the store before following redirect
        gsnStore.getStores().then(function (rsp) {
          var storeByNumber = gsnApi.mapObject(rsp.response, 'StoreNumber');
          var store = storeByNumber[storeNumber];
          if (store) {
            gsnApi.setSelectedStoreId(store.StoreId);
          }
        });
        return;
      }
      
      followRedirect();
    }
    
  }]);
})(window, angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnRedirectOnResize', ['$window', '$location', function ($window, $location) {
    var directive = {
      restrict: 'EA',
      scope: true,
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      $(window).resize(function () {
        if (angular.element($window).width() < attrs.min) {
          $location.url(attrs.url);
        }
      });
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnRssFeed', ['FeedService', '$timeout', function (FeedService, $timeout) {
    // Usage:   bind rss feed to some property
    // 
    // Creates: 2014-01-06
    // 
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      FeedService.parseFeed(attrs.gsnRssFeed, attrs.maxResult).then(function (res) {
        scope[attrs.ngModel] = res.data.responseData.feed;
      });
    }
  }]);
})(angular);
(function (angular, undefined) {

  angular.module('gsn.core')
      .directive('gsnShoppingList', ['gsnApi', '$timeout', 'gsnProfile', '$routeParams', '$rootScope', 'gsnStore', '$location', 'gsnPrinter', '$filter',
          function (gsnApi, $timeout, gsnProfile, $routeParams, $rootScope, gsnStore, $location, gsnPrinter, $filter) {
            // Usage:  use to manipulate a shopping list on the UI
            // 
            // Creates: 2014-01-13 TomN
            // 
            var directive = {
              restrict: 'EA',
              scope: true,
              controller: ['$scope', '$element', '$attrs', controller],
              link: link
            };
            return directive;

            function link(scope, element, attrs) {
              scope.reloadShoppingList();
            }

            function controller($scope, $element, $attrs) {
              $scope.coupons = [];
              $scope.manufacturerCoupons = [];
              $scope.instoreCoupons = [];
              $scope.addString = '';
              $scope.pluginItemCount = 10;
              $scope.topitems = [];
              $scope.hasInitializePrinter = false;
              $scope.totalQuantity = 0;
              $scope.mylist = null;
              $scope.groupBy = 'CategoryName';
              $scope.currentDate = new Date();
              $scope.shoppinglistsaved = 0;
              $scope.shoppinglistdeleted = 0;
              $scope.shoppinglistcreated = 0;
              $scope.circular = gsnStore.getCircularData();

              $scope.reloadShoppingList = function (shoppingListId) {
                $timeout(function () {
                  if ($attrs.gsnShoppingList == 'savedlists') {
                    if ($scope.getSelectedShoppingListId) {
                      shoppingListId = $scope.getSelectedShoppingListId();
                    }
                  }

                  $scope.mylist = $scope.doMassageList(gsnProfile.getShoppingList(shoppingListId));

                  if ($scope.mylist) {
                    if (!$scope.mylist.hasLoaded()) {
                      $scope.doRefreshList();
                    }
                  }
                  else if (shoppingListId) {
                    // if not saved list and current shopping list, then 
                    if ($attrs.gsnShoppingList != 'savedlists' && shoppingListId == gsnApi.getShoppingListId()) {
                      $scope.mylist = gsnProfile.getShoppingList();
                      $scope.doRefreshList();
                    }
                  }

                }, 50);
              };

              $scope.doMassageList = function (list) {
                if (gsnApi.isNull(list, null) === null) return null;

                $scope.coupons.length = 0;
                $scope.manufacturerCoupons.length = 0;
                $scope.totalQuantity = 0;
                $scope.title = list.getTitle();
                $scope.currentDate = new Date();
                if (gsnApi.isNull($scope.newTitle, null) === null) {
                  if (list.getStatus() > 1) {
                    $scope.newTitle = $scope.title;
                  } else {
                    $scope.newTitle = null;
                  }
                }
                list.topitems = [];
                list.items = gsnApi.isNull(list.items, []);
                list.items.length = 0;

                // calculate the grouping
                // and make list calculation 
                var items = list.allItems(),
                    totalQuantity = 0;

                if (gsnApi.isNull(list.items, []).length > 0) {
                  items = list.items;
                } else {
                  list.items = items;
                }

                var categories = gsnStore.getCategories();

                angular.forEach(items, function (item, idx) {
                  if (gsnApi.isNull(item.CategoryName, null) === null) {
                    // in javascript, null is actually != to undefined
                    var cat = categories[item.CategoryId || null];
                    if (cat) {
                      item.CategoryName = gsnApi.isNull(cat.CategoryName, '');
                    } else {
                      item.CategoryName = gsnApi.isNull(item.CategoryName, '');
                    }
                  }

                  item.BrandName = gsnApi.isNull(item.BrandName, '');

                  if (item.IsCoupon) {

                    // since the server does not return a product code, we get it from local coupon index
                    var coupon = gsnStore.getCoupon(item.ItemId, item.ItemTypeId);
                    if (coupon) {
                      item.ProductCode = coupon.ProductCode;
                      item.StartDate = coupon.StartDate;
                      item.EndDate = coupon.EndDate;

                      // Get the temp quantity.
                      var tmpQuantity = gsnApi.isNaN(parseInt(coupon.Quantity), 0);

                      // If the temp quantity is zero, then set one.
                      item.Quantity = (tmpQuantity > 0)? tmpQuantity : 1;                          


                      if (item.ItemTypeId == 13) {
                        item.CategoryName = 'Digital Coupon';
                      }

                      // Push the coupons
                      if (item.ItemTypeId == 10) {
                        $scope.instoreCoupons.push(coupon);
                      }
                    }

                    $scope.coupons.push(item);
                    if (item.ItemTypeId == 2) {
                      $scope.manufacturerCoupons.push(item);
                    }
                  }

                  if (gsnApi.isNull(item.PriceString, '').length <= 0) {
                    if (item.Price) {
                      item.PriceString = '$' + parseFloat(item.Price).toFixed(2);
                    }
                  }

                  totalQuantity += gsnApi.isNaN(parseInt(item.Quantity), 0);
                  item.NewQuantity = item.Quantity;
                  item.selected = false;
                  item.zIndex = 900 - idx;
                });

                $scope.totalQuantity = totalQuantity;
                // only get topN for current list
                if (list.ShoppingListId == gsnApi.getShoppingListId()) {
                  // get top N items
                  gsnApi.sortOn(items, 'Order');
                  list.topitems = angular.copy(items);

                  if (items.length > $scope.pluginItemCount) {
                    list.topitems = list.topitems.splice(items.length - $scope.pluginItemCount);
                  }

                  list.topitems.reverse();
                  $scope.topitems = list.topitems;
                  $rootScope.$broadcast('gsnevent:shoppinglist-itemtops', $scope.topitems);
                }

                var newAllItems = [];
                if (gsnApi.isNull($scope.groupBy, '').length <= 0) {
                  newAllItems = [{ key: '', items: items }];
                } else {
                  newAllItems = gsnApi.groupBy(items, $scope.groupBy, function (item) {
                    gsnApi.sortOn(item.items, 'Description');
                  });
                }

                for (var i = 0; i < newAllItems.length; i++) {

                  var fitems = newAllItems[i].items;

                  // use scope search because it might have changed during timeout
                  if (gsnApi.isNull($scope.listSearch, '').length <= 0) {
                    fitems = $filter("filter")(fitems, $scope.listSearch);
                  }

                  newAllItems[i].fitems = fitems;
                }

                $scope.allItems = newAllItems;
                $rootScope.$broadcast('gsnevent:gsnshoppinglist-itemavailable');
                return list;
              };

              $scope.doUpdateQuantity = function (item) {
                var list = $scope.mylist;
                item.OldQuantity = item.Quantity;
                item.Quantity = parseInt(item.NewQuantity);
                list.syncItem(item);
              };

              $scope.doAddSelected = function () {
                var list = $scope.mylist;
                var toAdd = [];
                angular.forEach(list.items, function (item, k) {
                  if (true === item.selected) {
                    toAdd.push(item);
                  }
                });
                
                //  Issue: The previous version of this code was adding to the list regardless of if it was previously added. Causing the count to be off.
                angular.forEach(toAdd, function (item, k) {
                  if (false === gsnProfile.isOnList(item)) {
                    gsnProfile.addItem(item);
                  }
                  else {
                    // Remove the selection state from the item, it was already on the list.
                    item.selected = false;
                  }
                });
              };

              $scope.doDeleteList = function () {
                gsnProfile.deleteShoppingList($scope.mylist);

                // cause this list to refresh
                $scope.$emit('gsnevent:savedlists-deleted', $scope.mylist);
              };

              $scope.doAddOwnItem = function () {
                var addString = gsnApi.isNull($scope.addString, '');
                if (addString.length < 1) {
                  return;
                }

                gsnProfile.addItem({ ItemId: null, Description: $scope.addString, ItemTypeId: 6, Quantity: 1 });
                $scope.addString = '';

                // refresh list
                $scope.doMassageList(list);
              };

              $scope.doRemoveSelected = function () {
                var list = $scope.mylist;
                var toRemove = [];
                angular.forEach(list.items, function (v, k) {
                  if (v.selected) {
                    toRemove.push(v);
                  }
                });

                list.removeItems(toRemove).then(function () {
                  // refresh list
                  $scope.doMassageList(list);
                });
              };

              $scope.doSaveList = function (newTitle) {
                // save list just means to change the title
                if (!gsnApi.isLoggedIn()) {
                  // fallback message
                  $rootScope.$broadcast('gsnevent:login-required');
                  return;
                }

                var list = $scope.mylist;
                list.setTitle(newTitle).then(function (response) {
                });
              };

              $scope.doSelectAll = function () {
                var list = $scope.mylist;
                if (list.items[0]) {
                  var selected = (list.items[0].selected) ? false : true;
                  angular.forEach(list.items, function (v, k) {
                    v.selected = selected;
                  });
                }
              };

              /* begin item menu actions */
              $scope.doItemRemove = function (item) {
                var list = $scope.mylist;
                list.removeItem(item);
                $scope.doMassageList(list);
              };

              $scope.doItemAddToCurrentList = function (item) {
                if (gsn.isNull(item, null) !== null) {

                  //var mainList = gsnProfile.getShoppingList();
                  gsnProfile.addItem(item);
                }
              };

              $scope.doRefreshList = function () {
                if ($scope.mylist) {
                  $scope.mylist.updateShoppingList().then(function (response) {
                    if (response.success) {
                      // refresh
                      $scope.doMassageList($scope.mylist);
                    }
                  });
                }
              };

              function handleShoppingListEvent(event, shoppingList) {
                // ignore bad events
                if (gsnApi.isNull(shoppingList, null) === null) {
                  return;
                }

                if (gsnApi.isNull($scope.mylist) || ($attrs.gsnShoppingList == 'savedlists')) {
                  // current list is null, reload    
                  $scope.reloadShoppingList();
                  return;
                }

                if (gsnApi.isNull($scope.mylist, null) === null) {
                  $scope.reloadShoppingList(shoppingList.ShoppingListId);
                  return;
                }

                // detect list changed, update the list
                if (shoppingList.ShoppingListId == $scope.mylist.ShoppingListId) {
                  $scope.reloadShoppingList($scope.mylist.ShoppingListId);
                }
              }

              $scope.$on('gsnevent:shoppinglist-changed', handleShoppingListEvent);
              $scope.$on('gsnevent:shoppinglist-loaded', handleShoppingListEvent);
              $scope.$on('gsnevent:shoppinglist-page-loaded', handleShoppingListEvent);
              $scope.$on('gsnevent:savedlists-selected', handleShoppingListEvent);
             
              $scope.$on('gsnevent:circular-loaded', function (event, data) {
                if (data.success) {
                  $scope.reloadShoppingList();
                }
                
                $scope.circular = gsnStore.getCircularData();
              });

              // Events for modal confirmation. 
              $scope.$on('gsnevent:shopping-list-saved', function ()
              {
                $scope.shoppinglistsaved++;
              });

              $scope.$on('gsnevent:shopping-list-deleted', function () {
                $scope.shoppinglistdeleted++;
              });

              // Per Request: signal that the list has been created.
              $scope.$on('gsnevent:shopping-list-created', function (event, data) {
                $scope.shoppinglistcreated++;
              });

              $scope.$on('gsnevent:gsnshoppinglist-itemavailable', function (event) {
                if ($scope.manufacturerCoupons.length <= 0) return;
                if ($scope.hasInitializePrinter) return;

                if ($scope.currentPath.indexOf('print') > 0) {
                  $scope.hasInitializePrinter = true;
                  // initialize printer
                  if ($scope.manufacturerCoupons.length > 0) {
                    if ($scope.canPrint) {
                      gsnPrinter.initPrinter($scope.manufacturerCoupons);
                    }
                  }
                }
              });
            }
          }]);

})(angular);

(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnSiteSearch', ['$routeParams', '$timeout', 'gsnApi', function ($routeParams, $timeout, gsnApi) {
    // Usage:   site search control
    // 
    // Creates: 2014-01-09
    // 
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      $timeout(function () {
        google.load('search', '1', {
          language: 'en', callback: function () {
            var customSearchControl = new google.search.CustomSearchControl(gsnApi.getGoogleSiteSearchCode());
            customSearchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
            customSearchControl.setLinkTarget(google.search.Search.LINK_TARGET_SELF);
            customSearchControl.draw(attrs.id);
            if (attrs.query) {
              customSearchControl.execute($routeParams[attrs.query]);
            }
          }
        });
      }, 500);
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnSpinner', ['$window', '$timeout', function ($window, $timeout) {
    // Usage:   Display spinner
    // 
    // Creates: 2014-01-06
    // 
    /*var opts = {
          lines: 13, // The number of lines to draw
          length: 20, // The length of each line
          width: 10, // The line thickness
          radius: 30, // The radius of the inner circle
          corners: 1, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          direction: 1, // 1: clockwise, -1: counterclockwise
          color: '#000', // #rgb or #rrggbb or array of colors
          speed: 1, // Rounds per second
          trail: 60, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: false, // Whether to use hardware acceleration
          className: 'spinner', // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: 'auto', // Top position relative to parent in px
          left: 'auto', // Left position relative to parent in px
          stopDelay: 200 // delay before matching ng-show-if
        };
    */
    var directive = {
      link: link,
      restrict: 'A',
      scope: true
    };
    return directive;

    function link(scope, element, attrs) {
      var options = scope.$eval(attrs.gsnSpinner);
      options.stopDelay = options.stopDelay || 200;
      
      function stopSpinner() {
        if (scope.gsnSpinner) {
          scope.gsnSpinner.stop();
          scope.gsnSpinner = null;
        }
      }

      scope.$watch(attrs.showIf, function (newValue) {
        stopSpinner();
        if (newValue) {
          scope.gsnSpinner = new $window.Spinner(options);
          scope.gsnSpinner.spin(element[0]);

          if (options.timeout) {
            $timeout(function () {
              var val = scope[attrs.showIf];
              if (typeof (val) == 'boolean') {
                // this should cause it to stop spinner
                scope[attrs.showIf] = false;
              } else {
                $timeout(stopSpinner, options.stopDelay);
              }
            }, options.timeout);
          }
        }
      }, true);

      scope.$on('$destroy', function () {
        $timeout(stopSpinner, options.stopDelay);
      });
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive("gsnSticky", ['gsnApi', '$timeout', '$window', function (gsnApi, $timeout, $window) {
    // Usage: make an element sticky 
    // 
    // Creates: 2014-06-13 TomN
    // 
    var directive = {
      restrict: 'EA',
      scope: true,
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      var $win = angular.element($window);
      var myWidth = 0;
      var offsetTop = gsnApi.isNaN(parseInt(attrs.offsetTop), 20);
      var timeout = gsnApi.isNaN(parseInt(attrs.timeout), 2000);

      if (attrs.fixedWidth) {
        if (element.width() > 0) {
          myWidth = element.width();
        }
      }
      
      // make sure UI is completed before taking first snapshot
      $timeout(function () {
        if (scope._stickyElements === undefined) {
          scope._stickyElements = [];

          $win.bind("scroll", function (e) {
            var pos = $win.scrollTop();
            
            angular.forEach(scope._stickyElements, function(item, k) {
              var bottom = gsnApi.isNaN(parseInt(attrs.bottom), 0);
              var top = gsnApi.isNaN(parseInt(attrs.top), 0);
              
              // if screen is too small, don't do sticky
              if ($win.height() < (top + bottom + element.height())) {
                item.isStuck = true;
                pos = -1;
              }

              if (!item.isStuck && pos > (item.start + offsetTop)) {
                item.element.addClass("stuck");
                if (myWidth > 0) {
                  item.element.css({ top: top + 'px', width: myWidth + 'px' });
                } else {
                  item.element.css({ top: top + 'px' });
                }

                item.isStuck = true;
              } else if (item.isStuck && pos <= item.start) {
                item.element.removeClass("stuck");
                item.element.css({ top: null });
                item.isStuck = false;
              }
            });
          });

          var recheckPositions = function () {
            for (var i = 0; i < scope._stickyElements.length; i++) {
              var myItem = scope._stickyElements[i];
              if (!myItem.isStuck) {
                myItem.start = myItem.element.offset().top;
              }
            }
          };

          $win.bind("load", recheckPositions);
          $win.bind("resize", recheckPositions);
        }

        var newItem = {
          element: element,
          isStuck: false,
          start: element.offset().top
        };

        scope._stickyElements.push(newItem);
      }, timeout);

    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive("gsnStickyWithAnchor", ['$window', '$timeout', function ($window, $timeout) {

    var directive = {
      link: link,
      restrict: 'A',
    };
    return directive;

    function link(scope, element, attrs) {
      var anchor = angular.element('<div class="sticky-anchor"></div>');
      angular.element(element[0]).before(anchor);
      if (attrs.bottom) {
        element.css({ 'bottom': parseInt(attrs.bottom) });
      }
      if (attrs.top) {
        element.css({ 'top': parseInt(attrs.top) });
      }

      function checkSticky() {
        var scrollTop = angular.element($window).scrollTop();
        var screenHight = angular.element($window).height();
        var isScticky = false;
        if (attrs.bottom) {
          isScticky = (scrollTop + screenHight < angular.element(anchor).offset().top + parseInt(attrs.bottom));
        }
        
        if (attrs.top) {
          isScticky = (scrollTop > angular.element(anchor).offset().top - parseInt(attrs.top));
        }
        
        element.css({ 'position': isScticky ? 'fixed' : 'relative' });
      }

      angular.element($window).on('scroll', checkSticky);
      
      scope.$watch(attrs.reloadOnChange, function () {
        $timeout(checkSticky, 300);
      });
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnStoreInfo', ['gsnApi', 'gsnStore', '$interpolate', function (gsnApi, gsnStore, $interpolate) {
    // Usage: optimize store info binding for better IE8 support
    // 
    // Creates: 2014-01-30 TomN
    // 
    var directive = {
      restrict: 'EA',
      scope: true,
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      var compiledTemplate = $interpolate(attrs.gsnStoreInfo.replace(/\[+/gi, "{{").replace(/\]+/gi, "}}"));
      function setStoreData() {
        var storeId = gsnApi.isNull(gsnApi.getSelectedStoreId(), 0);
        if (storeId > 0) {
          gsnStore.getStore().then(function (store) {
            if (store) {
              scope.store = store;

              var data = compiledTemplate(scope);

              element.html(data);
            }
          });
        }
      }

      setStoreData();
      scope.$on('gsnevent:store-setid', setStoreData);
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnTextCapture', ['$window', '$timeout', function ($window, $timeout) {
    // Usage:   bind text back into some property
    // 
    // Creates: 2014-01-06
    // 
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      var timeout = parseInt(attrs.timeout);
      var continousMonitor = timeout > 0;

      if (timeout <= 0) {
        timeout = 200;
      }

      var refresh = function () {
        scope.$apply(attrs.gsnTextCapture + ' = "' + element.text().replace(/"/g, '\\"').replace(/(ie8newlinehack)/g, '\r\n') + '"');
        var val = scope.$eval(attrs.gsnTextCapture);
        var noData = val.replace(/\s+/gi, '').length <= 0;
        if (noData) {
          $timeout(refresh, timeout);
          return;
        }

        if (continousMonitor) {
          $timeout(refresh, timeout);
        }
      };

      $timeout(refresh, timeout);
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnTwitterShare', ['$timeout', function ($timeout) {
    // Usage:   display twitter timeline
    // 
    // Creates: 2014-01-06
    // 
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      var defaults = {
        count: 'none'
      };
      
      function loadShare() {
        if (typeof twttr !== "undefined" && twttr !== null) {
          var options = scope.$eval(attrs.gsnTwitterShare);
          angular.extend(defaults, options);
          twttr.widgets.createShareButton(
            attrs.url,
            element[0],
            function(el) {
            }, defaults
          );
        } else {
          $timeout(loadShare, 500);
        }
      }

      $timeout(loadShare, 500);
    }
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnTwitterTimeline', ['$timeout', function ($timeout) {
    // Usage:   display twitter timeline
    // 
    // Creates: 2014-01-06
    // 
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {

      element.html('<a class="twitter-timeline" href="' + attrs.href + '" data-widget-id="' + attrs.gsnTwitterTimeline + '">' + attrs.title + '</a>');

      function loadTimeline() {
        if (typeof twttr !== "undefined" && twttr !== null) {
          twttr.widgets.load();
        } else {
          $timeout(loadTimeline, 500);
        }
      }

      $timeout(loadTimeline, 500);
    }
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnValidUser', ['$http', '$timeout', 'gsnApi', function ($http, $timeout, gsnApi) {
    // Usage: for validating if email is taken.  gsn-valid-email attribute
    // 
    // Creates: 2013-12-25
    // 
    var directive = {
      link: link,
      restrict: 'A',
      require: 'ngModel'
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      var toId;

      element.blur(function (evt) {
        var value = ctrl.$viewValue;
        if (gsnApi.isNull(value, '').length <= 0) {
          ctrl.$setValidity('gsnValidUser', gsnApi.isNull(attrs.gsnValidUser, '') != 'required');
          return;
        }

        // if there was a previous attempt, stop it.
        if (toId) {
          if (toId.$$timeoutId) {
            $timeout.cancel(toId.$$timeoutId);
          }
        }

        // if this is an email field, validate that email is valid
        // true mean that there is an error
        if (ctrl.$error.email) {
          ctrl.$setValidity('gsnValidUser', false);
          return;
        }

        // start a new attempt with a delay to keep it from
        // getting too "chatty".
        toId = $timeout(function () {

          gsnApi.getAccessToken().then(function () {
            var url = gsnApi.getProfileApiUrl() + '/HasUsername?username=' + encodeURIComponent(value);
            // call to some API that returns { isValid: true } or { isValid: false }
            $http.get(url, { headers: gsnApi.getApiHeaders() }).success(function (data) {
              toId = null;
              //set the validity of the field
              ctrl.$setValidity('gsnValidUser', data != 'true');
            }).error(function (response) {
              toId = null;
            });
          });
        }, 200);
      });
    }
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('gsnWatch', [function () {
    // Usage: add monitoring capability
    // 
    // Creates: 2013-12-12 TomN
    // 
    var directive = {
      restrict: 'EA',
      scope: true,
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      var modelVal = attrs.model;
      if (typeof (modelVal) === 'undefined') {
        modelVal = '{}';
      }

      scope.model = scope.$eval(modelVal);
      var data = scope.$eval(attrs.gsnWatch);
      angular.forEach(data, function (item, key) {
        scope.$watch(item, function (newValue) {
          scope.model[key] = newValue;
        });
      });
    }
  }]);

})(angular);
(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  var ngModifyElementDirective = function (options) {
    // Usage: add gsnTitle, gsnMetaViewPort, gsnMetaDescription, gsnMetaKeywords, gsnMetaAuthor, gsnMetaGoogleSiteVerification
    // 
    // Creates: 2013-12-12 TomN
    // 
    return myModule.directive(options.name, [
      function () {
        return {
          restrict: 'A',
          link: function (scope, e, attrs) {
            var modifierName = '$' + options.name;

            // Disable parent modifier so that it doesn't
            // overwrite our changes.
            var parentModifier = scope[modifierName];
            var parentModifierWasEnabled;
            if (parentModifier) {
              parentModifierWasEnabled = parentModifier.isEnabled;
              parentModifier.isEnabled = false;
            }

            // Make sure we haven't attached this directive
            // to this scope yet.
            if (scope.hasOwnProperty(modifierName)) {
              throw {
                name: 'ScopeError',
                message: 'Multiple copies of ' + options.name + ' modifier in same scope'
              };
            }

            // Attach to the current scope.
            var currentModifier = {
              isEnabled: true
            };
            scope[modifierName] = currentModifier;

            var $element = angular.element(options.selector);

            // Keep track of the original value, so that it
            // can be restored later.
            var originalValue = options.get($element);

            // Watch for changes to the interpolation, and reflect
            // them into the DOM.
            var currentValue = originalValue;
            attrs.$observe(options.name, function (newValue, oldValue) {
              // Don't stomp on child modifications if *we* disabled.
              if (currentModifier.isEnabled) {
                currentValue = newValue;
                options.set($element, newValue, oldValue);
              }
            });

            // When we go out of scope restore the original value.
            scope.$on('$destroy', function () {
              options.set($element, originalValue, currentValue);

              // Turn the parent back on, if it indeed was on.
              if (parentModifier) {
                parentModifier.isEnabled = parentModifierWasEnabled;
              }
            });

          }
        };
      }
    ]);
  };

  // page title
  ngModifyElementDirective({
    name: 'gsnTitle',
    selector: 'title',
    get: function (e) {
      return e.text();
    },
    set: function (e, v) {
      return e.text(v);
    }
  });

  // viewpoint
  ngModifyElementDirective({
    name: 'gsnMetaViewport',
    selector: 'meta[name="viewport"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });

  // author
  ngModifyElementDirective({
    name: 'gsnMetaAuthor',
    selector: 'meta[name="author"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });

  // description
  ngModifyElementDirective({
    name: 'gsnMetaDescription',
    selector: 'meta[name="description"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });

  // keywords
  ngModifyElementDirective({
    name: 'gsnMetaKeywords',
    selector: 'meta[name="keywords"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });

  // google site verification
  ngModifyElementDirective({
    name: 'gsnMetaGoogleSiteVerification',
    selector: 'meta[name="google-site-verification"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });

  ngModifyElementDirective({
    name: 'gsnFavIcon',
    selector: 'link[rel="shortcut icon"]',
    get: function (e) {
      return e.attr('href');
    },
    set: function (e, v) {
      return e.attr('href', v);
    }
  });

  // Facebook OpenGraph integration
  //  og:title - The title of your object as it should appear within the graph, e.g., "The Rock". 
  ngModifyElementDirective({
    name: 'gsnOgTitle',
    selector: 'meta[name="og:title"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });
  
  // og:type - The type of your object, e.g., "movie". See the complete list of supported types.
  ngModifyElementDirective({
    name: 'gsnOgType',
    selector: 'meta[name="og:type"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });
  
  // og:image - An image URL which should represent your object within the graph. The image must be at least 50px by 50px and have a maximum aspect ratio of 3:1.
  ngModifyElementDirective({
    name: 'gsnOgImage',
    selector: 'meta[name="og:image"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });
  
  // og:url - The canonical URL of your object that will be used as its permanent ID in the graph.
  ngModifyElementDirective({
    name: 'gsnOgUrl',
    selector: 'meta[name="og:url"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });
  
  // og:site_name - A human-readable name for your site, e.g., "IMDb" 
  ngModifyElementDirective({
    name: 'gsnOgSiteName',
    selector: 'meta[name="og:site_name"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });
  
  // fb:admins or fb:app_id - A comma-separated list of either Facebook user IDs or a Facebook Platform application ID that administers this page.
  ngModifyElementDirective({
    name: 'gsnFbAdmins',
    selector: 'meta[name="fb:admins"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });
  
  ngModifyElementDirective({
    name: 'gsnFbAppId',
    selector: 'meta[name="fb:app_id"]',
    get: function (e) {
      return e.attr('content');
    },
    set: function (e, v) {
      return e.attr('content', v);
    }
  });
})(angular);
(function (angular, undefined) {
  var createDirective, module, pluginName, _i, _len, _ref;

  module = angular.module('gsn.core');

  createDirective = function (name) {
    return module.directive(name, ['$timeout', function ($timeout) {
      return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
          function loadPlugin() {
            if (typeof FB !== "undefined" && FB !== null) {
              FB.XFBML.parse(element.parent()[0]);
            } else {
              $timeout(loadPlugin, 500);
            }
          }
          
          $timeout(loadPlugin, 500);
        }
      };
    }]);
  };

  _ref = ['fbActivity', 'fbComments', 'fbFacepile', 'fbLike', 'fbLikeBox', 'fbLiveStream', 'fbLoginButton', 'fbName', 'fbProfilePic', 'fbRecommendations'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    pluginName = _ref[_i];
    createDirective(pluginName);
  }

})(angular);

(function (angular, undefined) {
  'use strict';
  var myModule = angular.module('gsn.core');

  myModule.directive('placeholder', ['$timeout', 'gsnApi', function ($timeout, gsnApi) {
    return function (scope, el, attrs) {
      var settings = {
        cssClass: 'placeholder',
        excludedAttrs: ['placeholder', 'name', 'id', 'ng-model', 'type']
      },
          placeholderText = attrs.placeholder,
          isPassword = attrs.type === 'password',
          hasNativeSupport = 'placeholder' in document.createElement('input') && 'placeholder' in document.createElement('textarea'),
          setPlaceholder, removePlaceholder, copyAttrs, fakePassword;

      if (hasNativeSupport) return;

      copyAttrs = function () {
        var a = {};
        gsnApi.forEach(attrs.$attr, function (i, attrName) {
          if (!gsn.contains(settings.excludedAttrs, attrName)) {
            a[attrName] = attrs[attrName];
          }
        });
        return a;
      };

      var createFakePassword = function () {
        return angular.element('<input>', gsnApi.extend(copyAttrs(), {
          'type': 'text',
          'value': placeholderText
        }))
            .addClass(settings.cssClass)
            .bind('focus', function () {
              removePlaceholder();
            })
            .insertBefore(el);
      };

      if (isPassword) {
        fakePassword = createFakePassword();
        setPlaceholder = function () {
          if (!el.val()) {
            fakePassword.show();
            el.hide();
          }
        };
        removePlaceholder = function () {
          if (fakePassword.is(':visible')) {
            fakePassword.hide();
            el.show().focus();
          }
        };
      } else {
        setPlaceholder = function () {
          if (!el.val()) {
            el.val(placeholderText);

            $timeout(function () {
              el.addClass(settings.cssClass); /*hint, IE does not aplly style without timeout*/
            }, 0);
          }
        };

        removePlaceholder = function () {
          if (el.hasClass(settings.cssClass)) {
            el.val('').select(); /*trick IE, because after tabbing focus to input, there is no cursor in it*/
            el.removeClass(settings.cssClass);
          }
        };
      }

      el.on('focus', removePlaceholder).on('blur', setPlaceholder);
      $timeout(function () {
        el.trigger('blur');
      }, 0);


      scope.$watch(attrs.ngModel, function (value) {
        if (gsnApi.isNull(value).length <= 0) {
          if (!el.is(':focus')) el.trigger('blur');
        } else {
          if (el.hasClass(settings.cssClass)) el.removeClass(settings.cssClass);
        }
      });

    };
  }]);
})(angular);
(function (angular, undefined) {
  'use strict';

  // TODO: Refactor this thing when there are time, too much globally WTF in here - the result of rushing to release
  var myDirectiveName = 'ctrlBody';

  angular.module('gsn.core')
    .controller(myDirectiveName, ['$scope', '$window', '$location', '$timeout', '$route', 'gsnApi', 'gsnProfile', 'gsnStore', '$rootScope', 'Facebook', '$analytics', 'gsnYoutech', myController])
    .directive(myDirectiveName, myDirective);

  function myDirective() {
    var directive = {
      restrict: 'EA',
      scope: true,
      controller: myDirectiveName
    };

    return directive;
  }

  function myController($scope, $window, $location, $timeout, $route, gsnApi, gsnProfile, gsnStore, $rootScope, Facebook, $analytics, gsnYoutech) {
    $scope.defaultLayout = $scope.defaultLayout || gsnApi.getThemeUrl('/views/layout.html');
    $scope.currentLayout = $scope.defaultLayout;
    $scope.currentPath = '/';
    $scope.gvm = { loginCounter: 0, menuInactive: false, shoppingListActive: false, profile: {}, noCircular: true, reloadOnStoreSelection: false };
    $scope.youtech = gsnYoutech;
    $scope.search = { site: '', item: '' };
    $scope.facebookReady = false;
    $scope.currentYear = new Date().getFullYear();
    $scope.facebookData = {};
    $scope.hasJustLoggedIn = false;
    $scope.loggedInWithFacebook = false;
    $scope.ChainName = gsnApi.getChainName();
    $scope.isLoggedIn = gsnApi.isLoggedIn();
    $scope.reload = $route.reload;
    $scope.broadcastEvent = $rootScope.$broadcast;
    $scope.goUrl = gsnApi.goUrl;
    $scope.encodeURIComponent = encodeURIComponent;
    $scope.isOnList = gsnProfile.isOnList;
    $scope.printScriptUrl = gsnApi.getApiUrl() + '/ShoppingList/CouponInitScriptFromBrowser/' + gsnApi.getChainId() + '?callbackFunc=showResultOfDetectControl';
    $scope.getShoppingListCount = gsnProfile.getShoppingListCount;

    $scope.validateRegistration = function (rsp) {
      // attempt to authenticate user with facebook
      // get token
      $scope.facebookData.accessToken = rsp.authResponse.accessToken;

      // get email
      Facebook.api('/me', function (response) {
        $scope.facebookData.user = response;

        if (response.email) {
          // if user is already logged in, don't do it again
          if (gsnApi.isLoggedIn()) return;

          // attempt to authenticate
          gsnProfile.loginFacebook(response.email, $scope.facebookData.accessToken);
        }
      });
    };

    $scope.doFacebookLogin = function () {
      Facebook.getLoginStatus(function (response) {
        if (response.status == 'connected') {
          $scope.validateRegistration(response);
        } else {
          Facebook.login(function (rsp) {
            if (rsp.authResponse) {
              $scope.validateRegistration(rsp);
            }
          }, { scope: gsnApi.getFacebookPermission() });
        }
      });
    };

    $scope.doIfLoggedIn = function (callbackFunc) {
      if ($scope.isLoggedIn) {
        callbackFunc();
      } else {
        $scope.gvm.loginCounter++;
      }
    };

    $scope.clearSelection = function (items) {
      angular.forEach(items, function (item) {
        item.selected = false;
      });
    };

    $scope.getBindableItem = function (newItem) {
      var item = angular.copy(newItem);
      item.NewQuantity = item.Quantity || 1;
      var shoppingList = gsnProfile.getShoppingList();
      if (shoppingList) {
        var result = shoppingList.getItem(item);
        return result || item;
      }

      return item;
    };

    $scope.updateBindableItem = function (item) {
      if (item.ItemId) {
        var shoppingList = gsnProfile.getShoppingList();
        if (shoppingList) {
          item.OldQuantity = item.Quantity;
          item.Quantity = parseInt(item.NewQuantity);
          shoppingList.syncItem(item);
        }
      }
    };

    $scope.doSiteSearch = function () {
      $scope.goUrl('/search?q=' + encodeURIComponent($scope.search.site));
    };

    $scope.doItemSearch = function () {
      $scope.goUrl('/product/search?q=' + encodeURIComponent($scope.search.item));
    };

    $scope.getPageCount = gsnApi.getPageCount;

    $scope.getFullPath = gsnApi.getFullPath;

    $scope.goBack = function () {
      /// <summary>Cause browser to go back.</summary>

      if ($scope.currentPath != '/') {
        gsnApi.goBack();
      }
    };

    $scope.decodeServerUrl = function (url) {
      /// <summary>decode url path returned by our server</summary>
      /// <param name="url" type="Object"></param>

      return decodeURIComponent((url + '').replace(/\s+$/, '').replace(/\s+/gi, '-').replace(/(.aspx)$/, ''));
    };

    $scope.logout = function () {
      gsnProfile.logOut();
      $scope.isLoggedIn = gsnApi.isLoggedIn();

      if ($scope.loggedInWithFacebook) {
        $scope.loggedInWithFacebook = false;
        Facebook.logout();
      }

      // reload the page to refresh page status on logout
      if ($scope.currentPath == '/') {
        $route.reload();
      } else {
        $scope.goUrl('/');
      }
    };

    $scope.logoutWithPromt = function () {
      try {
        $scope.goOutPromt(null, '/', $scope.logout, true);
      } catch (e) {
        $scope.logout();
      }

    };

    $scope.doToggleCartItem = function (evt, item, linkedItem) {
      /// <summary>Toggle the shoping list item checked state</summary>
      /// <param name="evt" type="Object">for passing in angular $event</param>
      /// <param name="item" type="Object">shopping list item</param>

      if (item.ItemTypeId == 3) {
        item.Quantity = gsnApi.isNaN(parseInt(item.SalePriceMultiple || item.PriceMultiple || 1), 1);
      }

      if (gsnProfile.isOnList(item)) {
        gsnProfile.removeItem(item);
      } else {

        if (linkedItem) {
          item.OldQuantity = item.Quantity;
          item.Quantity = linkedItem.NewQuantity;
        }

        gsnProfile.addItem(item);
      }

      $rootScope.$broadcast('gsnevent:shoppinglist-toggle-item', item);
    };

    $scope.$on('$routeChangeStart', function (evt, next, current) {
      /// <summary>Listen to route change</summary>
      /// <param name="evt" type="Object">Event object</param>
      /// <param name="next" type="Object">next route</param>
      /// <param name="current" type="Object">current route</param>

      // store the new route location
      $scope.currentPath = angular.lowercase(gsnApi.isNull($location.path(), ''));
      $scope.gvm.menuInactive = false;
      $scope.gvm.shoppingListActive = false;

      if (next.requireLogin && !$scope.isLoggedIn) {
        $scope.goUrl('/signin?fromUrl=' + encodeURIComponent($location.url()));
        return;
      }

      // handle storeRequired attribute
      if (next.storeRequired) {
        if (gsnApi.isNull(gsnApi.getSelectedStoreId(), 0) <= 0) {
          $scope.goUrl('/storelocator?fromUrl=' + encodeURIComponent($location.url()));
          return;
        }
      }

      $scope.currentLayout = $scope.defaultLayout;
      if (gsnApi.isNull(next.layout, '').length > 0) {
        $scope.currentLayout = next.layout;
      }
    });

    $scope.$on('gsnevent:profile-load-success', function (event, result) {
      if (result.success) {
        $scope.hasJustLoggedIn = false;

        gsnProfile.getProfile().then(function (rst) {
          if (rst.success) {
            $scope.gvm.profile = rst.response;
          }
        });
      }
    });

    $scope.$on('gsnevent:login-success', function (event, result) {
      $scope.isLoggedIn = gsnApi.isLoggedIn();
      $analytics.eventTrack('SigninSuccess', { category: result.payload.grant_type, label: result.response.user_id });
      $scope.hasJustLoggedIn = true;
      $scope.loggedInWithFacebook = (result.payload.grant_type == 'facebook');
    });

    $scope.$on('gsnevent:login-failed', function (event, result) {
      if (result.payload.grant_type == 'facebook') {
        if (gsnApi.isLoggedIn()) return;

        $scope.goUrl('/registration/facebook');

        $analytics.eventTrack('SigninFailed', { category: result.payload.grant_type, label: gsnApi.getProfileId() });
      }
    });

    $scope.$on('gsnevent:store-setid', function (event, result) {
      gsnStore.getStore().then(function (store) {
        $analytics.eventTrack('StoreSelected', { category: store.StoreName, label: store.StoreNumber + '', value: store.StoreId });

        gsnProfile.getProfile().then(function (rst) {
          if (rst.success) {
            if (rst.response.PrimaryStoreId != store.StoreId) {
              // save selected store
              gsnProfile.selectStore(store.StoreId).then(function () {
                // broadcast persisted on server response
                $rootScope.$broadcast('gsnevent:store-persisted', store);
              });
            }
          }
        });
      });
    });

    $scope.$on('gsnevent:circular-loading', function (event, data) {
      $scope.gvm.noCircular = true;
    });

    $scope.$on('gsnevent:circular-loaded', function (event, data) {
      $scope.gvm.noCircular = !data.success;
    });

    $scope.$watch(function () {
      return Facebook.isReady(); // This is for convenience, to notify if Facebook is loaded and ready to go.
    }, function (newVal) {
      $scope.facebookReady = true; // You might want to use this to disable/show/hide buttons and else

      if (gsnApi.isLoggedIn()) return;

      // attempt to auto login facebook user
      Facebook.getLoginStatus(function (response) {
        // only auto login for connected status
        if (response.status == 'connected') {
          $scope.validateRegistration(response);
        }
      });
    });

    //#region analytics
    $scope.$on('gsnevent:shoppinglistitem-updating', function (event, shoppingList, item) {
      var currentListId = gsnApi.getShoppingListId();
      if (shoppingList.ShoppingListId == currentListId) {

        try {
          var cat = gsnStore.getCategories()[item.CategoryId];
          var evt = 'MiscItemAddUpdate';
          if (item.ItemTypeId == 8) {
            evt = 'CircularItemAddUpdate';
          } else if (item.ItemTypeId == 2) {
            evt = 'ManufacturerCouponAddUpdate';
          } else if (item.ItemTypeId == 3) {
            evt = 'ProductAddUpdate';
          } else if (item.ItemTypeId == 5) {
            evt = 'RecipeIngredientAddUpdate';
          } else if (item.ItemTypeId == 6) {
            evt = 'OwnItemAddUpdate';
          } else if (item.ItemTypeId == 10) {
            evt = 'StoreCouponAddUpdate';
          } else if (item.ItemTypeId == 13) {
            evt = 'YoutechCouponAddUpdate';
          }

          $analytics.eventTrack(evt, { category: (item.ItemTypeId == 13) ? item.ExtCategory : cat.CategoryName, label: item.Description, value: item.ItemId });
        } catch (e) {
        }
      }
    });

    $scope.$on('gsnevent:shoppinglist-item-removing', function (event, shoppingList, item) {
      var currentListId = gsnApi.getShoppingListId();
      if (shoppingList.ShoppingListId == currentListId) {
        try {
          var cat = gsnStore.getCategories()[item.CategoryId],
              coupon = null,
              itemId = item.ItemId;

          if (item.ItemTypeId == 8) {
            $analytics.eventTrack('CircularItemRemove', { category: cat.CategoryName, label: item.Description, value: itemId });
          } else if (item.ItemTypeId == 2) {
            coupon = gsnStore.getCoupon(item.ItemId, 2);
            if (coupon) {
              item = coupon;
              if (gsnApi.isNull(item.ProductCode, '').length > 0) {
                itemId = item.ProductCode;
              }
            }
            $analytics.eventTrack('ManufacturerCouponRemove', { category: cat.CategoryName, label: item.Description, value: itemId });
          } else if (item.ItemTypeId == 3) {
            $analytics.eventTrack('ProductRemove', { category: cat.CategoryName, label: item.Description, value: item.ProductId });
          } else if (item.ItemTypeId == 5) {
            $analytics.eventTrack('RecipeIngredientRemove', { category: cat.CategoryName, label: item.Description, value: itemId });
          } else if (item.ItemTypeId == 6) {
            $analytics.eventTrack('OwnItemRemove', { label: item.Description });
          } else if (item.ItemTypeId == 10) {
            coupon = gsnStore.getCoupon(item.ItemId, 10);
            if (coupon) {
              item = coupon;
              if (gsnApi.isNull(item.ProductCode, '').length > 0) {
                itemId = item.ProductCode;
              }
            }
            $analytics.eventTrack('StoreCouponRemove', { category: cat.CategoryName, label: item.Description, value: itemId });
          } else if (item.ItemTypeId == 13) {
            coupon = gsnStore.getCoupon(item.ItemId, 13);
            if (coupon) {
              item = coupon;
              if (gsnApi.isNull(item.ProductCode, '').length > 0) {
                itemId = item.ProductCode;
              }
            }
            $analytics.eventTrack('YoutechCouponRemove', { category: item.ExtCategory, label: item.Description, value: itemId });
          } else {
            $analytics.eventTrack('MiscItemRemove', { category: cat.CategoryName, label: item.Description, value: item.ItemTypeId });
          }
        } catch (e) {
        }
      }
    });

    //#endregion
  }
})(angular);
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

    returnObj.sendEmploymentEmail = function (payload, selectedStoreId) {
      var deferred = $q.defer();

      gsnApi.getAccessToken().then(function () {
        var url = gsnApi.getProfileApiUrl() + "/SendEmployment/" + selectedStoreId;

        $http.post(url, payload, { headers: gsnApi.getApiHeaders(),  }).success(function (response) {
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
