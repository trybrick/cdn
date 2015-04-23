(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
(function() {
  var Plugin, aPlugin, attrs, buildqs, circPlus, debug, doc, dom, fn, gsnContext, gsnSw2, gsndfpfactory, gsnpods, i, j, k, lastRefreshTime, len, len1, loadiframe, log, myGsn, myPlugin, oldGsnAdvertising, prefix, ref, ref1, script, trakless, trakless2, win;

  debug = require('debug');

  log = debug('gsndfp');

  trakless2 = require('trakless');

  loadiframe = require('load-iframe');

  dom = require('dom');

  gsndfpfactory = require('./gsndfpfactory.coffee');

  if (typeof console !== "undefined" && console !== null) {
    if ((console.log.bind != null)) {
      log.log = console.log.bind(console);
    }
  }

  win = window;

  doc = win.document;

  gsnContext = win.gsnContext;

  trakless = win.trakless;

  myGsn = win.Gsn || {};

  oldGsnAdvertising = myGsn.Advertising;

  gsnSw2 = new gsndfpfactory();

  gsnpods = new gsndfpfactory();

  circPlus = new gsndfpfactory();

  lastRefreshTime = 0;

  if (oldGsnAdvertising != null) {
    if (oldGsnAdvertising.pluginLoaded) {
      return;
    }
  }

  Plugin = (function() {
    function Plugin() {}

    Plugin.prototype.pluginLoaded = true;

    Plugin.prototype.defP = {
      page: void 0,
      evtname: void 0,
      dept: void 0,
      deviceid: void 0,
      storeid: void 0,
      consumerid: void 0,
      isanon: true,
      loyaltyid: void 0,
      aisle: void 0,
      category: void 0,
      shelf: void 0,
      brand: void 0,
      pcode: void 0,
      pdesc: void 0,
      latlng: void 0,
      evtcategory: void 0,
      evtvalue: void 0
    };

    Plugin.prototype.translator = {
      page: 'pg',
      evtname: 'en',
      dept: 'dpt',
      deviceid: 'dvc',
      storeid: 'str',
      consumerid: 'cust',
      isanon: 'isa',
      loyaltyid: 'loy',
      aisle: 'asl',
      category: 'cat',
      shelf: 'shf',
      brand: 'brd',
      pcode: 'pcd',
      pdesc: 'pds',
      latlng: 'latlng',
      evtcategory: 'ec',
      evtvalue: 'ev'
    };

    Plugin.prototype.isDebug = false;

    Plugin.prototype.gsnid = 0;

    Plugin.prototype.selector = 'body';

    Plugin.prototype.apiUrl = 'https://clientapi.gsn2.com/api/v1';

    Plugin.prototype.gsnNetworkId = void 0;

    Plugin.prototype.gsnNetworkStore = void 0;

    Plugin.prototype.onAllEvents = void 0;

    Plugin.prototype.oldGsnAdvertising = oldGsnAdvertising;

    Plugin.prototype.minSecondBetweenRefresh = 5;

    Plugin.prototype.enableCircPlus = false;

    Plugin.prototype.disableSw = '';

    Plugin.prototype.source = '';

    Plugin.prototype.targetting = {};

    Plugin.prototype.depts = '';

    Plugin.prototype.circPlusBody = void 0;

    Plugin.prototype.refreshExisting = {
      circPlus: false,
      pods: false
    };

    Plugin.prototype.circPlusDept = void 0;

    Plugin.prototype.timer = void 0;


    /**
     * get network id
    #
     * @return {Object}
     */

    Plugin.prototype.getNetworkId = function(includeStore) {
      var result, self;
      self = this;
      result = self.gsnNetworkId + ((self.source || "").length > 0 ? "." + self.source : "");
      if (includeStore) {
        result = result.replace(/\/$/gi, '') + (self.gsnNetworkStore || '');
      }
      return result;
    };


    /**
     * emit a gsnevent
    #
     * @param {String} en - event name
     * @param {Object} ed - event data
     * @return {Object}
     */

    Plugin.prototype.emit = function(en, ed) {
      if (en.indexOf('gsnevent') < 0) {
        en = 'gsnevent:' + en;
      }
      win.setTimeout((function() {
        trakless.broadcast(en, {
          type: en,
          detail: ed
        });
        if (typeof this.onAllEvents === 'function') {
          this.onAllEvents({
            type: en,
            detail: ed
          });
        }
      }), 100);
      return this;
    };


    /**
     * listen to a gsnevent
    #
     * @param {String} en - event name
     * @param {Function} cb - callback
     * @return {Object}
     */

    Plugin.prototype.on = function(en, cb) {
      if (en.indexOf('gsnevent') < 0) {
        en = 'gsnevent:' + en;
      }
      trakless.on(en, cb);
      return this;
    };


    /**
     * detach from event
    #
     * @param {String} en - event name
     * @param {Function} cb - cb
     * @return {Object}
     */

    Plugin.prototype.off = function(en, cb) {
      if (en.indexOf('gsnevent') < 0) {
        en = 'gsnevent:' + en;
      }
      trakless.off(en, cb);
      return this;
    };


    /**
     * loggingn data
    #
     * @param {String} message - log message
     * @return {Object}
     */

    Plugin.prototype.log = function(message) {
      var self;
      self = myGsn.Advertising;
      if (self.isDebug || debug.enabled('gsndfp')) {
        self.isDebug = true;
        if (typeof message === 'object') {
          try {
            message = JSON.stringify(message);
          } catch (_error) {

          }
        }
        log(message);
      }
      return this;
    };


    /**
     * trigger action tracking
    #
     * @param {String} actionParam
     * @return {Object}
     */

    Plugin.prototype.trackAction = function(actionParam) {
      var k, k2, self, tsP, v;
      self = myGsn.Advertising;
      tsP = {};
      if (typeof actionParam === 'object') {
        for (k in actionParam) {
          v = actionParam[k];
          if (!(v != null)) {
            continue;
          }
          k2 = self.translator[k];
          if (k2) {
            tsP[k2] = v;
          }
        }
      }
      trakless.getDefaultTracker().track('gsn', tsP);
      self.log(actionParam);
      return this;
    };


    /**
     * utility method to normalize category
    #
     * @param {String} keyword
     * @return {String}
     */

    Plugin.prototype.cleanKeyword = function(keyword) {
      var result;
      result = keyword.replace(/[^a-zA-Z0-9]+/gi, '_').replace(/^[_]+/gi, '');
      if (result.toLowerCase != null) {
        result = result.toLowerCase();
      }
      return result;
    };


    /**
     * add a dept
    #
     * @param {String} dept
     * @return {Object}
     */

    Plugin.prototype.addDept = function(dept) {
      var goodDept, self;
      self = myGsn.Advertising;
      if (dept != null) {
        goodDept = self.cleanKeyword(dept);
        goodDept = "," + goodDept;
        if (self.depts.indexOf(goodDept) < 0) {
          self.depts = "" + goodDept + self.depts;
        }
      }
      return this;
    };


    /**
     * fire a tracking url
    #
     * @param {String} url
     * @return {Object}
     */

    Plugin.prototype.ajaxFireUrl = function(url) {
      var img;
      if (typeof url === 'string') {
        if (url.length < 10) {
          return;
        }
        url = url.replace('%%CACHEBUSTER%%', (new Date).getTime());
        img = new Image(1, 1);
        img.src = url;
      }
      return this;
    };


    /**
     * Trigger when a product is clicked.  AKA: clickThru
    #
     */

    Plugin.prototype.clickProduct = function(click, categoryId, brandName, productDescription, productCode, quantity, displaySize, regularPrice, currentPrice, savingsAmount, savingsStatement, adCode, creativeId) {
      this.ajaxFireUrl(click);
      this.emit('clickProduct', {
        myPlugin: this,
        CategoryId: categoryId,
        BrandName: brandName,
        Description: productDescription,
        ProductCode: productCode,
        DisplaySize: displaySize,
        RegularPrice: regularPrice,
        CurrentPrice: currentPrice,
        SavingsAmount: savingsAmount,
        SavingsStatement: savingsStatement,
        AdCode: adCode,
        CreativeId: creativeId,
        Quantity: quantity || 1
      });
      return this;
    };


    /**
     * Trigger when a brick offer is clicked.  AKA: brickRedirect
    #
     */

    Plugin.prototype.clickBrickOffer = function(click, offerCode, checkCode) {
      this.ajaxFireUrl(click);
      this.emit('clickBrickOffer', {
        myPlugin: this,
        OfferCode: offerCode || 0
      });
      return this;
    };


    /**
     * Trigger when a brand offer or shopper welcome is clicked.
    #
     */

    Plugin.prototype.clickBrand = function(click, brandName) {
      this.ajaxFireUrl(click);
      this.setBrand(brandName);
      this.emit('clickBrand', {
        myPlugin: this,
        BrandName: brandName
      });
      return this;
    };


    /**
     * Trigger when a promotion is clicked.  AKA: promotionRedirect
    #
     */

    Plugin.prototype.clickPromotion = function(click, adCode) {
      this.ajaxFireUrl(click);
      this.emit('clickPromotion', {
        myPlugin: this,
        AdCode: adCode
      });
      return this;
    };


    /**
     * Trigger when a recipe is clicked.  AKA: recipeRedirect
    #
     */

    Plugin.prototype.clickRecipe = function(click, recipeId) {
      this.ajaxFireUrl(click);
      this.emit('clickRecipe', {
        RecipeId: recipeId
      });
      return this;
    };


    /**
     * Trigger when a generic link is clicked.  AKA: verifyClickThru
    #
     */

    Plugin.prototype.clickLink = function(click, url, target) {
      if (target === void 0 || target === '') {
        target = '_top';
      }
      this.ajaxFireUrl(click);
      this.emit('clickLink', {
        myPlugin: this,
        Url: url,
        Target: target
      });
      return this;
    };


    /**
     * set the brand for the session
    #
     */

    Plugin.prototype.setBrand = function(brandName) {
      trakless.util.session('gsndfp:brand', brandName);
      return this;
    };


    /**
     * get the brand currently in session
    #
     */

    Plugin.prototype.getBrand = function() {
      return trakless.util.session('gsndfp:brand');
    };


    /**
     * handle a dom event
    #
     */

    Plugin.prototype.actionHandler = function(evt) {
      var allData, elem, i, k, len, payLoad, realk, self, v;
      self = myGsn.Advertising;
      elem = evt.target ? evt.target : evt.srcElement;
      payLoad = {};
      if (elem != null) {
        allData = trakless.util.allData(elem);
        for (v = i = 0, len = allData.length; i < len; v = ++i) {
          k = allData[v];
          if (!(/^gsn/gi.test(k))) {
            continue;
          }
          realk = /^gsn/i.replace(k, '').toLowerCase();
          payLoad[realk] = v;
        }
      }
      self.refresh(payLoad);
      return self;
    };


    /**
     * internal method for refreshing adpods
    #
     */

    Plugin.prototype.refreshAdPodsInternal = function(actionParam, forceRefresh) {
      var canRefresh, k, payLoad, ref, self, targetting, v;
      self = myGsn.Advertising;
      payLoad = actionParam || {};
      ref = self.defP;
      for (k in ref) {
        v = ref[k];
        if (v != null) {
          if (!payLoad[k]) {
            payLoad[k] = v;
          }
        }
      }
      if (gsnSw2.isVisible) {
        return self;
      }
      payLoad.siteid = self.gsnid;
      self.trackAction(payLoad);
      canRefresh = ((new Date).getTime() / 1000 - lastRefreshTime) >= self.minSecondBetweenRefresh;
      if (forceRefresh || canRefresh) {
        lastRefreshTime = (new Date()).getTime() / 1000;
        if ((payLoad.dept != null)) {
          self.addDept(payLoad.dept);
        }
        if (forceRefresh) {
          self.refreshExisting.pods = false;
          self.refreshExisting.circPlus = false;
        }
        targetting = {
          dept: self.depts.split(',').slice(1, 5),
          brand: self.getBrand()
        };
        if (payLoad.page) {
          targetting.kw = payLoad.page.replace(/[^a-z]/gi, '');
        }
        if (targetting.dept.length > 0) {
          self.depts = "," + targetting.dept.join(',');
        } else {
          targetting.dept = ['produce'];
        }
        gsnpods.refresh({
          setTargeting: targetting,
          sel: '.gsnunit',
          refreshExisting: self.refreshExisting.pods
        });
        self.refreshExisting.pods = true;
        if (self.enableCircPlus) {
          targetting.dept = [targetting.dept[0]];
          circPlus.refresh({
            setTargeting: targetting,
            bodyTemplate: self.bodyTemplate,
            sel: '.circplus',
            refreshExisting: self.refreshExisting.circPlus
          });
          self.refreshExisting.circPlus = true;
        }
      }
      return this;
    };


    /**
     * adpods refresh
    #
     */

    Plugin.prototype.refresh = function(actionParam, forceRefresh) {
      var self;
      self = myGsn.Advertising;
      if (!self.hasGsnUnit()) {
        return self;
      }
      if (self.gsnid) {
        if (gsnSw2.isVisible) {
          return self;
        }
        gsnSw2.refresh({
          displayWhenExists: '.gsnadunit,.gsnunit',
          sel: '.gsnsw',
          onData: function(evt) {
            if ((self.source || '').length > 0) {
              return evt.cancel = self.disableSw.indexOf(self.source) > 0;
            }
          },
          onClose: function() {
            if (self.selector != null) {
              dom(self.selector)[0].onclick = function(e) {
                e = e || win.event;
                e.target = e.target || e.srcElement || e.parentNode;
                if (win.gmodal.hasCls(e.target, 'gsnaction')) {
                  return self.actionHandler(e);
                }
              };
              self.selector = null;
            }
            return self.refreshAdPodsInternal(actionParam, forceRefresh);
          }
        });
      }
      return this;
    };


    /**
     * determine if there are adpods on the page
    #
     */

    Plugin.prototype.hasGsnUnit = function() {
      return dom('.gsnadunit,.gsnunit,.circplus').length > 0;
    };


    /**
     * set global defaults
    #
     */

    Plugin.prototype.setDefault = function(defParam) {
      var k, self, v;
      self = myGsn.Advertising;
      if (typeof defParam === 'object') {
        for (k in defParam) {
          v = defParam[k];
          if (v != null) {
            self.defP[k] = v;
          }
        }
      }
      return this;
    };


    /**
     * method for support refreshing with timer
    #
     */

    Plugin.prototype.refreshWithTimer = function(actionParam) {
      var self, timer;
      self = myGsn.Advertising;
      if (actionParam == null) {
        actionParam = {
          evtname: 'refresh-timer'
        };
      }
      self.refresh(actionParam, true);
      timer = (self.timer || 0) * 1000;
      if (timer > 0) {
        setTimeout(self.refreshWithTimer, timer);
      }
      return this;
    };


    /**
     * the onload method, document ready friendly
    #
     */

    Plugin.prototype.load = function(gsnid, isDebug) {
      var self;
      self = myGsn.Advertising;
      if (gsnid) {
        self.gsnid = gsnid;
        if (isDebug) {
          debug.enable('gsndfp');
        }
      }
      return self.refreshWithTimer({
        evtname: 'loading'
      });
    };

    return Plugin;

  })();

  myPlugin = new Plugin;

  myGsn.Advertising = myPlugin;

  myGsn.Advertising.brickRedirect = myPlugin.clickBrickOffer;

  myGsn.Advertising.clickBrand = myPlugin.clickBrand;

  myGsn.Advertising.clickThru = myPlugin.clickProduct;

  myGsn.Advertising.refreshAdPods = myPlugin.refresh;

  myGsn.Advertising.logAdImpression = function() {};

  myGsn.Advertising.logAdRequest = function() {};

  myGsn.Advertising.promotionRedirect = myPlugin.clickPromotion;

  myGsn.Advertising.verifyClickThru = myPlugin.clickLink;

  myGsn.Advertising.recipeRedirect = myPlugin.clickRecipe;

  win.Gsn = myGsn;

  win.gsndfp = myGsn.Advertising;

  if ((gsnContext != null)) {
    buildqs = function(k, v) {
      if (v != null) {
        v = new String(v);
        if (k !== 'ProductDescription') {
          v = v.replace(/&/, '`');
        }
        return k + '=' + v.toString();
      } else {

      }
    };
    myGsn.Advertising.on('clickRecipe', function(data) {
      if (data.type !== 'gsnevent:clickRecipe') {
        return;
      }
      win.location.replace('/Recipes/RecipeFull.aspx?recipeid=' + data.detail.RecipeId);
    });
    myGsn.Advertising.on('clickProduct', function(data) {
      var product, qs;
      if (data.type !== 'gsnevent:clickProduct') {
        return;
      }
      product = data.detail;
      if (product) {
        qs = new String('');
        qs += buildqs('DepartmentID', product.CategoryId);
        qs += '~' + buildqs('BrandName', product.BrandName);
        qs += '~' + buildqs('ProductDescription', product.Description);
        qs += '~' + buildqs('ProductCode', product.ProductCode);
        qs += '~' + buildqs('DisplaySize', product.DisplaySize);
        qs += '~' + buildqs('RegularPrice', product.RegularPrice);
        qs += '~' + buildqs('CurrentPrice', product.CurrentPrice);
        qs += '~' + buildqs('SavingsAmount', product.SavingsAmount);
        qs += '~' + buildqs('SavingsStatement', product.SavingsStatement);
        qs += '~' + buildqs('Quantity', product.Quantity);
        qs += '~' + buildqs('AdCode', product.AdCode);
        qs += '~' + buildqs('CreativeID', product.CreativeId);
        if (typeof AddAdToShoppingList === 'function') {
          AddAdToShoppingList(qs);
        }
      }
    });
    myGsn.Advertising.on('clickLink', function(data) {
      var linkData;
      if (data.type !== 'gsnevent:clickLink') {
        return;
      }
      linkData = data.detail;
      if (linkData) {
        if (linkData.Target === void 0 || linkData.Target === '') {
          linkData.Target = '_top';
        }
        if (linkData.Target === '_blank') {
          win.open(linkData.Url);
        } else {
          win.location.replace(linkData.Url);
        }
      }
    });
    myGsn.Advertising.on('clickPromotion', function(data) {
      var linkData;
      if (data.type !== 'gsnevent:clickPromotion') {
        return;
      }
      linkData = data.detail;
      if (linkData) {
        win.location.replace('/Ads/Promotion.aspx?adcode=' + linkData.AdCode);
      }
    });
    myGsn.Advertising.on('clickBrickOffer', function(data) {
      var linkData, url;
      if (data.type !== 'gsnevent:clickBrickOffer') {
        return;
      }
      linkData = data.detail;
      if (linkData) {
        url = myGsn.Advertising.apiUrl + '/profile/BrickOffer/' + gsnContext.ConsumerID + '/' + linkData.OfferCode;
        win.open(url, '');
      }
    });
  }

  aPlugin = myGsn.Advertising;

  if (!aPlugin) {
    return;
  }

  attrs = {
    debug: function(value) {
      if (typeof value !== "string") {
        return;
      }
      aPlugin.isDebug = value !== "false";
      if (value) {
        return debug.enable('gsndfp');
      }
    },
    api: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return aPlugin.apiUrl = value;
    },
    source: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return aPlugin.source = value;
    },
    gsnid: function(value) {
      if (!value) {
        return;
      }
      aPlugin.gsnid = value;
      return trakless.setSiteId(value);
    },
    timer: function(value) {
      if (!value) {
        return;
      }
      return aPlugin.timer = value;
    },
    selector: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return aPlugin.selector = value;
    }
  };

  ref = doc.getElementsByTagName("script");
  for (i = 0, len = ref.length; i < len; i++) {
    script = ref[i];
    if (/gsndfp/i.test(script.src)) {
      ref1 = ['', 'data-'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        prefix = ref1[j];
        for (k in attrs) {
          fn = attrs[k];
          fn(script.getAttribute(prefix + k));
        }
      }
    }
  }

  trakless.setPixel('//pi.gsngrocers.com/pi.gif');

  trakless.store.init({
    url: '//cdn.gsngrocers.com/script/xstore.html',
    dntIgnore: true
  });

  if (aPlugin.hasGsnUnit()) {
    aPlugin.load();
  } else {
    trakless.util.ready(function() {
      return aPlugin.load();
    });
  }

  module.exports = myGsn;

}).call(this);

}, {"debug":2,"trakless":3,"load-iframe":4,"dom":5,"./gsndfpfactory.coffee":6}],
2: [function(require, module, exports) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Use chrome.storage.local if we are in an app
 */

var storage;

if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined')
  storage = chrome.storage.local;
else
  storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      storage.removeItem('debug');
    } else {
      storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

}, {"./debug":7}],
7: [function(require, module, exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

}, {"ms":8}],
8: [function(require, module, exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

}, {}],
3: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
var $defaultTracker, $defaults, $pixel, $sessionid, $siteid, $trakless2, Emitter, attrs, cookie, defaults, doc, docReady, fn, getImage, i, j, json, k, len, len1, mytrakless, myutil, prefix, query, ref, ref1, script, tracker, trakless, traklessParent, util, uuid, webanalyser, win, xstore;

