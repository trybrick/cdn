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

}).call(this);

}, {"load-iframe":2,"store.js":3}],
2: [function(require, module, exports) {

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
}, {"script-onload":4,"next-tick":5,"type":6}],
4: [function(require, module, exports) {

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
5: [function(require, module, exports) {
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
6: [function(require, module, exports) {
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
3: [function(require, module, exports) {
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

}, {}]}, {}, {"1":""})
