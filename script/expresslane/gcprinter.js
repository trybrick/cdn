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
  var Emitter, debug, gciprinter, gcprinter, initRequiredMsg, isDocReady, isSecureSite, log, trim, win;

  Emitter = require('emitter');

  trim = require('trim');

  debug = require('debug');

  log = debug('gcprinter');

  win = window;

  isDocReady = false;

  isSecureSite = win.location.protocol.indexOf("https") >= 0;

  initRequiredMsg = 'because plugin has not been initialized';


  /**
   * gciprinter
   */

  gciprinter = (function() {
    gciprinter.prototype.doc = win.document;

    gciprinter.prototype.api = 'https://clientapi.gsn2.com/api/v1/ShoppingList/CouponPrint';

    gciprinter.prototype.retries = 0;

    gciprinter.prototype.isReady = false;

    gciprinter.prototype.hasInit = false;

    gciprinter.prototype.cacheResult = {};

    gciprinter.prototype.debug = debug;

    gciprinter.prototype.isWindows = navigator.platform.indexOf('Win') > -1;

    gciprinter.prototype.isMac = navigator.platform.indexOf('Mac') > -1;

    gciprinter.prototype.isChrome = /chrome/i.test(navigator.userAgent);

    gciprinter.prototype.dl = {
      win: "http://cdn.coupons.com/ftp.coupons.com/partners/CouponPrinter.exe",
      mac: "http://cdn.coupons.com/ftp.coupons.com/safari/MacCouponPrinterWS.dmg"
    };


    /**
     * create a new instance of gciprinter
     * @return {Object}
     */

    function gciprinter() {
      var myHtml, sc, scExtension, self;
      self = this;
      if (!isDocReady) {
        myHtml = '<input type="hidden" id="https-supported" name="https-supported" value="true">';
        document.write("<!--[if (lte IE 9) & (cpbrkpie) & (gte cpbrkpie 5.0200)]>\n" + myHtml + "\n<![endif]-->");
      }
      sc = "https://cdn.cpnscdn.com/static/libraries/js/printcontrol_v3";
      scExtension = debug.enabled('gcprinter') ? ".js" : ".min.js";
      jQuery.ajax({
        type: 'GET',
        url: "" + sc + scExtension,
        dataType: 'script',
        contentType: 'application/json'
      });
    }


    /**
     * Log a message
     * @param  {string} msg message
     * @return {Object}
     */

    gciprinter.prototype.log = function(msg) {
      var self;
      self = this;
      log(msg);
      return self;
    };


    /**
     * print coupon provided site or chainid and coupons array
     * @param  {Number} siteId  Site or Chain Id
     * @param  {Array}  coupons array of manufacturer coupon codes
     * @return {Object}
     */

    gciprinter.prototype.print = function(siteId, coupons) {
      var deviceId, payload, self;
      self = this;
      self.init();
      if (!self.isReady) {
        gcprinter.log("print - false - " + initRequiredMsg);
        return false;
      }
      deviceId = self.getDeviceId();
      if (deviceId < 1) {
        gcprinter.log("printinvalid - bad device id " + deviceId);
        gcprinter.emit('printinvalid', 'gsn-device');
        return;
      }
      payload = trim((coupons || []).join(','));
      if (payload.length > 0) {
        payload = encodeURIComponent(payload);
        jQuery.ajax({
          type: 'GET',
          url: self.api + "/" + siteId + "/" + deviceId + "?callback=?&coupons=" + payload,
          dataType: 'jsonp'
        }).done(function(svrRsp) {
          var evt;
          if (svrRsp.Success) {
            evt = {
              cancel: false
            };
            if (!evt.cancel) {
              gcprinter.emit('printing', evt, svrRsp);
              return gcprinter.printWithToken(svrRsp.Token, svrRsp);
            } else {
              return gcprinter.emit('printfail', 'gsn-cancel', svrRsp);
            }
          } else {
            return gcprinter.emit('printfail', 'gsn-server', svrRsp);
          }
        });
      } else {
        gcprinter.log("printinvalid - no coupon payload");
        gcprinter.emit('printinvalid', 'gsn-no-coupon');
      }
      return true;
    };


    /**
     * print coupon provided a token
     * @param  {string} printToken token
     * @param  {Object} rsp        server side response object
     * @return {Object}
     */

    gciprinter.prototype.printWithToken = function(printToken, rsp) {
      var self;
      self = this;
      self.init();
      if (!self.isReady) {
        gcprinter.log("printWithToken - false - " + initRequiredMsg);
        return false;
      }
      COUPONSINC.printcontrol.printCoupons(printToken, function(e) {
        gcprinter.log("printed " + e);
        if (e === 'blocked') {
          return gcprinter.emit('printfail', e, rsp);
        } else {
          return gcprinter.emit('printed', e, rsp);
        }
      });
      return self;
    };


    /**
     * allow callback to check if coupon printer is installed
     * @param  {Function} fnSuccess
     * @param  {Function} fnFail
     * @return {Object}
     */

    gciprinter.prototype.checkInstall = function(fnSuccess, fnFail) {
      var cb, error1, self, type;
      self = this;
      self.init();
      if (!self.isReady) {
        gcprinter.log("checkInstall - false - " + initRequiredMsg);
        return false;
      }
      cb = function(e) {
        if (e != null) {
          jQuery.extend(self.cacheResult, e);
          self.cacheResult.isPrinterSupported = e.isPrinterSupported === 0 ? false : true;
          if (e.deviceId > 0) {
            if (fnSuccess != null) {
              return fnSuccess(e);
            }
          } else if (fnFail) {
            return fnFail(e);
          }
        } else if (fnFail) {
          return fnFail();
        }
      };
      type = self.key || (self.isChrome ? 'new' : 'plugin');
      try {
        COUPONSINC.printcontrol.installCheck(type, cb);
      } catch (error1) {
        cb();
      }
      return this;
    };


    /**
     * determine if plugin is installed
     * @return {Boolean}
     */

    gciprinter.prototype.hasPlugin = function() {
      var error1, self;
      self = this;
      self.init();
      if (!self.isReady) {
        gcprinter.log("hasPlugin - false - " + initRequiredMsg);
        return false;
      }
      try {
        return COUPONSINC.printcontrol.isPrintControlInstalled();
      } catch (error1) {
        return false;
      }
    };


    /**
     *
     */

    gciprinter.prototype.getUpdateSupported = function() {
      var error1, self;
      self = this;
      self.init();
      if (!self.isReady) {
        gcprinter.log("getUpdateSupported - false - " + initRequiredMsg);
        return false;
      }
      try {
        return COUPONSINC.printcontrol.getUpdateSupported();
      } catch (error1) {
        return false;
      }
    };


    /**
     * get the plugin device id
     * @return {Object}
     */

    gciprinter.prototype.getDeviceId = function() {
      var error1, self;
      self = this;
      self.init();
      if (!self.isReady) {
        gcprinter.log("getDeviceId - 0 - " + initRequiredMsg);
        return 0;
      }
      if ((self.cacheResult.deviceId != null) && self.cacheResult.deviceId > 0) {
        return self.cacheResult.deviceId;
      }
      try {
        return self.cacheResult.deviceId = COUPONSINC.printcontrol.getDeviceID();
      } catch (error1) {
        return self.cacheResult.deviceId;
      }
    };


    /**
     * determine if printer is supported (not pdf/xps/virtual printer etc..)
     * @return {Boolean}
     */

    gciprinter.prototype.isPrinterSupported = function() {
      var error1, self;
      self = this;
      self.init();
      if (!self.isReady) {
        gcprinter.log("isPrinterSupported - false - " + initRequiredMsg);
        return false;
      }
      if ((self.cacheResult.isPrinterSupported != null) && self.cacheResult.isPrinterSupported === true) {
        return self.cacheResult.isPrinterSupported;
      }
      try {
        return self.cacheResult.isPrinterSupported = COUPONSINC.printcontrol.isPrinterSupported();
      } catch (error1) {
        return false;
      }
    };


    /**
     * determine if plugin is blocked
     * @return {Boolean}
     */

    gciprinter.prototype.isPluginBlocked = function() {
      var error1, result, self;
      self = this;
      self.init();
      if (!self.isReady) {
        gcprinter.log("isPluginBlocked - false - " + initRequiredMsg);
        return false;
      }
      result = !self.isWebSocket();
      try {
        if (result) {
          result = COUPONSINC.printcontrol_plugin.isPluginBlocked();
        }
      } catch (error1) {
        result = false;
      }
      return result;
    };


    /**
     * determine if plugin uses websocket
     * @return {Boolean}
     */

    gciprinter.prototype.isWebSocket = function() {
      var error1, self;
      self = this;
      self.init();
      if (!self.isReady) {
        gcprinter.log("isWebSocket - false - " + initRequiredMsg);
        return false;
      }
      try {
        return COUPONSINC.printcontrol.getManager().getSocket != null;
      } catch (error1) {
        return false;
      }
    };


    /**
     * get the current status code
     * @return {string} status code
     */

    gciprinter.prototype.getStatus = function() {
      var error1, self;
      self = this;
      self.init();
      if (!self.isReady) {
        gcprinter.log("getStatus - false - " + initRequiredMsg);
        return false;
      }
      if ((self.initResult != null) && self.initResult.deviceId < 0) {
        return self.initResult.status;
      }
      try {
        return COUPONSINC.printcontrol.getStatusCode();
      } catch (error1) {
        return false;
      }
    };


    /**
     * get the plugin download url
     * @param  {Boolean} isWindows true if windows
     * @return {[string}            the download URL
     */

    gciprinter.prototype.getDownload = function(isWindows) {
      var self;
      self = this;
      if (isWindows || self.isWindows) {
        return self.dl.win;
      }
      return self.dl.mac;
    };


    /**
     * detect plugin with socket
     * @param  {[type]} timeout   [description]
     * @param  {[type]} cbSuccess [description]
     * @param  {[type]} cbFailure [description]
     * @param  {[type]} retries   [description]
     * @return {[type]}           [description]
     */

    gciprinter.prototype.detectWithSocket = function(timeout, cbSuccess, cbFailure, retries) {
      var error1, exception, self, socket;
      self = this;
      self.retries = retries;
      self.log("self check socket");
      try {
        socket = new WebSocket('ws://localhost:26876');
        socket.onopen = function() {
          self.log("self check socket success");
          socket.close();
          return cbSuccess();
        };
        socket.onerror = function(error) {
          self.log("self check socket failed, retries remain " + retries);
          socket.close();
          win.setTimeout(function() {
            if (self.retries <= 1) {
              cbFailure();
              return self;
            }
            self.detectWithSocket(timeout, cbSuccess, cbFailure, self.retries - 1);
            return self;
          }, timeout);
          return self;
        };
      } catch (error1) {
        exception = error1;
        cbFailure();
      }
      return self;
    };


    /**
     * initialize COUPONSINC object
     * @param  {Boolean} force to restart init
     * @return {Object}
     */

    gciprinter.prototype.init = function(force) {
      var cb, myCb, self, type;
      self = gcprinter;
      if (force) {
        self.isReady = false;
        self.hasInit = false;
      }
      if (!self.isReady && (typeof COUPONSINC !== "undefined" && COUPONSINC !== null)) {
        if (self.hasInit) {
          return self;
        }
        self.hasInit = true;
        type = self.key || (self.isChrome ? 'new' : 'plugin');
        self.log("init starting " + type);
        cb = function(e) {
          self.log("init completed");
          self.isReady = true;
          self.initResult = e;
          if (e != null) {
            jQuery.extend(self.cacheResult, e);
            self.cacheResult.isPrinterSupported = e.isPrinterSupported === 0 ? false : true;
          }
          return self.emit('initcomplete', self);
        };
        myCb = function() {
          self.log("actual plugin init");
          return jQuery.when(COUPONSINC.printcontrol.init(type, isSecureSite)).then(cb, cb);
        };
        if (type === 'new') {
          self.detectWithSocket(5, myCb, myCb, 1);
        } else {
          myCb();
        }
      }
      return self;
    };

    return gciprinter;

  })();

  Emitter(gciprinter.prototype);

  if (win.gcprinter != null) {
    gcprinter = win.gcprinter;
  } else {
    gcprinter = new gciprinter();
  }

  jQuery(document).ready(function() {
    return isDocReady = true;
  });

  win.gcprinter = gcprinter;

  module.exports = gcprinter;

}).call(this);

}, {"emitter":2,"trim":3,"debug":4}],
2: [function(require, module, exports) {

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
3: [function(require, module, exports) {

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
4: [function(require, module, exports) {

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
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

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
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
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
    r = exports.storage.debug;
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

}, {"./debug":5}],
5: [function(require, module, exports) {

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

}, {"ms":6}],
6: [function(require, module, exports) {
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
  str = '' + str;
  if (str.length > 10000) return;
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

}, {}]}, {}, {"1":""})