xstore = require('xstore');

Emitter = require('emitter');

cookie = require('cookie');

defaults = require('defaults');

query = require('querystring');

uuid = require('uuid');

webanalyser = require('webanalyser');

docReady = require('doc-ready');

json = require('json-fallback');

win = window;

doc = win.document;

$defaultTracker = null;

$siteid = 0;

$pixel = '/pixel.gif';

$defaults = null;

$sessionid = cookie('trakless:usid');

if ($sessionid == null) {
  $sessionid = new Date().getTime();
  cookie('tls:usid', $sessionid, {
    path: '/'
  });
}


/**
 * Send image request to server using GET.
 * The infamous web bug (or beacon) is a transparent, single pixel (1x1) image
#
 */

getImage = function(cfgUrl, request, callback) {
  var image;
  image = new Image(1, 1);
  image.onload = function() {
    var iterator;
    iterator = 0;
    if (typeof callback === 'function') {
      callback();
    }
  };
  image.src = cfgUrl + (cfgUrl.indexOf('?') < 0 ? '?' : '&') + request;
  return image;
};


/**
 *  util
 */

util = (function() {
  function util() {}


  /**
   * allow for getting all attributes
  #
   * @param {HTMLElement} el - element
   * @return {Object}
   */

  util.prototype.allData = function(el) {
    var attr, camelCaseName, data, i, k, len, name, ref;
    data = {};
    if ((el != null)) {
      ref = el.attributes;
      for (k = i = 0, len = ref.length; i < len; k = ++i) {
        attr = ref[k];
        name = attr.name.replace(/^data-/g, '');
        camelCaseName = name.replace(/-(.)/g, function($0, $1) {
          return $1.toUpperCase();
        });
        data[camelCaseName] = attr.value;
      }
    }
    return data;
  };


  /**
   * parse a string to JSON, return string if fail
  #
   * @param {String} v - string value
   * @return {Object}
   */

  util.prototype.parseJSON = function(v) {
    var v2;
    if (typeof v === "string") {
      if (v.indexOf('{') >= 0 || v.indexOf('[') >= 0) {
        v2 = json.parse(v);
        if (!(v2 == null)) {
          return v2;
        }
      }
    }
    return v;
  };


  /**
   * parse a JSON to string, return string if fail
  #
   * @param {String} v - string value
   * @return {Object}
   */

  util.prototype.stringify = function(v) {
    if (typeof v === "string") {
      return v;
    }
    return json.stringify(v);
  };


  /**
   * get or set session data - store in cookie
   * if no value is provided, then it is a get
  #
   * @param {String} k - key
   * @param {Object} v - value
   * @return {Object}
   */

  util.prototype.session = function(k, v) {
    if ((v != null)) {
      if (!(typeof v === "string")) {
        v = this.stringify(v);
      }
      cookie('tls:' + k, v, {
        path: '/'
      });
      return v;
    }
    v = cookie('tls:' + k);
    if (typeof v === 'undefined') {
      return v;
    }
    return this.parseJSON(v);
  };


  /**
   * cookie
  #
   */

  util.prototype.cookie = cookie;


  /**
   * document ready
  #
   */

  util.prototype.ready = docReady;


  /**
   * trim
  #
   */

  util.prototype.trim = function(v) {
    return v.replace(/^\s+|\s+$/gm, '');
  };

  return util;

})();

myutil = new util();


/**
 * tracker class
#
 */

tracker = (function() {
  function tracker() {}

  tracker.prototype.defaults = webanalyser.getResult();

  tracker.prototype.pixel = '/pixel.gif';

  tracker.prototype.siteid = 0;

  tracker.prototype.store = null;

  tracker.prototype.uuid = null;

  tracker.prototype._trackit = function(myData, pixel) {
    var self;
    self = this;
    myData.uuid = self.uuid;
    myData.siteid = self.siteid;
    myData.usid = $sessionid;
    getImage(pixel, query.stringify(myData));
    self.emit('track', myData.ht, myData);
    return self;
  };

  tracker.prototype._track = function(ht, extra) {
    var data, k, myData, myDef, pixel, self, v;
    self = this;
    if (extra == null) {
      extra = {};
    }
    if (self.siteid > 0) {
      pixel = myutil.trim(this.pixel);
      myDef = self.defaults;
      if ((pixel.indexOf('//') === 0) && (myDef.dl.indexOf('http') !== 0)) {
        pixel = 'http:' + pixel;
      }
      data = ht === 'pageview' ? defaults(extra, myDef) : extra;
      myData = {};
      for (k in data) {
        v = data[k];
        if (v != null) {
          if (!(typeof v === "string") || (myutil.trim(v).length > 0)) {
            if ((k + '') !== 'undefined') {
              myData[k] = v;
            }
          }
        }
      }
      myData.z = new Date().getTime();
      myData.ht = ht;
      if (!self.uuid) {
        self.uuid = uuid();
        if (self.store != null) {
          self.store.get('trakless-uuid').then(function(id) {
            if (!id) {
              self.store.set('trakless-uuid', self.uuid);
            }
            self.uuid = id || self.uuid;
            return self._trackit(myData, pixel);
          });
        }
      } else {
        self._trackit(myData, pixel);
      }
    }
    return this;
  };


  /**
   * track generic method
  #
   * @param {String} ht - hit types with possible values of 'pageview', 'event', 'transaction', 'item', 'social', 'exception', 'timing', 'app', 'custom'
   * @param {Object} extra - extended data
   * @return {Object}
   */

  tracker.prototype.track = function(ht, extra) {
    var self;
    self = this;
    myutil.ready(function() {
      return self._track(ht || 'custom', extra);
    });
    return this;
  };


  /**
   * track pageview
  #
   * @param {Object} extra - extended data
   * @return {Object}
   */

  tracker.prototype.trackPageView = function(extra) {
    return this.track('pageview', extra);
  };


  /**
   * track event
  #
   * @param {String} category
   * @param {String} action
   * @param {String} label
   * @param {String} value - Values must be non-negative.
   * @return {Object}
   */

  tracker.prototype.trackEvent = function(category, action, label, value) {
    if (value && value < 0) {
      value = null;
    }
    return this.track('event', {
      ec: category || 'event',
      ea: action,
      el: label,
      ev: value
    });
  };


  /**
   * track item
  #
   * @param {String} id - *required* [OD564]
   * @param {Number} name - *required* [Shoe] Specifies the item name.
   * @param {Number} price [3.50] Specifies the price for a single item / unit.
   * @param {Number} quantity [4] Specifies the number of items purchased.
   * @param {String} code [SKU47] Specifies the SKU or item code.
   * @param {String} category [Blue] Specifies the category that the item belongs to.
   * @param {String} currencycode [EUR] When present indicates the local currency for all transaction currency values. Value should be a valid ISO 4217 currency code.
   * @return {Object}
   */

  tracker.prototype.trackItemOrTransaction = function(id, name, price, quantity, code, category, currencycode) {
    return this.track('item', {
      ti: id,
      "in": name,
      ip: price,
      iq: quantity,
      ic: code,
      iv: category,
      cu: currencycode
    });
  };


  /**
   * track transaction
  #
   * @param {String} id - *required* [OD564]
   * @param {String} affiliation [Member] Specifies the affiliation or store name.
   * @param {Number} revenue [15.47] Specifies the total revenue associated with the transaction. This value should include any shipping or tax costs.
   * @param {Number} shipping [3.50] Specifies the total shipping cost of the transaction.
   * @param {Number} tax [1.20] Specifies the total tax of the transaction.
   * @param {Number} price [3.50] Specifies the price for a single item / unit.
   * @param {Number} quantity [4] Specifies the number of items purchased.
   * @param {String} code [SKU47] Specifies the SKU or item code.
   * @param {String} category [Blue] Specifies the category that the item belongs to.
   * @param {String} currencycode [EUR] When present indicates the local currency for all transaction currency values. Value should be a valid ISO 4217 currency code.
   * @return {Object}
   */

  tracker.prototype.trackTransaction = function(id, affiliation, revenue, shipping, tax, name, price, quantity, code, category, currencycode) {
    return this.track('transaction', {
      ti: id,
      ta: affiliation,
      tr: revenue,
      ts: shipping,
      tt: tax,
      "in": name,
      ip: price,
      iq: quantity,
      ic: code,
      iv: category,
      cu: currencycode
    });
  };


  /**
   * track social
  #
   * @param {String} network - *required* [facebook] Specifies the social network, for example Facebook or Google Plus.
   * @param {String} action - *required* [like] Specifies the social interaction action. For example on Google Plus when a user clicks the +1 button, the social action is 'plus'.
   * @param {String} target - *required* [http://foo.com] Specifies the target of a social interaction. This value is typically a URL but can be any text.
   * @return {Object}
   */

  tracker.prototype.trackSocial = function(network, action, target) {
    return this.track('social', {
      sn: network,
      sa: action,
      st: target
    });
  };


  /**
   * track exception
  #
   * @param {String} description - Specifies the description of an exception.
   * @param {String} isFatal - true/false Specifies whether the exception was fatal.
   * @return {Object}
   */

  tracker.prototype.trackException = function(description, isFatal) {
    return this.track('exception', {
      exf: isFatal ? 1 : 0,
      exd: description
    });
  };


  /**
   * track app
  #
   * @param {String} name - *required* [MyApp] Specifies the application name.
   * @param {String} id - *required* [com.company.app] Application identifier.
   * @param {String} version - *required* [1.2] Specifies the application version.
   * @param {String} installerid - *required* com.platform.vending
   * @return {Object}
   */

  tracker.prototype.trackApp = function(name, id, version, installerid) {
    return this.track('app', {
      an: name,
      aid: id,
      av: version,
      aiid: installer
    });
  };


  /**
   * track custom
  #
   * @param {Object} customDataObject - object with any property you want
   * @return {Object}
   */

  tracker.prototype.trackCustom = function(customDataObject) {
    return this.track('custom', customDataObject);
  };

  return tracker;

})();

Emitter(tracker.prototype);


/**
 * tracker factory
#
 */

mytrakless = (function() {
  function mytrakless() {}


  /**
   * set default siteid
  #
   * @param {Number} siteid - the site id
   * @return {Object}
   */

  mytrakless.prototype.setSiteId = function(siteid) {
    var mysid;
    mysid = parseInt(siteid);
    $siteid = mysid > 0 ? mysid : $siteid;
  };


  /**
   * set default pixel
  #
   * @param {String} pixel - the default pixel url
   * @return {Object}
   */

  mytrakless.prototype.setPixel = function(pixelUrl) {
    if (pixelUrl) {
      $pixel = pixelUrl || $pixel;
    }
  };


  /**
   * the storage
  #
   * @return {Object}
   */

  mytrakless.prototype.store = xstore;


  /**
   * you can provide different siteid and pixelUrl for in multi-tracker and site scenario
  #
   * @param {Number} siteid - the siteid
   * @param {String} pixelUrl - the pixel url
   * @return {Object}
   */

  mytrakless.prototype.getTracker = function(siteid, pixelUrl) {
    var rst;
    rst = new tracker();
    rst.siteid = siteid != null ? siteid : $siteid;
    rst.pixel = pixelUrl != null ? pixelUrl : $pixel;
    rst.store = xstore;
    return rst;
  };


  /**
   * get the default racker
  #
   */

  mytrakless.prototype.getDefaultTracker = function() {
    if ($defaultTracker == null) {
      $defaultTracker = trakless.getTracker();
    }
    return $defaultTracker;
  };


  /**
   * utility
  #
   */

  mytrakless.prototype.util = myutil;


  /**
   * similar to emit, except it broadcast to parent
  #
   */

  mytrakless.prototype.broadcast = function(en, ed) {
    if (typeof $trakless2 !== "undefined" && $trakless2 !== null) {
      $trakless2.emit(en, ed);
    }
    return this;
  };

  return mytrakless;

})();

trakless = new mytrakless;

Emitter(trakless);

$trakless2 = trakless;

if (win.top !== win) {
  try {
    traklessParent = win.top.trakless;
    $trakless2 = traklessParent;
  } catch (_error) {
    $trakless2 = win.parent.trakless;
  }
}

attrs = {
  site: function(value) {
    return trakless.setSiteId(value);
  },
  pixel: function(value) {
    if (typeof value !== "string") {
      return;
    }
    return trakless.setPixel(value);
  }
};

ref = win.document.getElementsByTagName("script");
for (i = 0, len = ref.length; i < len; i++) {
  script = ref[i];
  if (/trakless/i.test(script.src)) {
    ref1 = ['', 'data-'];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      prefix = ref1[j];
      for (k in attrs) {
        fn = attrs[k];
        fn(script.getAttribute(prefix + k));
      }
    }
  }
}

win.trakless = trakless;

module.exports = trakless;

}, {"xstore":9,"emitter":10,"cookie":11,"defaults":12,"querystring":13,"uuid":14,"webanalyser":15,"doc-ready":16,"json-fallback":17}],
9: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
(function(win) {
  var cacheBust, deferredObject, delay, dnt, doPostMessage, doc, handleMessageEvent, hash, iframe, load, lstore, mydeferred, myproxy, myq, onMessage, proxyPage, proxyWin, q, randomHash, store, usePostMessage, xstore;
  doc = win.document;
  load = require('load-iframe');
  store = require('store.js');
  proxyPage = 'http://niiknow.github.io/xstore/xstore.html';
  deferredObject = {};
  iframe = void 0;
  proxyWin = void 0;
  usePostMessage = win.postMessage != null;
  cacheBust = 0;
  hash = void 0;
  delay = 333;
  lstore = {};
  myq = [];
  q = setInterval(function() {
    if (myq.length > 0) {
      return myq.shift()();
    }
  }, delay + 5);
  dnt = win.navigator.doNotTrack || navigator.msDoNotTrack || win.doNotTrack;
  onMessage = function(fn) {
    if (win.addEventListener) {
      return win.addEventListener("message", fn, false);
    } else {
      return win.attachEvent("onmessage", fn);
    }
  };

  /**
   * defer/promise class
  #
   */
  mydeferred = (function() {
    var i, k, len, ref, v;

    function mydeferred() {}

    mydeferred.prototype.q = function(event, item) {
      var d, deferredHash, self;
      self = this;
      self.mycallbacks = [];
      self.myerrorbacks = [];
      deferredHash = randomHash();
      d = [0, deferredHash, event, item.k, item.v];
      deferredObject[deferredHash] = self;
      if (usePostMessage) {
        doPostMessage(JSON.stringify(d));
      } else {
        if (iframe !== null) {
          cacheBust += 1;
          d[0] = +(new Date) + cacheBust;
          hash = '#' + JSON.stringify(d);
          if (iframe.src) {
            iframe.src = "" + proxyPage + hash;
          } else if ((iframe.contentWindow != null) && (iframe.contentWindow.location != null)) {
            iframe.contentWindow.location = "" + proxyPage + hash;
          } else {
            iframe.setAttribute('src', "" + proxyPage + hash);
          }
        }
      }
      self.then = function(fn, fnErr) {
        if (fnErr) {
          self.myerrorbacks.push(fnErr);
        }
        self.mycallbacks.push(fn);
        return self;
      };
      return self;
    };

    mydeferred.prototype.myresolve = function(data) {
      var i, k, len, ref, self, v;
      self = this;
      ref = self.mycallbacks || [];
      for (k = i = 0, len = ref.length; i < len; k = ++i) {
        v = ref[k];
        v(data);
      }
      return self;
    };

    mydeferred.prototype.myreject = function(e) {
      var self;
      return self = this;
    };

    ref = self.myerrorbacks || [];
    for (k = i = 0, len = ref.length; i < len; k = ++i) {
      v = ref[k];
      v(data);
    }

    self;

    return mydeferred;

  })();
  myproxy = (function() {
    function myproxy() {}

    myproxy.prototype.delay = 333;

    myproxy.prototype.hash = win.location.hash;

    myproxy.prototype.init = function() {
      var self;
      self = this;
      if (usePostMessage) {
        return onMessage(self.handleProxyMessage);
      } else {
        return setInterval((function() {
          var newhash;
          newhash = win.location.hash;
          if (newhash !== hash) {
            hash = newhash;
            self.handleProxyMessage({
              data: JSON.parse(newhash.substr(1))
            });
          }
        }), self.delay);
      }
    };

    myproxy.prototype.handleProxyMessage = function(e) {
      var d, id, key, method, myCacheBust, self;
      d = e.data;
      if (typeof d === "string") {
        if (/^xstore-/.test(d)) {
          d = d.split(",");
        } else {
          try {
            d = JSON.parse(d);
          } catch (_error) {
            return;
          }
        }
      }
      if (!(d instanceof Array)) {
        return;
      }
      id = d[1];
      if (!/^xstore-/.test(id)) {
        return;
      }
      self = this;
      key = d[3] || 'xstore';
      method = d[2];
      cacheBust = 0;
      if (method === 'get') {
        d[4] = store.get(key);
      } else if (method === 'set') {
        store.set(key, d[4]);
      } else if (method === 'remove') {
        store.remove(key);
      } else if (method === 'clear') {
        store.clear();
      } else {
        d[2] = 'error-' + method;
      }
      d[1] = id.replace('xstore-', 'xstoreproxy-');
      if (usePostMessage) {
        e.source.postMessage(JSON.stringify(d), '*');
      } else {
        cacheBust += 1;
        myCacheBust = +(new Date) + cacheBust;
        d[0] = myCacheBust;
        hash = '#' + JSON.stringify(d);
        win.location = win.location.href.replace(globals.location.hash, '') + hash;
      }
    };

    return myproxy;

  })();
  randomHash = function() {
    var rh;
    rh = Math.random().toString(36).substr(2);
    return "xstore-" + rh;
  };
  doPostMessage = function(msg) {
    if ((proxyWin != null)) {
      clearInterval(q);
      proxyWin.postMessage(msg, '*');
      return;
    }
    return myq.push(function() {
      return doPostMessage(msg);
    });
  };
  handleMessageEvent = function(e) {
    var d, di, id;
    d = e.data;
    if (typeof d === "string") {
      if (/^xstoreproxy-/.test(d)) {
        d = d.split(",");
      } else {
        try {
          d = JSON.parse(d);
        } catch (_error) {
          return;
        }
      }
    }
    if (!(d instanceof Array)) {
      return;
    }
    id = d[1];
    if (!/^xstoreproxy-/.test(id)) {
      return;
    }
    id = id.replace('xstoreproxy-', 'xstore-');
    di = deferredObject[id];
    if (di) {
      if (/^error-/.test(d[2])) {
        di.myreject(d[2]);
      } else {
        di.myresolve(d[4]);
      }
      return delete deferredObject[id];
    }
  };

  /**
   * xstore class
  #
   */
  xstore = (function() {
    function xstore() {}

    xstore.prototype.hasInit = false;

    xstore.prototype.get = function(k) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            return fn(lstore[k]);
          }
        };
      }
      return (new mydeferred()).q('get', {
        'k': k
      });
    };

    xstore.prototype.set = function(k, v) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            lstore[k] = v;
            return fn(lstore[k]);
          }
        };
      }
      return (new mydeferred()).q('set', {
        'k': k,
        'v': v
      });
    };

    xstore.prototype.remove = function(k) {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            delete lstore[k];
            return fn;
          }
        };
      }
      return (new mydeferred()).q('remove', {
        'k': k
      });
    };

    xstore.prototype.clear = function() {
      this.init();
      if (dnt) {
        return {
          then: function(fn) {
            lstore = {};
            return fn;
          }
        };
      }
      return (new mydeferred()).q('clear');
    };

    xstore.prototype.init = function(options) {
      var self;
      self = this;
      if (self.hasInit) {
        return self;
      }
      self.hasInit = true;
      options = options || {};
      if (options.isProxy) {
        (new myproxy()).init();
        return;
      }
      proxyPage = options.url || proxyPage;
      if (options.dntIgnore) {
        dnt = false;
      }
      if (!store.enabled) {
        dnt = true;
      }
      if (win.location.protocol === 'https') {
        proxyPage = proxyPage.replace('http:', 'https:');
      }
      return iframe = load(proxyPage, function() {
        iframe.setAttribute("id", "xstore");
        proxyWin = iframe.contentWindow;
        if (!usePostMessage) {
          hash = proxyWin.location.hash;
          return setInterval((function() {
            if (proxyWin.location.hash !== hash) {
              hash = proxyWin.location.hash;
              handleMessageEvent({
                origin: proxyDomain,
                data: hash.substr(1)
              });
            }
          }), delay);
        } else {
          return onMessage(handleMessageEvent);
        }
      });
    };

    return xstore;

  })();
  win.xstore = new xstore();
  return module.exports = win.xstore;
})(window);

}, {"load-iframe":4,"store.js":18}],
4: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var onload = require('script-onload');
var tick = require('next-tick');
var type = require('type');

/**
 * Expose `loadScript`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api public
 */

module.exports = function loadIframe(options, fn){
  if (!options) throw new Error('Cant load nothing...');

  // Allow for the simplest case, just passing a `src` string.
  if ('string' == type(options)) options = { src : options };

  var https = document.location.protocol === 'https:' ||
              document.location.protocol === 'chrome-extension:';

  // If you use protocol relative URLs, third-party scripts like Google
  // Analytics break when testing with `file:` so this fixes that.
  if (options.src && options.src.indexOf('//') === 0) {
    options.src = https ? 'https:' + options.src : 'http:' + options.src;
  }

  // Allow them to pass in different URLs depending on the protocol.
  if (https && options.https) options.src = options.https;
  else if (!https && options.http) options.src = options.http;

  // Make the `<iframe>` element and insert it before the first iframe on the
  // page, which is guaranteed to exist since this Javaiframe is running.
  var iframe = document.createElement('iframe');
  iframe.src = options.src;
  iframe.width = options.width || 1;
  iframe.height = options.height || 1;
  iframe.style.display = 'none';

  // If we have a fn, attach event handlers, even in IE. Based off of
  // the Third-Party Javascript script loading example:
  // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
  if ('function' == type(fn)) {
    onload(iframe, fn);
  }

  tick(function(){
    // Append after event listeners are attached for IE.
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(iframe, firstScript);
  });

  // Return the iframe element in case they want to do anything special, like
  // give it an ID or attributes.
  return iframe;
};
}, {"script-onload":19,"next-tick":20,"type":21}],
19: [function(require, module, exports) {

// https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html

/**
 * Invoke `fn(err)` when the given `el` script loads.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api public
 */

module.exports = function(el, fn){
  return el.addEventListener
    ? add(el, fn)
    : attach(el, fn);
};

/**
 * Add event listener to `el`, `fn()`.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api private
 */

function add(el, fn){
  el.addEventListener('load', function(_, e){ fn(null, e); }, false);
  el.addEventListener('error', function(e){
    var err = new Error('script error "' + el.src + '"');
    err.event = e;
    fn(err);
  }, false);
}

/**
 * Attach evnet.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api private
 */

function attach(el, fn){
  el.attachEvent('onreadystatechange', function(e){
    if (!/complete|loaded/.test(el.readyState)) return;
    fn(null, e);
  });
  el.attachEvent('onerror', function(e){
    var err = new Error('failed to load the script "' + el.src + '"');
    err.event = e || window.event;
    fn(err);
  });
}

}, {}],
20: [function(require, module, exports) {
"use strict"

if (typeof setImmediate == 'function') {
  module.exports = function(f){ setImmediate(f) }
}
// legacy node.js
else if (typeof process != 'undefined' && typeof process.nextTick == 'function') {
  module.exports = process.nextTick
}
// fallback for other environments / postMessage behaves badly on IE8
else if (typeof window == 'undefined' || window.ActiveXObject || !window.postMessage) {
  module.exports = function(f){ setTimeout(f) };
} else {
  var q = [];

  window.addEventListener('message', function(){
    var i = 0;
    while (i < q.length) {
      try { q[i++](); }
      catch (e) {
        q = q.slice(i);
        window.postMessage('tic!', '*');
        throw e;
      }
    }
    q.length = 0;
  }, true);

  module.exports = function(fn){
    if (!q.length) window.postMessage('tic!', '*');
    q.push(fn);
  }
}

}, {}],
21: [function(require, module, exports) {
/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object Error]': return 'error';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val !== val) return 'nan';
  if (val && val.nodeType === 1) return 'element';

  val = val.valueOf
    ? val.valueOf()
    : Object.prototype.valueOf.apply(val)

  return typeof val;
};

}, {}],
18: [function(require, module, exports) {
;(function(win){
	var store = {},
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage

	store.disabled = false
	store.version = '1.3.17'
	store.set = function(key, value) {}
	store.get = function(key, defaultVal) {}
	store.has = function(key) { return store.get(key) !== undefined }
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (defaultVal == null) {
			defaultVal = {}
		}
		var val = store.get(key, defaultVal)
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {}
	store.forEach = function() {}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key))
			return (val === undefined ? defaultVal : val)
		}
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.getAll = function() {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i)
				callback(key, store.get(key))
			}
		}
	} else if (doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		function ieKeyFix(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key)
			var val = store.deserialize(storage.getAttribute(key))
			return (val === undefined ? defaultVal : val)
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=0, attr; attr=attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(localStorageName)
		})
		store.getAll = function(storage) {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if (store.get(testKey) != testKey) { store.disabled = true }
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled

	if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define(store) }
	else { win.store = store }

})(Function('return this')());

}, {}],
10: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

}, {"indexof":22}],
22: [function(require, module, exports) {
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
}, {}],
11: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var debug = require('debug')('cookie');

/**
 * Set or get cookie `name` with `value` and `options` object.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @return {Mixed}
 * @api public
 */

module.exports = function(name, value, options){
  switch (arguments.length) {
    case 3:
    case 2:
      return set(name, value, options);
    case 1:
      return get(name);
    default:
      return all();
  }
};

/**
 * Set cookie `name` to `value`.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @api private
 */

function set(name, value, options) {
  options = options || {};
  var str = encode(name) + '=' + encode(value);

  if (null == value) options.maxage = -1;

  if (options.maxage) {
    options.expires = new Date(+new Date + options.maxage);
  }

  if (options.path) str += '; path=' + options.path;
  if (options.domain) str += '; domain=' + options.domain;
  if (options.expires) str += '; expires=' + options.expires.toUTCString();
  if (options.secure) str += '; secure';

  document.cookie = str;
}

/**
 * Return all cookies.
 *
 * @return {Object}
 * @api private
 */

function all() {
  return parse(document.cookie);
}

/**
 * Get cookie `name`.
 *
 * @param {String} name
 * @return {String}
 * @api private
 */

function get(name) {
  return all()[name];
}

/**
 * Parse cookie `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parse(str) {
  var obj = {};
  var pairs = str.split(/ *; */);
  var pair;
  if ('' == pairs[0]) return obj;
  for (var i = 0; i < pairs.length; ++i) {
    pair = pairs[i].split('=');
    obj[decode(pair[0])] = decode(pair[1]);
  }
  return obj;
}

/**
 * Encode.
 */

function encode(value){
  try {
    return encodeURIComponent(value);
  } catch (e) {
    debug('error `encode(%o)` - %o', value, e)
  }
}

/**
 * Decode.
 */

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    debug('error `decode(%o)` - %o', value, e)
  }
}

}, {"debug":2}],
12: [function(require, module, exports) {
'use strict';

/**
 * Merge default values.
 *
 * @param {Object} dest
 * @param {Object} defaults
 * @return {Object}
 * @api public
 */
var defaults = function (dest, src, recursive) {
  for (var prop in src) {
    if (recursive && dest[prop] instanceof Object && src[prop] instanceof Object) {
      dest[prop] = defaults(dest[prop], src[prop], true);
    } else if (! (prop in dest)) {
      dest[prop] = src[prop];
    }
  }

  return dest;
};

/**
 * Expose `defaults`.
 */
module.exports = defaults;

}, {}],
13: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var encode = encodeURIComponent;
var decode = decodeURIComponent;
var trim = require('trim');
var type = require('type');

/**
 * Parse the given query `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if ('string' != typeof str) return {};

  str = trim(str);
  if ('' == str) return {};
  if ('?' == str.charAt(0)) str = str.slice(1);

  var obj = {};
  var pairs = str.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var parts = pairs[i].split('=');
    var key = decode(parts[0]);
    var m;

    if (m = /(\w+)\[(\d+)\]/.exec(key)) {
      obj[m[1]] = obj[m[1]] || [];
      obj[m[1]][m[2]] = decode(parts[1]);
      continue;
    }

    obj[parts[0]] = null == parts[1]
      ? ''
      : decode(parts[1]);
  }

  return obj;
};

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

exports.stringify = function(obj){
  if (!obj) return '';
  var pairs = [];

  for (var key in obj) {
    var value = obj[key];

    if ('array' == type(value)) {
      for (var i = 0; i < value.length; ++i) {
        pairs.push(encode(key + '[' + i + ']') + '=' + encode(value[i]));
      }
      continue;
    }

    pairs.push(encode(key) + '=' + encode(obj[key]));
  }

  return pairs.join('&');
};

}, {"trim":23,"type":21}],
23: [function(require, module, exports) {

exports = module.exports = trim;

function trim(str){
  if (str.trim) return str.trim();
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  if (str.trimLeft) return str.trimLeft();
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  if (str.trimRight) return str.trimRight();
  return str.replace(/\s*$/, '');
};

}, {}],
14: [function(require, module, exports) {

/**
 * Taken straight from jed's gist: https://gist.github.com/982883
 *
 * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f, and
 * y is replaced with a random hexadecimal digit from 8 to b.
 */

module.exports = function uuid(a){
  return a           // if the placeholder was passed, return
    ? (              // a random number from 0 to 15
      a ^            // unless b is 8,
      Math.random()  // in which case
      * 16           // a random number from
      >> a/4         // 8 to 11
      ).toString(16) // in hexadecimal
    : (              // or otherwise a concatenated string:
      [1e7] +        // 10000000 +
      -1e3 +         // -1000 +
      -4e3 +         // -4000 +
      -8e3 +         // -80000000 +
      -1e11          // -100000000000,
      ).replace(     // replacing
        /[018]/g,    // zeroes, ones, and eights with
        uuid         // random hex digits
      )
};
}, {}],
15: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
(function(document, navigator, screen, location) {
  'use strict';
  var $defaults, defaults, flashdetect, result, webanalyser;
  defaults = require('defaults');
  flashdetect = require('flashdetect');
  $defaults = {
    sr: screen.width + "x" + screen.height,
    vp: screen.availWidth + "x" + screen.availHeight,
    sd: screen.colorDepth,
    je: navigator.javaEnabled ? navigator.javaEnabled() : false,
    ul: navigator.languages ? navigator.languages[0] : navigator.language || navigator.userLanguage || navigator.browserLanguage
  };

  /**
   * webanalyser
   */
  webanalyser = (function() {
    function webanalyser() {}

    webanalyser.prototype.getResult = function() {
      var rst;
      if (defaults.z == null) {
        rst = {
          dr: document.referrer,
          dh: location.hostname,
          z: new Date().getTime()
        };
        if (flashdetect.installed) {
          rst.fl = flashdetect.major + " " + flashdetect.minor + " " + flashdetect.revisionStr;
        }
        $defaults = defaults(rst, $defaults);
      }
      $defaults.dl = location.href;
      $defaults.dt = document.title;
      return $defaults;
    };

    return webanalyser;

  })();
  result = new webanalyser();
  return module.exports = result;
})(document, navigator, screen, location);

}, {"defaults":12,"flashdetect":24}],
24: [function(require, module, exports) {
/*
Copyright (c) Copyright (c) 2007, Carl S. Yestrau All rights reserved.
Code licensed under the BSD License: http://www.featureblend.com/license.txt
Version: 1.0.4
*/
var flashdetect = new function(){
    var self = this;
    self.installed = false;
    self.raw = "";
    self.major = -1;
    self.minor = -1;
    self.revision = -1;
    self.revisionStr = "";
    var activeXDetectRules = [
        {
            "name":"ShockwaveFlash.ShockwaveFlash.7",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash.6",
            "version":function(obj){
                var version = "6,0,21";
                try{
                    obj.AllowScriptAccess = "always";
                    version = getActiveXVersion(obj);
                }catch(err){}
                return version;
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        }
    ];
    /**
     * Extract the ActiveX version of the plugin.
     * 
     * @param {Object} The flash ActiveX object.
     * @type String
     */
    var getActiveXVersion = function(activeXObj){
        var version = -1;
        try{
            version = activeXObj.GetVariable("$version");
        }catch(err){}
        return version;
    };
    /**
     * Try and retrieve an ActiveX object having a specified name.
     * 
     * @param {String} name The ActiveX object name lookup.
     * @return One of ActiveX object or a simple object having an attribute of activeXError with a value of true.
     * @type Object
     */
    var getActiveXObject = function(name){
        var obj = -1;
        try{
            obj = new ActiveXObject(name);
        }catch(err){
            obj = {activeXError:true};
        }
        return obj;
    };
    /**
     * Parse an ActiveX $version string into an object.
     * 
     * @param {String} str The ActiveX Object GetVariable($version) return value. 
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     * @type Object
     */
    var parseActiveXVersion = function(str){
        var versionArray = str.split(",");//replace with regex
        return {
            "raw":str,
            "major":parseInt(versionArray[0].split(" ")[1], 10),
            "minor":parseInt(versionArray[1], 10),
            "revision":parseInt(versionArray[2], 10),
            "revisionStr":versionArray[2]
        };
    };
    /**
     * Parse a standard enabledPlugin.description into an object.
     * 
     * @param {String} str The enabledPlugin.description value.
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     * @type Object
     */
    var parseStandardVersion = function(str){
        var descParts = str.split(/ +/);
        var majorMinor = descParts[2].split(/\./);
        var revisionStr = descParts[3];
        return {
            "raw":str,
            "major":parseInt(majorMinor[0], 10),
            "minor":parseInt(majorMinor[1], 10), 
            "revisionStr":revisionStr,
            "revision":parseRevisionStrToInt(revisionStr)
        };
    };
    /**
     * Parse the plugin revision string into an integer.
     * 
     * @param {String} The revision in string format.
     * @type Number
     */
    var parseRevisionStrToInt = function(str){
        return parseInt(str.replace(/[a-zA-Z]/g, ""), 10) || self.revision;
    };
    /**
     * Is the major version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required major version.
     * @type Boolean
     */
    self.majorAtLeast = function(version){
        return self.major >= version;
    };
    /**
     * Is the minor version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required minor version.
     * @type Boolean
     */
    self.minorAtLeast = function(version){
        return self.minor >= version;
    };
    /**
     * Is the revision version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required revision version.
     * @type Boolean
     */
    self.revisionAtLeast = function(version){
        return self.revision >= version;
    };
    /**
     * Is the version greater than or equal to a specified major, minor and revision.
     * 
     * @param {Number} major The minimum required major version.
     * @param {Number} (Optional) minor The minimum required minor version.
     * @param {Number} (Optional) revision The minimum required revision version.
     * @type Boolean
     */
    self.versionAtLeast = function(major){
        var properties = [self.major, self.minor, self.revision];
        var len = Math.min(properties.length, arguments.length);
        for(i=0; i<len; i++){
            if(properties[i]>=arguments[i]){
                if(i+1<len && properties[i]==arguments[i]){
                    continue;
                }else{
                    return true;
                }
            }else{
                return false;
            }
        }
    };
    /**
     * Constructor, sets raw, major, minor, revisionStr, revision and installed public properties.
     */
    self.flashdetect = function(){
        if(navigator.plugins && navigator.plugins.length>0){
            var type = 'application/x-shockwave-flash';
            var mimeTypes = navigator.mimeTypes;
            if(mimeTypes && mimeTypes[type] && mimeTypes[type].enabledPlugin && mimeTypes[type].enabledPlugin.description){
                var version = mimeTypes[type].enabledPlugin.description;
                var versionObj = parseStandardVersion(version);
                self.raw = versionObj.raw;
                self.major = versionObj.major;
                self.minor = versionObj.minor; 
                self.revisionStr = versionObj.revisionStr;
                self.revision = versionObj.revision;
                self.installed = true;
            }
        }else if(navigator.appVersion.indexOf("Mac")==-1 && window.execScript){
            var version = -1;
            for(var i=0; i<activeXDetectRules.length && version==-1; i++){
                var obj = getActiveXObject(activeXDetectRules[i].name);
                if(!obj.activeXError){
                    self.installed = true;
                    version = activeXDetectRules[i].version(obj);
                    if(version!=-1){
                        var versionObj = parseActiveXVersion(version);
                        self.raw = versionObj.raw;
                        self.major = versionObj.major;
                        self.minor = versionObj.minor; 
                        self.revision = versionObj.revision;
                        self.revisionStr = versionObj.revisionStr;
                    }
                }
            }
        }
    }();
};
flashdetect.JS_RELEASE = "1.0.4";

module.exports = flashdetect;

}, {}],
16: [function(require, module, exports) {
/*!
 * docReady v1.0.4
 * Cross browser DOMContentLoaded event emitter
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false, require: false, module: false */

( function( window ) {

'use strict';

var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
  // throw out non-functions
  if ( typeof fn !== 'function' ) {
    return;
  }

  if ( docReady.isReady ) {
    // ready now, hit it
    fn();
  } else {
    // queue function when ready
    queue.push( fn );
  }
}

docReady.isReady = false;

// triggered on various doc ready events
function onReady( event ) {
  // bail if already triggered or IE8 document is not ready just yet
  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
  if ( docReady.isReady || isIE8NotReady ) {
    return;
  }

  trigger();
}

function trigger() {
  docReady.isReady = true;
  // process queue
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var fn = queue[i];
    fn();
  }
}

function defineDocReady( eventie ) {
  // trigger ready if page is ready
  if ( document.readyState === 'complete' ) {
    trigger();
  } else {
    // listen for events
    eventie.bind( document, 'DOMContentLoaded', onReady );
    eventie.bind( document, 'readystatechange', onReady );
    eventie.bind( window, 'load', onReady );
  }

  return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [ 'eventie/eventie' ], defineDocReady );
} else if ( typeof exports === 'object' ) {
  module.exports = defineDocReady( require('eventie') );
} else {
  // browser global
  window.docReady = defineDocReady( window.eventie );
}

})( window );

}, {"eventie":25}],
25: [function(require, module, exports) {
/*!
 * eventie v1.0.6
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( window );

}, {}],
17: [function(require, module, exports) {
/*
    json2.js
    2014-02-04

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

(function () {
    'use strict';

    var JSON = module.exports = {};

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

}, {}],
5: [function(require, module, exports) {
/**
 * Module dependencies.
 */

var domify = require('domify');
var each = require('each');
var events = require('event');
var getKeys = require('keys');
var query = require('query');
var trim = require('trim');
var slice = [].slice;

var isArray = Array.isArray || function (val) {
  return !! val && '[object Array]' === Object.prototype.toString.call(val);
};

/**
 * Attributes supported.
 */

var attrs = [
  'id',
  'src',
  'rel',
  'cols',
  'rows',
  'type',
  'name',
  'href',
  'title',
  'style',
  'width',
  'height',
  'action',
  'method',
  'tabindex',
  'placeholder'
];

/*
 * A simple way to check for HTML strings or ID strings
 */

var quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;

/**
 * Expose `dom()`.
 */

module.exports = dom;

/**
 * Return a dom `List` for the given
 * `html`, selector, or element.
 *
 * @param {String|Element|List} selector
 * @param {String|ELement|context} context
 * @return {List}
 * @api public
 */

function dom(selector, context) {
  // array
  if (isArray(selector)) {
    return new List(selector);
  }

  // List
  if (selector instanceof List) {
    return selector;
  }

  // node
  if (selector.nodeName) {
    return new List([selector]);
  }

  if ('string' != typeof selector) {
    throw new TypeError('invalid selector');
  }

  // html
  var htmlselector = trim.left(selector);
  if (isHTML(htmlselector)) {
    return new List([domify(htmlselector)], htmlselector);
  }

  // selector
  var ctx = context
    ? (context instanceof List ? context[0] : context)
    : document;

  return new List(query.all(selector, ctx), selector);
}

/**
 * Static: Expose `List`
 */

dom.List = List;

/**
 * Static: Expose supported attrs.
 */

dom.attrs = attrs;

/**
 * Static: Mixin a function
 *
 * @param {Object|String} name
 * @param {Object|Function} obj
 * @return {List} self
 */

dom.use = function(name, fn) {
  var keys = [];
  var tmp;

  if (2 == arguments.length) {
    keys.push(name);
    tmp = {};
    tmp[name] = fn;
    fn = tmp;
  } else if (name.name) {
    // use function name
    fn = name;
    name = name.name;
    keys.push(name);
    tmp = {};
    tmp[name] = fn;
    fn = tmp;
  } else {
    keys = getKeys(name);
    fn = name;
  }

  for(var i = 0, len = keys.length; i < len; i++) {
    List.prototype[keys[i]] = fn[keys[i]];
  }

  return this;
}

/**
 * Initialize a new `List` with the
 * given array-ish of `els` and `selector`
 * string.
 *
 * @param {Mixed} els
 * @param {String} selector
 * @api private
 */

function List(els, selector) {
  els = els || [];
  var len = this.length = els.length;
  for(var i = 0; i < len; i++) this[i] = els[i];
  this.selector = selector;
}

/**
 * Remake the list
 *
 * @param {String|ELement|context} context
 * @return {List}
 * @api private
 */

List.prototype.dom = dom;

/**
 * Make `List` an array-like object
 */

List.prototype.length = 0;
List.prototype.splice = Array.prototype.splice;

/**
 * Array-like object to array
 *
 * @return {Array}
 */

List.prototype.toArray = function() {
  return slice.call(this);
}

/**
 * Attribute accessors.
 */

each(attrs, function(name){
  List.prototype[name] = function(val){
    if (0 == arguments.length) return this.attr(name);
    return this.attr(name, val);
  };
});

/**
 * Mixin the API
 */

dom.use(require('./lib/attributes'));
dom.use(require('./lib/classes'));
dom.use(require('./lib/events'));
dom.use(require('./lib/manipulate'));
dom.use(require('./lib/traverse'));

/**
 * Check if the string is HTML
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */

function isHTML(str) {
  // Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
  if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

  // Run the regex
  var match = quickExpr.exec(str);
  return !!(match && match[1]);
}

}, {"domify":26,"each":27,"event":28,"keys":29,"query":30,"trim":23,"./lib/attributes":31,"./lib/classes":32,"./lib/events":33,"./lib/manipulate":34,"./lib/traverse":35}],
26: [function(require, module, exports) {

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var div = document.createElement('div');
// Setup
div.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
// Make sure that link elements get serialized correctly by innerHTML
// This requires a wrapper element in IE
var innerHTMLBug = !div.getElementsByTagName('link').length;
div = undefined;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

}, {}],
27: [function(require, module, exports) {

/**
 * Module dependencies.
 */

try {
  var type = require('type');
} catch (err) {
  var type = require('component-type');
}

var toFunction = require('to-function');

/**
 * HOP reference.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Iterate the given `obj` and invoke `fn(val, i)`
 * in optional context `ctx`.
 *
 * @param {String|Array|Object} obj
 * @param {Function} fn
 * @param {Object} [ctx]
 * @api public
 */

module.exports = function(obj, fn, ctx){
  fn = toFunction(fn);
  ctx = ctx || this;
  switch (type(obj)) {
    case 'array':
      return array(obj, fn, ctx);
    case 'object':
      if ('number' == typeof obj.length) return array(obj, fn, ctx);
      return object(obj, fn, ctx);
    case 'string':
      return string(obj, fn, ctx);
  }
};

/**
 * Iterate string chars.
 *
 * @param {String} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */

function string(obj, fn, ctx) {
  for (var i = 0; i < obj.length; ++i) {
    fn.call(ctx, obj.charAt(i), i);
  }
}

/**
 * Iterate object keys.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */

function object(obj, fn, ctx) {
  for (var key in obj) {
    if (has.call(obj, key)) {
      fn.call(ctx, key, obj[key]);
    }
  }
}

/**
 * Iterate array-ish.
 *
 * @param {Array|Object} obj
 * @param {Function} fn
 * @param {Object} ctx
 * @api private
 */

function array(obj, fn, ctx) {
  for (var i = 0; i < obj.length; ++i) {
    fn.call(ctx, obj[i], i);
  }
}

}, {"type":36,"component-type":36,"to-function":37}],
36: [function(require, module, exports) {

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object String]': return 'string';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val && val.nodeType === 1) return 'element';
  if (val === Object(val)) return 'object';

  return typeof val;
};

}, {}],
37: [function(require, module, exports) {

/**
 * Module Dependencies
 */

var expr;
try {
  expr = require('props');
} catch(e) {
  expr = require('component-props');
}

/**
 * Expose `toFunction()`.
 */

module.exports = toFunction;

/**
 * Convert `obj` to a `Function`.
 *
 * @param {Mixed} obj
 * @return {Function}
 * @api private
 */

function toFunction(obj) {
  switch ({}.toString.call(obj)) {
    case '[object Object]':
      return objectToFunction(obj);
    case '[object Function]':
      return obj;
    case '[object String]':
      return stringToFunction(obj);
    case '[object RegExp]':
      return regexpToFunction(obj);
    default:
      return defaultToFunction(obj);
  }
}

/**
 * Default to strict equality.
 *
 * @param {Mixed} val
 * @return {Function}
 * @api private
 */

function defaultToFunction(val) {
  return function(obj){
    return val === obj;
  };
}

/**
 * Convert `re` to a function.
 *
 * @param {RegExp} re
 * @return {Function}
 * @api private
 */

function regexpToFunction(re) {
  return function(obj){
    return re.test(obj);
  };
}

/**
 * Convert property `str` to a function.
 *
 * @param {String} str
 * @return {Function}
 * @api private
 */

function stringToFunction(str) {
  // immediate such as "> 20"
  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

  // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
  return new Function('_', 'return ' + get(str));
}

/**
 * Convert `object` to a function.
 *
 * @param {Object} object
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  var match = {};
  for (var key in obj) {
    match[key] = typeof obj[key] === 'string'
      ? defaultToFunction(obj[key])
      : toFunction(obj[key]);
  }
  return function(val){
    if (typeof val !== 'object') return false;
    for (var key in match) {
      if (!(key in val)) return false;
      if (!match[key](val[key])) return false;
    }
    return true;
  };
}

/**
 * Built the getter function. Supports getter style functions
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function get(str) {
  var props = expr(str);
  if (!props.length) return '_.' + str;

  var val, i, prop;
  for (i = 0; i < props.length; i++) {
    prop = props[i];
    val = '_.' + prop;
    val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";

    // mimic negative lookbehind to avoid problems with nested properties
    str = stripNested(prop, str, val);
  }

  return str;
}

/**
 * Mimic negative lookbehind to avoid problems with nested properties.
 *
 * See: http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript
 *
 * @param {String} prop
 * @param {String} str
 * @param {String} val
 * @return {String}
 * @api private
 */

function stripNested (prop, str, val) {
  return str.replace(new RegExp('(\\.)?' + prop, 'g'), function($0, $1) {
    return $1 ? $0 : val;
  });
}

}, {"props":38,"component-props":38}],
38: [function(require, module, exports) {
/**
 * Global Names
 */

var globals = /\b(this|Array|Date|Object|Math|JSON)\b/g;

/**
 * Return immediate identifiers parsed from `str`.
 *
 * @param {String} str
 * @param {String|Function} map function or prefix
 * @return {Array}
 * @api public
 */

module.exports = function(str, fn){
  var p = unique(props(str));
  if (fn && 'string' == typeof fn) fn = prefixed(fn);
  if (fn) return map(str, p, fn);
  return p;
};

/**
 * Return immediate identifiers in `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function props(str) {
  return str
    .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
    .replace(globals, '')
    .match(/[$a-zA-Z_]\w*/g)
    || [];
}

/**
 * Return `str` with `props` mapped with `fn`.
 *
 * @param {String} str
 * @param {Array} props
 * @param {Function} fn
 * @return {String}
 * @api private
 */

function map(str, props, fn) {
  var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
  return str.replace(re, function(_){
    if ('(' == _[_.length - 1]) return fn(_);
    if (!~props.indexOf(_)) return _;
    return fn(_);
  });
}

/**
 * Return unique array.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

function unique(arr) {
  var ret = [];

  for (var i = 0; i < arr.length; i++) {
    if (~ret.indexOf(arr[i])) continue;
    ret.push(arr[i]);
  }

  return ret;
}

/**
 * Map with prefix `str`.
 */

function prefixed(str) {
  return function(_){
    return str + _;
  };
}

}, {}],
28: [function(require, module, exports) {
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
}, {}],
29: [function(require, module, exports) {
var has = Object.prototype.hasOwnProperty;

module.exports = Object.keys || function(obj){
  var keys = [];

  for (var key in obj) {
    if (has.call(obj, key)) {
      keys.push(key);
    }
  }

  return keys;
};

}, {}],
30: [function(require, module, exports) {
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

}, {}],
31: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var value = require('value');

/**
 * Set attribute `name` to `val`, or get attr `name`.
 *
 * @param {String} name
 * @param {String} [val]
 * @return {String|List} self
 * @api public
 */

exports.attr = function(name, val){
  // get
  if (1 == arguments.length) {
    return this[0] && this[0].getAttribute(name);
  }

  // remove
  if (null == val) {
    return this.removeAttr(name);
  }

  // set
  return this.forEach(function(el){
    el.setAttribute(name, val);
  });
};

/**
 * Remove attribute `name`.
 *
 * @param {String} name
 * @return {List} self
 * @api public
 */

exports.removeAttr = function(name){
  return this.forEach(function(el){
    el.removeAttribute(name);
  });
};

/**
 * Set property `name` to `val`, or get property `name`.
 *
 * @param {String} name
 * @param {String} [val]
 * @return {Object|List} self
 * @api public
 */

exports.prop = function(name, val){
  if (1 == arguments.length) {
    return this[0] && this[0][name];
  }

  return this.forEach(function(el){
    el[name] = val;
  });
};

/**
 * Get the first element's value or set selected
 * element values to `val`.
 *
 * @param {Mixed} [val]
 * @return {Mixed}
 * @api public
 */

exports.val =
exports.value = function(val){
  if (0 == arguments.length) {
    return this[0]
      ? value(this[0])
      : undefined;
  }

  return this.forEach(function(el){
    value(el, val);
  });
};

}, {"value":39}],
39: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var typeOf = require('type');

/**
 * Set or get `el`'s' value.
 *
 * @param {Element} el
 * @param {Mixed} val
 * @return {Mixed}
 * @api public
 */

module.exports = function(el, val){
  if (2 == arguments.length) return set(el, val);
  return get(el);
};

/**
 * Get `el`'s value.
 */

function get(el) {
  switch (type(el)) {
    case 'checkbox':
    case 'radio':
      if (el.checked) {
        var attr = el.getAttribute('value');
        return null == attr ? true : attr;
      } else {
        return false;
      }
    case 'radiogroup':
      for (var i = 0, radio; radio = el[i]; i++) {
        if (radio.checked) return radio.value;
      }
      break;
    case 'select':
      for (var i = 0, option; option = el.options[i]; i++) {
        if (option.selected) return option.value;
      }
      break;
    default:
      return el.value;
  }
}

/**
 * Set `el`'s value.
 */

function set(el, val) {
  switch (type(el)) {
    case 'checkbox':
    case 'radio':
      if (val) {
        el.checked = true;
      } else {
        el.checked = false;
      }
      break;
    case 'radiogroup':
      for (var i = 0, radio; radio = el[i]; i++) {
        radio.checked = radio.value === val;
      }
      break;
    case 'select':
      for (var i = 0, option; option = el.options[i]; i++) {
        option.selected = option.value === val;
      }
      break;
    default:
      el.value = val;
  }
}

/**
 * Element type.
 */

function type(el) {
  var group = 'array' == typeOf(el) || 'object' == typeOf(el);
  if (group) el = el[0];
  var name = el.nodeName.toLowerCase();
  var type = el.getAttribute('type');

  if (group && type && 'radio' == type.toLowerCase()) return 'radiogroup';
  if ('input' == name && type && 'checkbox' == type.toLowerCase()) return 'checkbox';
  if ('input' == name && type && 'radio' == type.toLowerCase()) return 'radio';
  if ('select' == name) return 'select';
  return name;
}

}, {"type":21}],
32: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var classes = require('classes');

/**
 * Add the given class `name`.
 *
 * @param {String} name
 * @return {List} self
 * @api public
 */

exports.addClass = function(name){
  return this.forEach(function(el) {
    el._classes = el._classes || classes(el);
    el._classes.add(name);
  });
};

/**
 * Remove the given class `name`.
 *
 * @param {String|RegExp} name
 * @return {List} self
 * @api public
 */

exports.removeClass = function(name){
  return this.forEach(function(el) {
    el._classes = el._classes || classes(el);
    el._classes.remove(name);
  });
};

/**
 * Toggle the given class `name`,
 * optionally a `bool` may be given
 * to indicate that the class should
 * be added when truthy.
 *
 * @param {String} name
 * @param {Boolean} bool
 * @return {List} self
 * @api public
 */

exports.toggleClass = function(name, bool){
  var fn = 'toggle';

  // toggle with boolean
  if (2 == arguments.length) {
    fn = bool ? 'add' : 'remove';
  }

  return this.forEach(function(el) {
    el._classes = el._classes || classes(el);
    el._classes[fn](name);
  })
};

/**
 * Check if the given class `name` is present.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

exports.hasClass = function(name){
  var el;

  for(var i = 0, len = this.length; i < len; i++) {
    el = this[i];
    el._classes = el._classes || classes(el);
    if (el._classes.has(name)) return true;
  }

  return false;
};

}, {"classes":40}],
40: [function(require, module, exports) {
/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name, force){
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var str = this.el.className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

}, {"indexof":22}],
33: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var events = require('event');
var delegate = require('delegate');

/**
 * Bind to `event` and invoke `fn(e)`. When
 * a `selector` is given then events are delegated.
 *
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {List}
 * @api public
 */

exports.on = function(event, selector, fn, capture){
  if ('string' == typeof selector) {
    return this.forEach(function (el) {
      fn._delegate = delegate.bind(el, selector, event, fn, capture);
    });
  }

  capture = fn;
  fn = selector;

  return this.forEach(function (el) {
    events.bind(el, event, fn, capture);
  });
};

/**
 * Unbind to `event` and invoke `fn(e)`. When
 * a `selector` is given then delegated event
 * handlers are unbound.
 *
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {List}
 * @api public
 */

exports.off = function(event, selector, fn, capture){
  if ('string' == typeof selector) {
    return this.forEach(function (el) {
      // TODO: add selector support back
      delegate.unbind(el, event, fn._delegate, capture);
    });
  }

  capture = fn;
  fn = selector;

  return this.forEach(function (el) {
    events.unbind(el, event, fn, capture);
  });
};

}, {"event":28,"delegate":41}],
41: [function(require, module, exports) {
/**
 * Module dependencies.
 */

var closest = require('closest')
  , event = require('event');

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, selector, type, fn, capture){
  return event.bind(el, type, function(e){
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true, el);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  event.unbind(el, type, fn, capture);
};

}, {"closest":42,"event":28}],
42: [function(require, module, exports) {
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf, root) {
  element = checkYoSelf ? {parentNode: element} : element

  root = root || document

  // Make sure `element !== document` and `element != null`
  // otherwise we get an illegal invocation
  while ((element = element.parentNode) && element !== document) {
    if (matches(element, selector))
      return element
    // After `matches` on the edge case that
    // the selector matches the root
    // (when the root is not the document)
    if (element === root)
      return
  }
}

}, {"matches-selector":43}],
43: [function(require, module, exports) {
/**
 * Module dependencies.
 */

var query = require('query');

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

}, {"query":30}],
34: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var value = require('value');
var css = require('css');
var text = require('text');

/**
 * Return element text.
 *
 * @param {String} str
 * @return {String|List}
 * @api public
 */

exports.text = function(str) {
  if (1 == arguments.length) {
    return this.forEach(function(el) {
      if (11 == el.nodeType) {
        var node;
        while (node = el.firstChild) el.removeChild(node);
        el.appendChild(document.createTextNode(str));
      } else {
        text(el, str);
      }
    });
  }

  var out = '';
  this.forEach(function(el) {
    if (11 == el.nodeType) {
      out += getText(el.firstChild);
    } else {
      out += text(el);
    }
  });

  return out;
};

/**
 * Get text helper from Sizzle.
 *
 * Source: https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L914-L947
 *
 * @param {Element|Array} el
 * @return {String}
 */

function getText(el) {
  var ret = '';
  var type = el.nodeType;
  var node;

  switch(type) {
    case 1:
    case 9:
      ret = text(el);
      break;
    case 11:
      ret = el.textContent || el.innerText;
      break;
    case 3:
    case 4:
      return el.nodeValue;
    default:
      while (node = el[i++]) {
        ret += getText(node);
      }
  }

  return ret;
}

/**
 * Return element html.
 *
 * @return {String} html
 * @api public
 */

exports.html = function(html) {
  if (1 == arguments.length) {
    return this.forEach(function(el) {
      el.innerHTML = html;
    });
  }

  // TODO: real impl
  return this[0] && this[0].innerHTML;
};

/**
 * Get and set the css value
 *
 * @param {String|Object} prop
 * @param {Mixed} val
 * @return {Mixed}
 * @api public
 */

exports.css = function(prop, val) {
  // getter
  if (!val && 'object' != typeof prop) {
    return css(this[0], prop);
  }
  // setter
  this.forEach(function(el) {
    css(el, prop, val);
  });

  return this;
};

/**
 * Prepend `val`.
 *
 * From jQuery: if there is more than one target element
 * cloned copies of the inserted element will be created
 * for each target after the first.
 *
 * @param {String|Element|List} val
 * @return {List} self
 * @api public
 */

exports.prepend = function(val) {
  var dom = this.dom;

  this.forEach(function(target, i) {
    dom(val).forEach(function(selector) {
      selector = i ? selector.cloneNode(true) : selector;
      if (target.children.length) {
        target.insertBefore(selector, target.firstChild);
      } else {
        target.appendChild(selector);
      }
    });
  });

  return this;
};

/**
 * Append `val`.
 *
 * From jQuery: if there is more than one target element
 * cloned copies of the inserted element will be created
 * for each target after the first.
 *
 * @param {String|Element|List} val
 * @return {List} self
 * @api public
 */

exports.append = function(val) {
  var dom = this.dom;

  this.forEach(function(target, i) {
    dom(val).forEach(function(el) {
      el = i ? el.cloneNode(true) : el;
      target.appendChild(el);
    });
  });

  return this;
};

/**
 * Insert self's `els` after `val`
 *
 * From jQuery: if there is more than one target element,
 * cloned copies of the inserted element will be created
 * for each target after the first, and that new set
 * (the original element plus clones) is returned.
 *
 * @param {String|Element|List} val
 * @return {List} self
 * @api public
 */

exports.insertAfter = function(val) {
  var dom = this.dom;

  this.forEach(function(el) {
    dom(val).forEach(function(target, i) {
      if (!target.parentNode) return;
      el = i ? el.cloneNode(true) : el;
      target.parentNode.insertBefore(el, target.nextSibling);
    });
  });

  return this;
};

/**
 * Append self's `el` to `val`
 *
 * @param {String|Element|List} val
 * @return {List} self
 * @api public
 */

exports.appendTo = function(val) {
  this.dom(val).append(this);
  return this;
};

/**
 * Replace elements in the DOM.
 *
 * @param {String|Element|List} val
 * @return {List} self
 * @api public
 */

exports.replace = function(val) {
  var self = this;
  var list = this.dom(val);

  list.forEach(function(el, i) {
    var old = self[i];
    var parent = old.parentNode;
    if (!parent) return;
    el = i ? el.cloneNode(true) : el;
    parent.replaceChild(el, old);
  });

  return this;
};

/**
 * Empty the dom list
 *
 * @return self
 * @api public
 */

exports.empty = function() {
  return this.forEach(function(el) {
    text(el, "");
  });
};

/**
 * Remove all elements in the dom list
 *
 * @return {List} self
 * @api public
 */

exports.remove = function() {
  return this.forEach(function(el) {
    var parent = el.parentNode;
    if (parent) parent.removeChild(el);
  });
};

/**
 * Return a cloned dom list with all elements cloned.
 *
 * @return {List}
 * @api public
 */

exports.clone = function() {
  var out = this.map(function(el) {
    return el.cloneNode(true);
  });

  return this.dom(out);
};

/**
 * Focus the first dom element in our list.
 * 
 * @return {List} self
 * @api public
 */

exports.focus = function(){
  this[0].focus();
  return this;
};

}, {"value":39,"css":44,"text":45}],
44: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var debug = require('debug')('css');
var set = require('./lib/style');
var get = require('./lib/css');

/**
 * Expose `css`
 */

module.exports = css;

/**
 * Get and set css values
 *
 * @param {Element} el
 * @param {String|Object} prop
 * @param {Mixed} val
 * @return {Element} el
 * @api public
 */

function css(el, prop, val) {
  if (!el) return;

  if (undefined !== val) {
    var obj = {};
    obj[prop] = val;
    debug('setting styles %j', obj);
    return setStyles(el, obj);
  }

  if ('object' == typeof prop) {
    debug('setting styles %j', prop);
    return setStyles(el, prop);
  }

  debug('getting %s', prop);
  return get(el, prop);
}

/**
 * Set the styles on an element
 *
 * @param {Element} el
 * @param {Object} props
 * @return {Element} el
 */

function setStyles(el, props) {
  for (var prop in props) {
    set(el, prop, props[prop]);
  }

  return el;
}

}, {"debug":2,"./lib/style":46,"./lib/css":47}],
46: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var debug = require('debug')('css:style');
var camelcase = require('to-camel-case');
var support = require('./support');
var property = require('./prop');
var hooks = require('./hooks');

/**
 * Expose `style`
 */

module.exports = style;

/**
 * Possibly-unitless properties
 *
 * Don't automatically add 'px' to these properties
 */

var cssNumber = {
  "columnCount": true,
  "fillOpacity": true,
  "fontWeight": true,
  "lineHeight": true,
  "opacity": true,
  "order": true,
  "orphans": true,
  "widows": true,
  "zIndex": true,
  "zoom": true
};

/**
 * Set a css value
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Mixed} val
 * @param {Mixed} extra
 */

function style(el, prop, val, extra) {
  // Don't set styles on text and comment nodes
  if (!el || el.nodeType === 3 || el.nodeType === 8 || !el.style ) return;

  var orig = camelcase(prop);
  var style = el.style;
  var type = typeof val;

  if (!val) return get(el, prop, orig, extra);

  prop = property(prop, style);

  var hook = hooks[prop] || hooks[orig];

  // If a number was passed in, add 'px' to the (except for certain CSS properties)
  if ('number' == type && !cssNumber[orig]) {
    debug('adding "px" to end of number');
    val += 'px';
  }

  // Fixes jQuery #8908, it can be done more correctly by specifying setters in cssHooks,
  // but it would mean to define eight (for every problematic property) identical functions
  if (!support.clearCloneStyle && '' === val && 0 === prop.indexOf('background')) {
    debug('set property (%s) value to "inherit"', prop);
    style[prop] = 'inherit';
  }

  // If a hook was provided, use that value, otherwise just set the specified value
  if (!hook || !hook.set || undefined !== (val = hook.set(el, val, extra))) {
    // Support: Chrome, Safari
    // Setting style to blank string required to delete "style: x !important;"
    debug('set hook defined. setting property (%s) to %s', prop, val);
    style[prop] = '';
    style[prop] = val;
  }

}

/**
 * Get the style
 *
 * @param {Element} el
 * @param {String} prop
 * @param {String} orig
 * @param {Mixed} extra
 * @return {String}
 */

function get(el, prop, orig, extra) {
  var style = el.style;
  var hook = hooks[prop] || hooks[orig];
  var ret;

  if (hook && hook.get && undefined !== (ret = hook.get(el, false, extra))) {
    debug('get hook defined, returning: %s', ret);
    return ret;
  }

  ret = style[prop];
  debug('getting %s', ret);
  return ret;
}

}, {"debug":2,"to-camel-case":48,"./support":49,"./prop":50,"./hooks":51}],
48: [function(require, module, exports) {

var toSpace = require('to-space-case');


/**
 * Expose `toCamelCase`.
 */

module.exports = toCamelCase;


/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */


function toCamelCase (string) {
  return toSpace(string).replace(/\s(\w)/g, function (matches, letter) {
    return letter.toUpperCase();
  });
}
}, {"to-space-case":52}],
52: [function(require, module, exports) {

var clean = require('to-no-case');


/**
 * Expose `toSpaceCase`.
 */

module.exports = toSpaceCase;


/**
 * Convert a `string` to space case.
 *
 * @param {String} string
 * @return {String}
 */


function toSpaceCase (string) {
  return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
    return match ? ' ' + match : '';
  });
}
}, {"to-no-case":53}],
53: [function(require, module, exports) {

/**
 * Expose `toNoCase`.
 */

module.exports = toNoCase;


/**
 * Test whether a string is camel-case.
 */

var hasSpace = /\s/;
var hasCamel = /[a-z][A-Z]/;
var hasSeparator = /[\W_]/;


/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */

function toNoCase (string) {
  if (hasSpace.test(string)) return string.toLowerCase();

  if (hasSeparator.test(string)) string = unseparate(string);
  if (hasCamel.test(string)) string = uncamelize(string);
  return string.toLowerCase();
}


/**
 * Separator splitter.
 */

var separatorSplitter = /[\W_]+(.|$)/g;


/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function unseparate (string) {
  return string.replace(separatorSplitter, function (m, next) {
    return next ? ' ' + next : '';
  });
}


/**
 * Camelcase splitter.
 */

var camelSplitter = /(.)([A-Z]+)/g;


/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function uncamelize (string) {
  return string.replace(camelSplitter, function (m, previous, uppers) {
    return previous + ' ' + uppers.toLowerCase().split('').join(' ');
  });
}
}, {}],
49: [function(require, module, exports) {
/**
 * Support values
 */

var reliableMarginRight;
var boxSizingReliableVal;
var pixelPositionVal;
var clearCloneStyle;

/**
 * Container setup
 */

var docElem = document.documentElement;
var container = document.createElement('div');
var div = document.createElement('div');

/**
 * Clear clone style
 */

div.style.backgroundClip = 'content-box';
div.cloneNode(true).style.backgroundClip = '';
exports.clearCloneStyle = div.style.backgroundClip === 'content-box';

container.style.cssText = 'border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px';
container.appendChild(div);

/**
 * Pixel position
 *
 * Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
 * getComputedStyle returns percent when specified for top/left/bottom/right
 * rather than make the css module depend on the offset module, we just check for it here
 */

exports.pixelPosition = function() {
  if (undefined == pixelPositionVal) computePixelPositionAndBoxSizingReliable();
  return pixelPositionVal;
}

/**
 * Reliable box sizing
 */

exports.boxSizingReliable = function() {
  if (undefined == boxSizingReliableVal) computePixelPositionAndBoxSizingReliable();
  return boxSizingReliableVal;
}

/**
 * Reliable margin right
 *
 * Support: Android 2.3
 * Check if div with explicit width and no margin-right incorrectly
 * gets computed margin-right based on width of container. (#3333)
 * WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
 * This support function is only executed once so no memoizing is needed.
 *
 * @return {Boolean}
 */

exports.reliableMarginRight = function() {
  var ret;
  var marginDiv = div.appendChild(document.createElement("div" ));

  marginDiv.style.cssText = div.style.cssText = divReset;
  marginDiv.style.marginRight = marginDiv.style.width = "0";
  div.style.width = "1px";
  docElem.appendChild(container);

  ret = !parseFloat(window.getComputedStyle(marginDiv, null).marginRight);

  docElem.removeChild(container);

  // Clean up the div for other support tests.
  div.innerHTML = "";

  return ret;
}

/**
 * Executing both pixelPosition & boxSizingReliable tests require only one layout
 * so they're executed at the same time to save the second computation.
 */

function computePixelPositionAndBoxSizingReliable() {
  // Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
  div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
    "box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;" +
    "position:absolute;top:1%";
  docElem.appendChild(container);

  var divStyle = window.getComputedStyle(div, null);
  pixelPositionVal = divStyle.top !== "1%";
  boxSizingReliableVal = divStyle.width === "4px";

  docElem.removeChild(container);
}



}, {}],
50: [function(require, module, exports) {
/**
 * Module dependencies
 */

var debug = require('debug')('css:prop');
var camelcase = require('to-camel-case');
var vendor = require('./vendor');

/**
 * Export `prop`
 */

module.exports = prop;

/**
 * Normalize Properties
 */

var cssProps = {
  'float': 'cssFloat' in document.documentElement.style ? 'cssFloat' : 'styleFloat'
};

/**
 * Get the vendor prefixed property
 *
 * @param {String} prop
 * @param {String} style
 * @return {String} prop
 * @api private
 */

function prop(prop, style) {
  prop = cssProps[prop] || (cssProps[prop] = vendor(prop, style));
  debug('transform property: %s => %s', prop, style);
  return prop;
}

}, {"debug":2,"to-camel-case":48,"./vendor":54}],
54: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var prefixes = ['Webkit', 'O', 'Moz', 'ms'];

/**
 * Expose `vendor`
 */

module.exports = vendor;

/**
 * Get the vendor prefix for a given property
 *
 * @param {String} prop
 * @param {Object} style
 * @return {String}
 */

function vendor(prop, style) {
  // shortcut for names that are not vendor prefixed
  if (style[prop]) return prop;

  // check for vendor prefixed names
  var capName = prop[0].toUpperCase() + prop.slice(1);
  var original = prop;
  var i = prefixes.length;

  while (i--) {
    prop = prefixes[i] + capName;
    if (prop in style) return prop;
  }

  return original;
}

}, {}],
51: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var each = require('each');
var css = require('./css');
var cssShow = { position: 'absolute', visibility: 'hidden', display: 'block' };
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;
var rnumnonpx = new RegExp( '^(' + pnum + ')(?!px)[a-z%]+$', 'i');
var rnumsplit = new RegExp( '^(' + pnum + ')(.*)$', 'i');
var rdisplayswap = /^(none|table(?!-c[ea]).+)/;
var styles = require('./styles');
var support = require('./support');
var swap = require('./swap');
var computed = require('./computed');
var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

/**
 * Height & Width
 */

each(['width', 'height'], function(name) {
  exports[name] = {};

  exports[name].get = function(el, compute, extra) {
    if (!compute) return;
    // certain elements can have dimension info if we invisibly show them
    // however, it must have a current display style that would benefit from this
    return 0 == el.offsetWidth && rdisplayswap.test(css(el, 'display'))
      ? swap(el, cssShow, function() { return getWidthOrHeight(el, name, extra); })
      : getWidthOrHeight(el, name, extra);
  }

  exports[name].set = function(el, val, extra) {
    var styles = extra && styles(el);
    return setPositiveNumber(el, val, extra
      ? augmentWidthOrHeight(el, name, extra, 'border-box' == css(el, 'boxSizing', false, styles), styles)
      : 0
    );
  };

});

/**
 * Opacity
 */

exports.opacity = {};
exports.opacity.get = function(el, compute) {
  if (!compute) return;
  var ret = computed(el, 'opacity');
  return '' == ret ? '1' : ret;
}

/**
 * Utility: Set Positive Number
 *
 * @param {Element} el
 * @param {Mixed} val
 * @param {Number} subtract
 * @return {Number}
 */

function setPositiveNumber(el, val, subtract) {
  var matches = rnumsplit.exec(val);
  return matches ?
    // Guard against undefined 'subtract', e.g., when used as in cssHooks
    Math.max(0, matches[1]) + (matches[2] || 'px') :
    val;
}

/**
 * Utility: Get the width or height
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Mixed} extra
 * @return {String}
 */

function getWidthOrHeight(el, prop, extra) {
  // Start with offset property, which is equivalent to the border-box value
  var valueIsBorderBox = true;
  var val = prop === 'width' ? el.offsetWidth : el.offsetHeight;
  var styles = computed(el);
  var isBorderBox = support.boxSizing && css(el, 'boxSizing') === 'border-box';

  // some non-html elements return undefined for offsetWidth, so check for null/undefined
  // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
  // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
  if (val <= 0 || val == null) {
    // Fall back to computed then uncomputed css if necessary
    val = computed(el, prop, styles);

    if (val < 0 || val == null) {
      val = el.style[prop];
    }

    // Computed unit is not pixels. Stop here and return.
    if (rnumnonpx.test(val)) {
      return val;
    }

    // we need the check for style in case a browser which returns unreliable values
    // for getComputedStyle silently falls back to the reliable el.style
    valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === el.style[prop]);

    // Normalize ', auto, and prepare for extra
    val = parseFloat(val) || 0;
  }

  // use the active box-sizing model to add/subtract irrelevant styles
  extra = extra || (isBorderBox ? 'border' : 'content');
  val += augmentWidthOrHeight(el, prop, extra, valueIsBorderBox, styles);
  return val + 'px';
}

/**
 * Utility: Augment the width or the height
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Mixed} extra
 * @param {Boolean} isBorderBox
 * @param {Array} styles
 */

function augmentWidthOrHeight(el, prop, extra, isBorderBox, styles) {
  // If we already have the right measurement, avoid augmentation,
  // Otherwise initialize for horizontal or vertical properties
  var i = extra === (isBorderBox ? 'border' : 'content') ? 4 : 'width' == prop ? 1 : 0;
  var val = 0;

  for (; i < 4; i += 2) {
    // both box models exclude margin, so add it if we want it
    if (extra === 'margin') {
      val += css(el, extra + cssExpand[i], true, styles);
    }

    if (isBorderBox) {
      // border-box includes padding, so remove it if we want content
      if (extra === 'content') {
        val -= css(el, 'padding' + cssExpand[i], true, styles);
      }

      // at this point, extra isn't border nor margin, so remove border
      if (extra !== 'margin') {
        val -= css(el, 'border' + cssExpand[i] + 'Width', true, styles);
      }
    } else {
      // at this point, extra isn't content, so add padding
      val += css(el, 'padding' + cssExpand[i], true, styles);

      // at this point, extra isn't content nor padding, so add border
      if (extra !== 'padding') {
        val += css(el, 'border' + cssExpand[i] + 'Width', true, styles);
      }
    }
  }

  return val;
}

}, {"each":27,"./css":47,"./styles":55,"./support":49,"./swap":56,"./computed":57}],
47: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var debug = require('debug')('css:css');
var camelcase = require('to-camel-case');
var computed = require('./computed');
var property = require('./prop');

/**
 * Expose `css`
 */

module.exports = css;

/**
 * CSS Normal Transforms
 */

var cssNormalTransform = {
  letterSpacing: 0,
  fontWeight: 400
};

/**
 * Get a CSS value
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Mixed} extra
 * @param {Array} styles
 * @return {String}
 */

function css(el, prop, extra, styles) {
  var hooks = require('./hooks');
  var orig = camelcase(prop);
  var style = el.style;
  var val;

  prop = property(prop, style);
  var hook = hooks[prop] || hooks[orig];

  // If a hook was provided get the computed value from there
  if (hook && hook.get) {
    debug('get hook provided. use that');
    val = hook.get(el, true, extra);
  }

  // Otherwise, if a way to get the computed value exists, use that
  if (undefined == val) {
    debug('fetch the computed value of %s', prop);
    val = computed(el, prop);
  }

  if ('normal' == val && cssNormalTransform[prop]) {
    val = cssNormalTransform[prop];
    debug('normal => %s', val);
  }

  // Return, converting to number if forced or a qualifier was provided and val looks numeric
  if ('' == extra || extra) {
    debug('converting value: %s into a number', val);
    var num = parseFloat(val);
    return true === extra || isNumeric(num) ? num || 0 : val;
  }

  return val;
}

/**
 * Is Numeric
 *
 * @param {Mixed} obj
 * @return {Boolean}
 */

function isNumeric(obj) {
  return !isNan(parseFloat(obj)) && isFinite(obj);
}

}, {"debug":2,"to-camel-case":48,"./computed":57,"./prop":50,"./hooks":51}],
57: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var debug = require('debug')('css:computed');
var withinDocument = require('within-document');
var styles = require('./styles');

/**
 * Expose `computed`
 */

module.exports = computed;

/**
 * Get the computed style
 *
 * @param {Element} el
 * @param {String} prop
 * @param {Array} precomputed (optional)
 * @return {Array}
 * @api private
 */

function computed(el, prop, precomputed) {
  var computed = precomputed || styles(el);
  var ret;
  
  if (!computed) return;

  if (computed.getPropertyValue) {
    ret = computed.getPropertyValue(prop) || computed[prop];
  } else {
    ret = computed[prop];
  }

  if ('' === ret && !withinDocument(el)) {
    debug('element not within document, try finding from style attribute');
    var style = require('./style');
    ret = style(el, prop);
  }

  debug('computed value of %s: %s', prop, ret);

  // Support: IE
  // IE returns zIndex value as an integer.
  return undefined === ret ? ret : ret + '';
}

}, {"debug":2,"within-document":58,"./styles":55,"./style":46}],
58: [function(require, module, exports) {

/**
 * Check if `el` is within the document.
 *
 * @param {Element} el
 * @return {Boolean}
 * @api private
 */

module.exports = function(el) {
  var node = el;
  while (node = node.parentNode) {
    if (node == document) return true;
  }
  return false;
};
}, {}],
55: [function(require, module, exports) {
/**
 * Expose `styles`
 */

module.exports = styles;

/**
 * Get all the styles
 *
 * @param {Element} el
 * @return {Array}
 */

function styles(el) {
  if (window.getComputedStyle) {
    return el.ownerDocument.defaultView.getComputedStyle(el, null);
  } else {
    return el.currentStyle;
  }
}

}, {}],
56: [function(require, module, exports) {
/**
 * Export `swap`
 */

module.exports = swap;

/**
 * Initialize `swap`
 *
 * @param {Element} el
 * @param {Object} options
 * @param {Function} fn
 * @param {Array} args
 * @return {Mixed}
 */

function swap(el, options, fn, args) {
  // Remember the old values, and insert the new ones
  for (var key in options) {
    old[key] = el.style[key];
    el.style[key] = options[key];
  }

  ret = fn.apply(el, args || []);

  // Revert the old values
  for (key in options) {
    el.style[key] = old[key];
  }

  return ret;
}

}, {}],
45: [function(require, module, exports) {

var text = 'innerText' in document.createElement('div')
  ? 'innerText'
  : 'textContent'

module.exports = function (el, val) {
  if (val == null) return el[text];
  el[text] = val;
};

}, {}],
35: [function(require, module, exports) {
/**
 * Module Dependencies
 */

var proto = Array.prototype;
var each = require('each');
var traverse = require('traverse');
var toFunction = require('to-function');
var matches = require('matches-selector');

/**
 * Find children matching the given `selector`.
 *
 * @param {String} selector
 * @return {List}
 * @api public
 */

exports.find = function(selector){
  return this.dom(selector, this);
};

/**
 * Check if the any element in the selection
 * matches `selector`.
 *
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

exports.is = function(selector){
  for(var i = 0, el; el = this[i]; i++) {
    if (matches(el, selector)) return true;
  }

  return false;
};

/**
 * Get parent(s) with optional `selector` and `limit`
 *
 * @param {String} selector
 * @param {Number} limit
 * @return {List}
 * @api public
 */

exports.parent = function(selector, limit){
  return this.dom(traverse('parentNode',
    this[0],
    selector,
    limit
    || 1));
};

/**
 * Get next element(s) with optional `selector` and `limit`.
 *
 * @param {String} selector
 * @param {Number} limit
 * @retrun {List}
 * @api public
 */

exports.next = function(selector, limit){
  return this.dom(traverse('nextSibling',
    this[0],
    selector,
    limit
    || 1));
};

/**
 * Get previous element(s) with optional `selector` and `limit`.
 *
 * @param {String} selector
 * @param {Number} limit
 * @return {List}
 * @api public
 */

exports.prev =
exports.previous = function(selector, limit){
  return this.dom(traverse('previousSibling',
    this[0],
    selector,
    limit
    || 1));
};

/**
 * Iterate over each element creating a new list with
 * one item and invoking `fn(list, i)`.
 *
 * @param {Function} fn
 * @return {List} self
 * @api public
 */

exports.each = function(fn){
  var dom = this.dom;

  for (var i = 0, list, len = this.length; i < len; i++) {
    list = dom(this[i]);
    fn.call(list, list, i);
  }

  return this;
};

/**
 * Iterate over each element and invoke `fn(el, i)`
 *
 * @param {Function} fn
 * @return {List} self
 * @api public
 */

exports.forEach = function(fn) {
  for (var i = 0, len = this.length; i < len; i++) {
    fn.call(this[i], this[i], i);
  }

  return this;
};

/**
 * Map each return value from `fn(val, i)`.
 *
 * Passing a callback function:
 *
 *    inputs.map(function(input){
 *      return input.type
 *    })
 *
 * Passing a property string:
 *
 *    inputs.map('type')
 *
 * @param {Function} fn
 * @return {List} self
 * @api public
 */

exports.map = function(fn){
  fn = toFunction(fn);
  var dom = this.dom;
  var out = [];

  for (var i = 0, len = this.length; i < len; i++) {
    out.push(fn.call(dom(this[i]), this[i], i));
  }

  return this.dom(out);
};

/**
 * Select all values that return a truthy value of `fn(val, i)`.
 *
 *    inputs.select(function(input){
 *      return input.type == 'password'
 *    })
 *
 *  With a property:
 *
 *    inputs.select('type == password')
 *
 * @param {Function|String} fn
 * @return {List} self
 * @api public
 */

exports.filter =
exports.select = function(fn){
  fn = toFunction(fn);
  var dom = this.dom;
  var out = [];
  var val;

  for (var i = 0, len = this.length; i < len; i++) {
    val = fn.call(dom(this[i]), this[i], i);
    if (val) out.push(this[i]);
  }

  return this.dom(out);
};

/**
 * Reject all values that return a truthy value of `fn(val, i)`.
 *
 * Rejecting using a callback:
 *
 *    input.reject(function(user){
 *      return input.length < 20
 *    })
 *
 * Rejecting with a property:
 *
 *    items.reject('password')
 *
 * Rejecting values via `==`:
 *
 *    data.reject(null)
 *    input.reject(file)
 *
 * @param {Function|String|Mixed} fn
 * @return {List}
 * @api public
 */

exports.reject = function(fn){
  var dom = this.dom;
  var out = [];
  var len = this.length;
  var val, i;

  if ('string' == typeof fn) fn = toFunction(fn);

  if (fn) {
    for (i = 0; i < len; i++) {
      val = fn.call(dom(this[i]), this[i], i);
      if (!val) out.push(this[i]);
    }
  } else {
    for (i = 0; i < len; i++) {
      if (this[i] != fn) out.push(this[i]);
    }
  }

  return this.dom(out);
};

/**
 * Return a `List` containing the element at `i`.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

exports.at = function(i){
  return this.dom(this[i]);
};

/**
 * Return a `List` containing the first element.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

exports.first = function(){
  return this.dom(this[0]);
};

/**
 * Return a `List` containing the last element.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

exports.last = function(){
  return this.dom(this[this.length - 1]);
};

/**
 * Mixin the array functions
 */

each([
  'push',
  'pop',
  'shift',
  'splice',
  'unshift',
  'reverse',
  'sort',
  'toString',
  'concat',
  'join',
  'slice'
], function(method) {
  exports[method] = function() {
    return proto[method].apply(this.toArray(), arguments);
  };
});

}, {"each":27,"traverse":59,"to-function":60,"matches-selector":61}],
59: [function(require, module, exports) {

/**
 * dependencies
 */

var matches = require('matches-selector');

/**
 * Traverse with the given `el`, `selector` and `len`.
 *
 * @param {String} type
 * @param {Element} el
 * @param {String} selector
 * @param {Number} len
 * @return {Array}
 * @api public
 */

module.exports = function(type, el, selector, len){
  var el = el[type]
    , n = len || 1
    , ret = [];

  if (!el) return ret;

  do {
    if (n == ret.length) break;
    if (1 != el.nodeType) continue;
    if (matches(el, selector)) ret.push(el);
    if (!selector) ret.push(el);
  } while (el = el[type]);

  return ret;
}

}, {"matches-selector":43}],
60: [function(require, module, exports) {

/**
 * Module Dependencies
 */

var expr;
try {
  expr = require('props');
} catch(e) {
  expr = require('component-props');
}

/**
 * Expose `toFunction()`.
 */

module.exports = toFunction;

/**
 * Convert `obj` to a `Function`.
 *
 * @param {Mixed} obj
 * @return {Function}
 * @api private
 */

function toFunction(obj) {
  switch ({}.toString.call(obj)) {
    case '[object Object]':
      return objectToFunction(obj);
    case '[object Function]':
      return obj;
    case '[object String]':
      return stringToFunction(obj);
    case '[object RegExp]':
      return regexpToFunction(obj);
    default:
      return defaultToFunction(obj);
  }
}

/**
 * Default to strict equality.
 *
 * @param {Mixed} val
 * @return {Function}
 * @api private
 */

function defaultToFunction(val) {
  return function(obj){
    return val === obj;
  };
}

/**
 * Convert `re` to a function.
 *
 * @param {RegExp} re
 * @return {Function}
 * @api private
 */

function regexpToFunction(re) {
  return function(obj){
    return re.test(obj);
  };
}

/**
 * Convert property `str` to a function.
 *
 * @param {String} str
 * @return {Function}
 * @api private
 */

function stringToFunction(str) {
  // immediate such as "> 20"
  if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

  // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
  return new Function('_', 'return ' + get(str));
}

/**
 * Convert `object` to a function.
 *
 * @param {Object} object
 * @return {Function}
 * @api private
 */

function objectToFunction(obj) {
  var match = {};
  for (var key in obj) {
    match[key] = typeof obj[key] === 'string'
      ? defaultToFunction(obj[key])
      : toFunction(obj[key]);
  }
  return function(val){
    if (typeof val !== 'object') return false;
    for (var key in match) {
      if (!(key in val)) return false;
      if (!match[key](val[key])) return false;
    }
    return true;
  };
}

/**
 * Built the getter function. Supports getter style functions
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function get(str) {
  var props = expr(str);
  if (!props.length) return '_.' + str;

  var val, i, prop;
  for (i = 0; i < props.length; i++) {
    prop = props[i];
    val = '_.' + prop;
    val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";

    // mimic negative lookbehind to avoid problems with nested properties
    str = stripNested(prop, str, val);
  }

  return str;
}

/**
 * Mimic negative lookbehind to avoid problems with nested properties.
 *
 * See: http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript
 *
 * @param {String} prop
 * @param {String} str
 * @param {String} val
 * @return {String}
 * @api private
 */

function stripNested (prop, str, val) {
  return str.replace(new RegExp('(\\.)?' + prop, 'g'), function($0, $1) {
    return $1 ? $0 : val;
  });
}

}, {"props":38,"component-props":38}],
61: [function(require, module, exports) {
/**
 * Module dependencies.
 */

var query = require('query');

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matches
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = query.all(selector, el.parentNode);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

}, {"query":30}],
6: [function(require, module, exports) {
(function() {
  var $doc, $win, circplusTemplate, gmodal2, gsnSw, gsndfpfactory, loadScript, qsel, swcss, trakless, trakless2;

  trakless2 = require('trakless');

  gmodal2 = require('gmodal');

  loadScript = require('load-script');

  qsel = require('dom');

  swcss = require('./sw.css');

  circplusTemplate = require('./circplus.html');

  $win = window;

  trakless = $win.trakless;

  $doc = $win.document;

  gsnSw = null;


  /** 
   * gsndfpfactory
  #
   */

  gsndfpfactory = (function() {
    function gsndfpfactory() {}

    gsndfpfactory.prototype.dfpID = '';

    gsndfpfactory.prototype.count = 0;

    gsndfpfactory.prototype.rendered = 0;

    gsndfpfactory.prototype.sel = '.gsnunit';

    gsndfpfactory.prototype.dops = {};

    gsndfpfactory.prototype.isLoaded = false;

    gsndfpfactory.prototype.$ads = void 0;

    gsndfpfactory.prototype.adBlockerOn = false;

    gsndfpfactory.prototype.storeAs = 'gsnunit';

    gsndfpfactory.prototype.lastRefresh = 0;

    gsndfpfactory.prototype.didOpen = false;

    gsndfpfactory.prototype.isVisible = false;

    gsndfpfactory.prototype.ieOld = false;

    gsndfpfactory.prototype.bodyTemplate = circplusTemplate;

    gsndfpfactory.prototype.refresh = function(options) {
      var self;
      self = this;
      self.dfpLoader();
      self.dfpID = gsndfp.getNetworkId(true);
      self.setOptions(options || {});
      trakless.util.ready(function() {
        return self.doIt();
      });
      return this;
    };

    gsndfpfactory.prototype.doIt = function() {
      var cp, currentTime, self, slot1;
      self = this;
      self.sel = self.dops.sel || '.gsnunit';
      if (typeof self.adUnitById !== 'object') {
        self.adUnitById = {};
      }
      if (!($win.opera && $win.opera.version)) {
        self.ieOld = $doc.all && !$win.atop;
      }
      if (self.ieOld) {
        self.dops.inViewOnly = false;
      }
      if (self.sel === '.circplus') {
        self.storeAs = 'circplus';
        cp = qsel(self.sel);
        slot1 = qsel('.cpslot1');
        if (cp.length > 0) {
          if (!slot1[0]) {
            cp.html(self.dops.bodyTemplate || self.bodyTemplate);
          }
        }
        self.$ads = [qsel('.cpslot1')[0], qsel('.cpslot2')[0]];
        if (self.$ads[0]) {
          self.createAds().displayAds();
        }
      } else if (self.sel === '.gsnsw') {
        self.dops.inViewOnly = false;
        $win.gmodal.injectStyle('swcss', swcss);
        gsnSw = self;
        self.dops.enableSingleRequest = true;
        self.dfpID = gsndfp.getNetworkId();
        if (qsel(self.dops.displayWhenExists || '.gsnunit').length <= 0) {
          return;
        }
        self.storeAs = 'gsnsw';
        if (self.didOpen || (self.getCookie('gsnsw2') != null)) {
          self.onCloseCallback({
            cancel: true
          });
        } else {
          currentTime = (new Date()).getTime();
          if ((currentTime - self.lastRefresh) < 2000) {
            return self;
          }
          self.lastRefresh = currentTime;
          setTimeout(function() {
            return self.getPopup(self.sel);
          }, 200);
        }
        return self;
      } else {
        self.storeAs = 'gsnunit';
        self.$ads = qsel(self.sel);
        self.createAds().displayAds();
      }
      return this;
    };

    gsndfpfactory.prototype.setOptions = function(ops) {
      var dops, k, self, v;
      self = this;
      dops = {
        setTargeting: {},
        setCategoryExclusion: '',
        setLocation: '',
        enableSingleRequest: false,
        collapseEmptyDivs: true,
        refreshExisting: true,
        disablePublisherConsole: false,
        disableInitialLoad: false,
        inViewOnly: true,
        noFetch: false
      };
      for (k in ops) {
        v = ops[k];
        dops[k] = v;
      }
      self.dops = dops;
      return this;
    };

    gsndfpfactory.prototype.onOpenCallback = function(event) {
      var self;
      self = gsnSw;
      gsndfp.on('clickBrand', function(e) {
        $win.gmodal.hide();
      });
      self.didOpen = true;
      self.isVisible = true;
      self.$ads = qsel(self.sel);
      self.createAds().displayAds();
      setTimeout((function() {
        if (self.adBlockerOn) {
          qsel('.remove').remove();
          qsel('.sw-msg')[0].style.display = 'block';
          qsel('.sw-header-copy')[0].style.display = 'none';
          qsel('.sw-row')[0].style.display = 'none';
        }
      }), 150);
    };

    gsndfpfactory.prototype.onCloseCallback = function(event) {
      var self;
      self = gsnSw;
      self.isVisible = false;
      $win.scrollTo(0, 0);
      if (!self.getCookie('gsnsw2')) {
        self.setCookie('gsnsw2', gsndfp.gsnNetworkId + "," + gsndfp.enableCircPlus + "," + gsndfp.disableSw, 1);
      }
      if (typeof self.dops.onClose === 'function') {
        self.dops.onClose(self.didOpen);
      }
    };

    gsndfpfactory.prototype.swSucccess = function(myrsp) {
      var data, evt, handleEvent, rsp, self;
      $win.gsnswCallback = null;
      rsp = myrsp;
      if (typeof myrsp === 'string') {
        rsp = JSON.parse(myrsp);
      }
      self = gsnSw;
      if (rsp) {
        if (!gsndfp.gsnNetworkId) {
          gsndfp.gsnNetworkId = rsp.NetworkId;
        }
        gsndfp.enableCircPlus = rsp.EnableCircPlus;
        gsndfp.disableSw = rsp.DisableSw;
        data = rsp.Template;
      }
      self.dfpID = gsndfp.getNetworkId();
      evt = {
        data: rsp,
        cancel: false
      };
      self.dops.onData(evt);
      if (evt.cancel) {
        data = null;
      }
      if (data) {
        data = data.replace(/%%CACHEBUSTER%%/g, (new Date).getTime()).replace(/%%CHAINID%%/g, gsndfp.gsnid);
        if (!self.rect) {
          self.rect = {
            w: Math.max($doc.documentElement.clientWidth, $win.innerWidth || 0),
            h: Math.max($doc.documentElement.clientHeight, $win.innerHeight || 0)
          };
        }
        handleEvent = function(target) {
          if (target.className.indexOf('sw-close') >= 0) {
            $win.gmodal.off('click', handleEvent);
            $win.gmodal.off('tap', handleEvent);
            return $win.gmodal.hide();
          }
        };
        $win.gmodal.on('click', handleEvent);
        $win.gmodal.on('tap', handleEvent);
        if ($win.gmodal.show({
          content: "<div id='sw'>" + data + "<div>",
          closeCls: 'sw-close'
        }, self.onCloseCallback)) {
          self.onOpenCallback();
        }
      } else {
        self.onCloseCallback({
          cancel: true
        });
      }
      return this;
    };

    gsndfpfactory.prototype.getPopup = function() {
      var dataType, request, self, url;
      self = this;
      url = gsndfp.apiUrl + "/ShopperWelcome/Get/" + gsndfp.gsnid;
      dataType = 'json';
      if (self.ieOld) {
        $win.gsnswCallback = function(rsp) {
          return self.swSucccess(rsp);
        };
        url += '?callback=gsnswCallback';
        dataType = 'jsonp';
      }
      if (dataType === 'jsonp') {
        loadScript(url);
      } else {
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function() {
          var req;
          req = this;
          if (req.status >= 200 && req.status < 400) {
            return self.swSucccess(req.response);
          }
        };
        request.send();
      }
      return self;
    };

    gsndfpfactory.prototype.getCookie = function(nameOfCookie) {
      var begin, cd, cookieData, end;
      if ($doc.cookie.length > 0) {
        begin = $doc.cookie.indexOf(nameOfCookie + '=');
        end = 0;
        if (begin !== -1) {
          begin += nameOfCookie.length + 1;
          end = $doc.cookie.indexOf(';', begin);
          if (end === -1) {
            end = $doc.cookie.length;
          }
          cookieData = decodeURI($doc.cookie.substring(begin, end));
          if (cookieData.indexOf(',') > 0) {
            cd = cookieData.split(',');
            gsndfp.gsnNetworkId = cd[0];
            gsndfp.enableCircPlus = cd[1];
            gsndfp.disableSw = cd[2];
          }
          return cookieData;
        }
      }
      return null;
    };

    gsndfpfactory.prototype.setCookie = function(nameOfCookie, value, expiredays) {
      var ed;
      ed = new Date;
      ed.setTime(ed.getTime() + expiredays * 24 * 3600 * 1000);
      $doc.cookie = nameOfCookie + '=' + encodeURI(value) + (expiredays === null ? '' : '; expires=' + ed.toGMTString()) + '; path=/';
    };

    gsndfpfactory.prototype.setTargeting = function($adUnitData, allData) {
      var exclusions, exclusionsGroup, i, k, len, targeting, v, valueTrimmed;
      targeting = allData['targeting'];
      if (targeting) {
        if (typeof targeting === 'string') {
          targeting = eval('(' + targeting + ')');
        }
        for (k in targeting) {
          v = targeting[k];
          if (k === 'brand') {
            gsndfp.setBrand(v);
          }
          $adUnitData.setTargeting(k, v);
        }
      }
      exclusions = allData['exclusions'];
      if (exclusions) {
        exclusionsGroup = exclusions.split(',');
        valueTrimmed = void 0;
        for (k = i = 0, len = exclusionsGroup.length; i < len; k = ++i) {
          v = exclusionsGroup[k];
          valueTrimmed = trakless.util.trim(v);
          if (valueTrimmed.length > 0) {
            $adUnitData.setCategoryExclusion(valueTrimmed);
          }
          return;
        }
      }
    };

    gsndfpfactory.prototype.createAds = function() {
      var $adUnit, $existingContent, adUnit, adUnitID, allData, dimensions, i, k, len, ref, self;
      self = this;
      ref = self.$ads;
      for (k = i = 0, len = ref.length; i < len; k = ++i) {
        adUnit = ref[k];
        $adUnit = qsel(adUnit);
        allData = trakless.util.allData(adUnit);
        adUnitID = self.getID($adUnit, self.storeAs, adUnit);
        dimensions = self.getDimensions($adUnit, allData);
        $existingContent = adUnit.innerHTML;
        qsel(adUnit).html('');
        $adUnit.addClass('display-none');
        $win.googletag.cmd.push(function() {
          var $adUnitData, companion;
          $adUnitData = self.adUnitById[adUnitID];
          if ($adUnitData) {
            self.setTargeting($adUnitData, allData);
            return;
          }
          self.dfpID = self.dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');
          if (self.dfpID.indexOf('/') !== 0) {
            self.dfpID = '/' + dfpID;
          }
          if (allData['outofpage']) {
            $adUnitData = $win.googletag.defineOutOfPageSlot(self.dfpID, adUnitID).addService($win.googletag.pubads());
          } else {
            $adUnitData = $win.googletag.defineSlot(self.dfpID, dimensions, adUnitID).addService($win.googletag.pubads());
          }
          companion = allData['companion'];
          if (companion != null) {
            $adUnitData.addService($win.googletag.companionAds());
          }
          self.setTargeting($adUnitData, allData);
          self.adUnitById[adUnitID] = $adUnitData;
          $adUnitData.oldRenderEnded = $adUnitData.oldRenderEnded || $adUnitData.renderEnded;
          $adUnitData.renderEnded = function() {
            var display;
            self.rendered++;
            display = adUnit.style.display;
            $adUnit.removeClass('display-none');
            $adUnit.addClass('display-' + display);
            $adUnitData.existing = true;
            if ($adUnitData.oldRenderEnded != null) {
              $adUnitData.oldRenderEnded();
            }
            if (typeof self.dops.afterEachAdLoaded === 'function') {
              self.dops.afterEachAdLoaded.call(self, $adUnit, $adUnitData);
            }
          };
        });
      }
      $win.googletag.cmd.push(function() {
        var brand, exclusionsGroup, j, len1, ref1, v, valueTrimmed;
        if (typeof self.dops.setTargeting['brand'] === 'undefined') {
          brand = gsndfp.getBrand();
          if (brand != null) {
            self.dops.setTargeting['brand'] = brand;
          }
        }
        if (self.dops.enableSingleRequest) {
          $win.googletag.pubads().enableSingleRequest();
        }
        ref1 = self.dops.setTargeting;
        for (k in ref1) {
          v = ref1[k];
          if (k === 'brand') {
            gsndfp.setBrand(v);
          }
          $win.googletag.pubads().setTargeting(k, v);
        }
        if (typeof self.dops.setLocation === 'object') {
          if (typeof self.dops.setLocation.latitude === 'number' && typeof self.dops.setLocation.longitude === 'number' && typeof self.dops.setLocation.precision === 'number') {
            $win.googletag.pubads().setLocation(self.dops.setLocation.latitude, self.dops.setLocation.longitude, self.dops.setLocation.precision);
          } else if (typeof self.dops.setLocation.latitude === 'number' && typeof self.dops.setLocation.longitude === 'number') {
            $win.googletag.pubads().setLocation(self.dops.setLocation.latitude, self.dops.setLocation.longitude);
          }
        }
        if (self.dops.setCategoryExclusion.length > 0) {
          exclusionsGroup = self.dops.setCategoryExclusion.split(',');
          for (k = j = 0, len1 = exclusionsGroup.length; j < len1; k = ++j) {
            v = exclusionsGroup[k];
            valueTrimmed = trakless.util.trim(v);
            if (valueTrimmed.length > 0) {
              $win.googletag.pubads().setCategoryExclusion(valueTrimmed);
            }
          }
        }
        if (self.dops.collapseEmptyDivs || self.dops.collapseEmptyDivs === 'original') {
          $win.googletag.pubads().collapseEmptyDivs();
        }
        if (self.dops.disablePublisherConsole) {
          $win.googletag.pubads().disablePublisherConsole();
        }
        if (self.dops.disableInitialLoad) {
          $win.googletag.pubads().disableInitialLoad();
        }
        if (self.dops.noFetch) {
          $win.googletag.pubads().noFetch();
        }
        if (self.sel === '.circplus') {
          $win.googletag.companionAds().setRefreshUnfilledSlots(true);
        }
        $win.googletag.enableServices();
      });
      return self;
    };

    gsndfpfactory.prototype.isHeightInView = function(el) {
      var isVisible, overhang, percentVisible, rect;
      percentVisible = 0.50;
      rect = el.getBoundingClientRect();
      overhang = rect.height * (1 - percentVisible);
      isVisible = (rect.top >= -overhang) && (rect.bottom <= window.innerHeight + overhang);
      return isVisible;
    };

    gsndfpfactory.prototype.displayAds = function() {
      var $adUnit, $adUnitData, adUnit, i, id, k, len, ref, self, toPush;
      self = this;
      toPush = [];
      ref = self.$ads;
      for (k = i = 0, len = ref.length; i < len; k = ++i) {
        adUnit = ref[k];
        $adUnit = qsel(adUnit);
        id = $adUnit.id();
        $adUnitData = self.adUnitById[id];
        if (($adUnitData != null)) {
          if (!self.dops.inViewOnly || self.isHeightInView(adUnit)) {
            if ($adUnitData.existing) {
              toPush.push($adUnitData);
            } else {
              $win.googletag.cmd.push(function() {
                return $win.googletag.display(id);
              });
            }
          }
        } else {
          $win.googletag.cmd.push(function() {
            return $win.googletag.display(id);
          });
        }
      }
      if (toPush.length > 0) {
        $win.googletag.cmd.push(function() {
          return $win.googletag.pubads().refresh(toPush);
        });
      }
    };

    gsndfpfactory.prototype.getID = function($adUnit, adUnitName, adUnit) {
      var id, self;
      self = this;
      id = $adUnit.id();
      if ((id || '').length <= 0) {
        id = adUnitName + '$auto$gen$id$' + self.count++;
        $adUnit.id(id);
      }
      return id;
    };

    gsndfpfactory.prototype.getDimensions = function($adUnit, allData) {
      var dimensionGroups, dimensionSet, dimensions, dimensionsData, i, k, len, v;
      dimensions = [];
      dimensionsData = allData['dimensions'];
      if (dimensionsData) {
        dimensionGroups = dimensionsData.split(',');
        for (k = i = 0, len = dimensionGroups.length; i < len; k = ++i) {
          v = dimensionGroups[k];
          dimensionSet = v.split('x');
          dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);
        }
      }
      return dimensions;
    };

    gsndfpfactory.prototype.dfpLoader = function() {
      var gads;
      if (self.isLoaded) {
        return;
      }
      $win.googletag = $win.googletag || {};
      $win.googletag.cmd = $win.googletag.cmd || [];
      gads = $doc.createElement('script');
      gads.async = true;
      gads.type = 'text/javascript';
      gads.onerror = function() {
        self.dfpBlocked();
      };
      loadScript('//www.googletagservices.com/tag/js/gpt.js');
      self.isLoaded = true;
      if (gads.style.display === 'none') {
        self.dfpBlocked();
      }
      return this;
    };

    gsndfpfactory.prototype.dfpBlocked = function() {
      var commands, self;
      self = this;
      self.adBlockerOn = true;
      commands = $win.googletag.cmd;
      setTimeout((function() {
        var _defineSlot, i, k, len, v;
        _defineSlot = function(name, dimensions, id, oop) {
          $win.googletag.ads.push(id);
          $win.googletag.ads[id] = {
            renderEnded: function() {},
            addService: function() {
              return this;
            }
          };
          return $win.googletag.ads[id];
        };
        $win.googletag = {
          cmd: {
            push: function(callback) {
              callback.call(self);
              return this;
            }
          },
          ads: [],
          pubads: function() {
            return this;
          },
          noFetch: function() {
            return this;
          },
          disableInitialLoad: function() {
            return this;
          },
          disablePublisherConsole: function() {
            return this;
          },
          enableSingleRequest: function() {
            return this;
          },
          setTargeting: function() {
            return this;
          },
          collapseEmptyDivs: function() {
            return this;
          },
          enableServices: function() {
            return this;
          },
          defineSlot: function(name, dimensions, id) {
            return _defineSlot(name, dimensions, id, false);
          },
          defineOutOfPageSlot: function(name, id) {
            return _defineSlot(name, [], id, true);
          },
          display: function(id) {
            $win.googletag.ads[id].renderEnded.call(self);
            return this;
          }
        };
        for (k = i = 0, len = commands.length; i < len; k = ++i) {
          v = commands[k];
          $win.googletag.cmd.push(v);
          return;
        }
      }), 50);
    };

    return gsndfpfactory;

  })();

  module.exports = gsndfpfactory;

}).call(this);

}, {"trakless":3,"gmodal":62,"load-script":63,"dom":5,"./sw.css":64,"./circplus.html":65}],
62: [function(require, module, exports) {
// Generated by CoffeeScript 1.9.2
var Emitter, checkEvent, createModal, domify, gmodal, hideModalInternal, modal, modals, showModalInternal, trim, win;

Emitter = require('emitter');

domify = require('domify');

trim = require('trim');

win = window;

modals = [];

checkEvent = function(self, name, evt, el) {
  var scls, tg;
  evt = evt || win.event;
  tg = evt.target || evt.srcElement;
  if (tg.nodeType === 3) {
    tg = tg.parentNode;
  }
  if (self.hasCls(tg.parentNode, "" + self.closeCls)) {
    tg = tg.parentNode;
  }
  scls = "gmodal-wrap " + self.closeCls;
  if (name === 'click') {
    if (self.hasCls(tg, scls) || tg === el) {
      self.emit('click', tg, evt);
    }
  } else if (name === 'keypress') {
    if (self.hasCls(tg, scls) || tg === el || tg === sel.doc || tg === self.doc.body) {
      if ((evt.which || evt.keyCode) === 27) {
        self.emit('esc', tg, evt);
      }
    }
  } else if (name === 'tap') {
    if (self.hasCls(tg, scls) || tg === el) {
      self.emit('tap', tg, evt);
    }
  }
  return false;
};

createModal = function(self) {
  var el, myKeypress, oldkp;
  el = self.doc.getElementById("gmodal");
  if (!el) {
    self.injectStyle('gmodalcss', self.css);
    el = self.doc.createElement('div');
    el.id = 'gmodal';
    el.onclick = function(evt) {
      return checkEvent(self, 'click', evt, el);
    };
    myKeypress = function(evt) {
      return checkEvent(self, 'keypress', evt, el);
    };
    el.onkeypress = myKeypress;
    if (typeof self.doc.onkeypress === 'function') {
      oldkp = self.doc.onkeypress;
      self.doc.onkeypress = function(evt) {
        oldkp(evt);
        return myKeypress(evt);
      };
    } else {
      self.doc.onkeypress = myKeypress;
    }
    el.ontap = function(evt) {
      return checkEvent(self, 'tap', evt, el);
    };
    el.appendChild(domify(self.tpl));
    self.doc.getElementsByTagName('body')[0].appendChild(el);
  }
  return el;
};

showModalInternal = function(self, opts) {
  var eCls;
  if ((opts != null)) {
    self.opts = opts;
    if ((self.opts.content != null)) {
      while (self.el.firstChild) {
        self.el.removeChild(self.el.firstChild);
      }
      if (typeof self.opts.content === 'string') {
        self.el.appendChild(domify(self.opts.content));
      } else {
        self.el.appendChild(self.opts.content);
      }
      self.opts.content = null;
    }
  }
  if (self.opts.closeCls) {
    self.closeCls = self.opts.closeCls;
  }
  self.elWrapper.style.display = self.elWrapper.style.visibility = "";
  self.elWrapper.className = trim((self.baseCls + " ") + (self.opts.cls || ''));
  eCls = self.doc.getElementsByTagName('body')[0].className;
  self.doc.getElementsByTagName('body')[0].className = trim(eCls + " body-gmodal");
  self.emit('show', self);
};

hideModalInternal = function(self) {
  var eCls;
  self.elWrapper.className = "" + self.baseCls;
  eCls = self.doc.getElementsByTagName('body')[0].className;
  self.doc.getElementsByTagName('body')[0].className = trim(eCls.replace(/body\-gmodal/gi, ''));
  self.isVisible = false;
  self.emit('hide', self);
  if (typeof self.opts.hideCallback === 'function') {
    self.opts.hideCallback(self);
  }
  if (modals.length > 0) {
    return self.show();
  }
};


/**
 * modal
 */

modal = (function() {
  function modal() {}

  modal.prototype.doc = win.document;

  modal.prototype.elWrapper = null;

  modal.prototype.el = null;

  modal.prototype.opts = {};

  modal.prototype.baseCls = 'gmodal';

  modal.prototype.closeCls = 'gmodal-close';

  modal.prototype.tpl = '<div class="gmodal-wrap gmodal-left"></div><div class="gmodal-wrap gmodal-content" id="gmodalContent"></div><div class="gmodal-wrap gmodal-right"></div>';

  modal.prototype.css = '.gmodal{display:none;overflow:hidden;outline:0;-webkit-overflow-scrolling:touch;position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;z-index:9999990}.body-gmodal .gmodal{display:table}.body-gmodal{overflow:hidden}.gmodal-content,.gmodal-wrap{display:table-cell;position:relative;vertical-align: middle}.gmodal-left,.gmodal-right{width:50%}';

  modal.prototype.show = function(opts, hideCb) {
    var self;
    self = this;
    if (!self.doc || !self.doc.body) {
      return false;
    }
    self.elWrapper = createModal(self);
    if (!self.el) {
      self.el = self.doc.getElementById("gmodalContent");
    }
    if (opts) {
      opts.hideCallback = hideCb;
      modals.push(opts);
    }
    if (self.isVisible) {
      return false;
    }
    if (modals.length > 0) {
      opts = modals.shift();
    }
    if (!self.opts && !opts) {
      return false;
    }
    if ((self.opts || opts).timeout) {
      setTimeout(function() {
        return showModalInternal(self, opts);
      }, (self.opts || opts).timeout);
    } else {
      showModalInternal(self, opts);
    }
    return self.isVisible = true;
  };

  modal.prototype.hide = function() {
    var self;
    self = this;
    if (!self.elWrapper) {
      return self;
    }
    if (self.opts) {
      if (self.opts.timeout) {
        setTimeout(function() {
          return hideModalInternal(self);
        }, self.opts.timeout);
      } else {
        hideModalInternal(self);
      }
    }
    return self;
  };

  modal.prototype.injectStyle = function(id, css) {
    var el, elx, self;
    self = this;
    el = self.doc.getElementById(id);
    if (!el) {
      el = self.doc.createElement('style');
      el.id = id;
      el.type = 'text/css';
      if (el.styleSheet) {
        el.styleSheet.cssText = css;
      } else {
        el.appendChild(self.doc.createTextNode(css));
      }
      elx = self.doc.getElementsByTagName('link')[0];
      elx = elx || (self.doc.head || self.doc.getElementsByTagName('head')[0]).lastChild;
      elx.parentNode.insertBefore(el, elx);
    }
    return this;
  };

  modal.prototype.hasCls = function(el, cls) {
    var i, k, len, ref, v;
    ref = cls.split(' ');
    for (k = i = 0, len = ref.length; i < len; k = ++i) {
      v = ref[k];
      if ((' ' + el.className).indexOf(' ' + v) >= 0) {
        return true;
      }
    }
    return false;
  };

  return modal;

})();

Emitter(modal.prototype);

gmodal = new modal();

win.gmodal = gmodal;

module.exports = gmodal;

}, {"emitter":66,"domify":67,"trim":23}],
66: [function(require, module, exports) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

}, {}],
67: [function(require, module, exports) {

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var div = document.createElement('div');
// Setup
div.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
// Make sure that link elements get serialized correctly by innerHTML
// This requires a wrapper element in IE
var innerHTMLBug = !div.getElementsByTagName('link').length;
div = undefined;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

}, {}],
63: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var onload = require('script-onload');
var tick = require('next-tick');
var type = require('type');

/**
 * Expose `loadScript`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api public
 */

module.exports = function loadScript(options, fn){
  if (!options) throw new Error('Cant load nothing...');

  // Allow for the simplest case, just passing a `src` string.
  if ('string' == type(options)) options = { src : options };

  var https = document.location.protocol === 'https:' ||
              document.location.protocol === 'chrome-extension:';

  // If you use protocol relative URLs, third-party scripts like Google
  // Analytics break when testing with `file:` so this fixes that.
  if (options.src && options.src.indexOf('//') === 0) {
    options.src = https ? 'https:' + options.src : 'http:' + options.src;
  }

  // Allow them to pass in different URLs depending on the protocol.
  if (https && options.https) options.src = options.https;
  else if (!https && options.http) options.src = options.http;

  // Make the `<script>` element and insert it before the first script on the
  // page, which is guaranteed to exist since this Javascript is running.
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = options.src;

  // If we have a fn, attach event handlers, even in IE. Based off of
  // the Third-Party Javascript script loading example:
  // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
  if ('function' == type(fn)) {
    onload(script, fn);
  }

  tick(function(){
    // Append after event listeners are attached for IE.
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  });

  // Return the script element in case they want to do anything special, like
  // give it an ID or attributes.
  return script;
};
}, {"script-onload":19,"next-tick":20,"type":21}],
64: [function(require, module, exports) {
module.exports = '.gsnsw {\n  	float: left;\n}\n.gmodal {\n\n	/* IE 8- */\n	filter:alpha(opacity=90); \n	-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=90)";\n    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n\n	/* works for old school versions of the Mozilla browsers like Netscape Navigator. */\n	-moz-opacity: 0.9; \n\n	/* This is for old versions of Safari (1.x) with KHTML rendering engine */\n	-khtml-opacity: 0.9; \n\n	/* This is the "most important" one because it\'s the current standard in CSS. This will work in most versions of Firefox, Safari, and Opera. */  \n	opacity: 0.9; \n  	background: #000; /* IE5+ */\n  	background: rgba(0,0,0,0.90);\n}\n.sw-pop {\n	filter: alpha(opacity=100);\n    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";\n    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);\n	-moz-opacity: 1; \n	-khtml-opacity: 1; \n	opacity: 1; \n	background: #777;\n	background: rgba(119, 119, 119, 1);\n}\n\n#gmodalContent {\n    vertical-align: top;\n    top: 50px;\n}\n\n@media (max-width: 640px) and (max-height: 640px){\n    .gsnsw {\n        float:none !important;\n    }\n\n    .sw-header-cta, .sw-header-break, .sw-header-right-img {\n        display:none !important;\n    }\n\n    .sw-header-break{\n        display:none !important;\n    }\n\n    .sw-pop {\n        width: 280px !important;\n        left:0 !important;\n        margin-left:0 !important;\n    }\n\n    .sw-header-dismiss {\n        position: static !important;\n        left:0 !important;\n        top:0 !important;\n        vertical-align: middle !important;\n        text-align: center !important;\n    }\n\n    .sw-close{\n        padding:1px !important;\n    }\n\n    #gmodalContent {\n        vertical-align: middle;\n        height: 80vh;\n        top: auto;\n    }\n\n    .sw-body {\n        max-height: 60vh;\n        overflow-y: scroll;\n    }\n}';
}, {}],
65: [function(require, module, exports) {
module.exports = '<div class="gsn-slot-container"><div class="cpslot cpslot2" data-companion="true" data-dimensions="300x50"></div></div><div class="gsn-slot-container"><div class="cpslot cpslot1" data-dimensions="300x100,300x120"></div></div>';
}, {}]}, {}, {"1":""})
