/*!
 *  Project:        Event triggering
 *  Description:    gsnevent triggering
 *  Author:         Tom Noogen
 *  License:        Copyright 2014 - Grocery Shopping Network 
 *  Version:        1.1.11
 *
 */

/* Usage:
 *   For Publisher: 
 *         Gsn.Advertising.clickBrickOffer(clickTrackingUrl, 69);
 *
 *   For Consumer:
 *         Gsn.Advertising.on('clickBrickOffer', function(evt)) { alert(evt.OfferCode); });
 *
 * The following events are currently available: clickProduct, clickPromotion, clickBrand, clickBrickOffer, clickRecipe, and clickLink          
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, oldGsn, win, doc, gsnContext, undefined) {

  var sessionStorageX = win.sessionStorage;
  if (typeof (sessionStorageX) == 'undefined') {
    sessionStorageX = {
      getItem: function () { },
      setItem: function () { }
    };
  }

  var tickerFrame,
    parent$,
    myGsn = oldGsn || {},
    oldGsnAdvertising = myGsn.Advertising;
  
  if (typeof (oldGsnAdvertising) !== 'undefined') {
    if (oldGsnAdvertising.pluginLoaded) {
      return;
    }
  }
  
  function createFrame() {
    if (typeof (tickerFrame) == 'undefined') {
      // create the IFrame and assign a reference to the
      // object to our global variable tickerFrame.
      var tempIFrame = doc.createElement('iframe');
      tempIFrame.setAttribute('id', 'gsnticker');
      tempIFrame.style.position = 'absolute';
      tempIFrame.style.top = '-100px';
      tempIFrame.style.left = '-100px';
      tempIFrame.style.zIndex = '99';
      tempIFrame.style.border = '0px';
      tempIFrame.style.width = '0px';
      tempIFrame.style.height = '0px';
      tickerFrame = doc.body.appendChild(tempIFrame);

      if (doc.frames) {
        // this is for IE5 Mac, because it will only
        // allow access to the doc object
        // of the IFrame if we access it through
        // the doc.frames array
        tickerFrame = doc.frames['gsnticker'];
      }
    }
  }

  //#region The actual plugin constructor
  function Plugin() {
    /// <summary>Plugin constructor</summary>

    this.init();
  }

  Plugin.prototype = {
    init: function () {
      /// <summary>Initialization logic goes here</summary>
    },
    pluginLoaded: true,
    data: {},
    onAllEvents: null,
    oldGsnAdvertising: oldGsnAdvertising,
    trigger: function (eventName, eventData) {
      if (eventName.indexOf('gsnevent') < 0) {
        eventName = 'gsnevent:' + eventName;
      }

      // a little timeout to make sure click tracking stick
      win.setTimeout(function () {
        if (parent$) {
          parent$.event.trigger({ type: eventName, detail: eventData });
        } else {
          $.event.trigger({ type: eventName, detail: eventData });
        }
        
        if (typeof (this.onAllEvents) === 'function') {
          this.onAllEvents({ type: eventName, detail: eventData });
        }
      }, 100);
    },
    
    on: function (eventName, callback) {
      if (eventName.indexOf('gsnevent') < 0) {
        eventName = 'gsnevent:' + eventName;
      }
      
      $(doc).on(eventName, callback);
    },

    off: function (eventName, callback) {
      if (eventName.indexOf('gsnevent') < 0) {
        eventName = 'gsnevent:' + eventName;
      }

      $(doc).off(eventName, callback);
    },

    ajaxFireUrl: function (url, sync) {
      /// <summary>Hit a URL.  Good for click and impression tracking</summary> 
      if (typeof (url) === 'string') {
        if (url.length < 10) return;

        // this is to cover the cache buster situation
        url = url.replace("%%CACHEBUSTER%%", new Date().getTime());
        if (sync) {
          $.ajax({
            async: false,
            url: url
          });

          var adUrlIndex = url.indexOf('adurl=');
          if (adUrlIndex > 0) {
            var newUrl = url.substr(adUrlIndex + 6);
            this.ajaxFireUrl(newUrl, sync);
          }
        } else {
          createFrame();
          tickerFrame.src = url;
        }
      }
    },

    clickProduct: function (click, categoryId, brandName, productDescription, productCode, quantity, displaySize, regularPrice, currentPrice, savingsAmount, savingsStatement, adCode, creativeId) {
      /// <summary>Trigger when a product is clicked.  AKA: clickThru</summary>     

      this.ajaxFireUrl(click);

      this.trigger("clickProduct", {
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
    },

    clickBrickOffer: function (click, offerCode, checkCode) {
      /// <summary>Trigger when a brick offer is clicked.  AKA: brickRedirect</summary>     
      this.ajaxFireUrl(click);

      this.trigger("clickBrickOffer", {
        myPlugin: this,
        OfferCode: offerCode || 0
      });
    },

    clickBrand: function (click, brandName) {
      /// <summary>Trigger when a brand offer or shopper welcome is clicked.</summary>
      this.ajaxFireUrl(click);

      this.setBrand(brandName);
      this.trigger("clickBrand", {
        myPlugin: this,
        BrandName: brandName
      });
    },

    clickPromotion: function (click, adCode) {
      /// <summary>Trigger when a promotion is clicked.  AKA: promotionRedirect</summary>   
      this.ajaxFireUrl(click);

      this.trigger("clickPromotion", {
        myPlugin: this,
        AdCode: adCode
      });
    },

    clickRecipe: function (click, recipeId) {
      /// <summary>Trigger when a recipe is clicked.  AKA: recipeRedirect</summary>  
      this.ajaxFireUrl(click);

      this.trigger("clickRecipe", {
        RecipeId: recipeId
      });
    },

    clickLink: function (click, url, target) {
      /// <summary>Trigger when a generic link is clicked.  AKA: verifyClickThru</summary> 

      if (target == undefined || target == '') {
        target = "_top";
      }

      this.ajaxFireUrl(click);
      
      this.trigger("clickLink", {
        myPlugin: this,
        Url: url,
        Target: target
      });
    },
    
    setBrand: function (brandName) {
      this.data.BrandName = brandName;
      sessionStorageX.setItem('Gsn.Advertisement.data.BrandName', brandName);
    },
    
    getBrand: function () {
      return this.data.BrandName || sessionStorageX.getItem('Gsn.Advertisement.data.BrandName');
    }
  };
  // #endregion
  
  // create the plugin and map function for backward compatibility 
  var myPlugin = new Plugin();
  myGsn.Advertising = myPlugin;
  myGsn.Advertising.brickRedirect = myPlugin.clickBrickOffer;
  myGsn.Advertising.clickBrand = myPlugin.clickBrand;
  myGsn.Advertising.clickThru = myPlugin.clickProduct;
  myGsn.Advertising.logAdImpression = function () { };   // empty function, does nothing      
  myGsn.Advertising.logAdRequest = function () { };   // empty function, does nothing    
  myGsn.Advertising.promotionRedirect = myPlugin.clickPromotion;
  myGsn.Advertising.verifyClickThru = myPlugin.clickLink;
  myGsn.Advertising.recipeRedirect = myPlugin.clickRecipe;
  
  // put GSN back online
  win.Gsn = myGsn;
  
  //#region support for classic GSN
  if (typeof(gsnContext) !== 'undefined') {
      
    function buildQueryString(keyWord, keyValue) {
      if (keyValue != null) {
        keyValue = new String(keyValue);
        if (keyWord != 'ProductDescription') { // some product descriptions have '&amp;' which should not be replaced with '`'. 
          keyValue = keyValue.replace(/&/, '`');
        }
        return keyWord + '=' + keyValue.toString();
      } else {
        return '';
      }
    }
    
    myGsn.Advertising.on('clickRecipe', function (data) {
      if (data.type != "gsnevent:clickRecipe") return;
      
      win.location.replace('/Recipes/RecipeFull.aspx?recipeid=' + data.detail.RecipeId);
    });

    myGsn.Advertising.on('clickProduct', function (data) {
      if (data.type != "gsnevent:clickProduct") return;

      var product = data.detail;
      if (product) {

        var queryString = new String('');
        queryString += buildQueryString('DepartmentID', product.CategoryId);
        queryString += '~';
        queryString += buildQueryString('BrandName', product.BrandName);
        queryString += '~';
        queryString += buildQueryString('ProductDescription', product.Description);
        queryString += '~';
        queryString += buildQueryString('ProductCode', product.ProductCode);
        queryString += '~';
        queryString += buildQueryString('DisplaySize', product.DisplaySize);
        queryString += '~';
        queryString += buildQueryString('RegularPrice', product.RegularPrice);
        queryString += '~';
        queryString += buildQueryString('CurrentPrice', product.CurrentPrice);
        queryString += '~';
        queryString += buildQueryString('SavingsAmount', product.SavingsAmount);
        queryString += '~';
        queryString += buildQueryString('SavingsStatement', product.SavingsStatement);
        queryString += '~';
        queryString += buildQueryString('Quantity', product.Quantity);
        queryString += '~';
        queryString += buildQueryString('AdCode', product.AdCode);
        queryString += '~';
        queryString += buildQueryString('CreativeID', product.CreativeId);
        
        // assume there is this global function
        if (typeof(AddAdToShoppingList) == 'function') {
          AddAdToShoppingList(queryString);
        }
      }
    });

    myGsn.Advertising.on('clickLink', function (data) {
      if (data.type != "gsnevent:clickLink") return;

      var linkData = data.detail;
      if (linkData) {
        if (linkData.Target == undefined || linkData.Target == '') {
          linkData.Target = "_top";
        }
        
        if (linkData.Target == "_blank") {
          // this is a link out to open in new window
          win.open(linkData.Url);
        } else {
          // assume this is an internal redirect
          win.location.replace(linkData.Url);
        }
      }
    });

    myGsn.Advertising.on('clickPromotion', function (data) {
      if (data.type != "gsnevent:clickPromotion") return;

      var linkData = data.detail;
      if (linkData) {
        win.location.replace('/Ads/Promotion.aspx?adcode=' + linkData.AdCode);
      }
    });
    
    myGsn.Advertising.on('clickBrickOffer', function (data) {
      if (data.type != "gsnevent:clickBrickOffer") return;

      var linkData = data.detail;
      if (linkData) {
        var url = 'https://clientapi.gsn2.com/api/v1/profile/BrickOffer/' + gsnContext.ConsumerID + '/' + linkData.OfferCode;

        // open brick offer using the new api URL
        win.open(url, '');
      }
    });

  }
  //#endregion
  
  // allow event to be pass to anybody listening on the parent
  if (win.top) {
    // this should match the initialization entry below
    var myParent$ = win.top.jQuery || win.top.Zepto || win.top.tire;
    if (myParent$ !== $) {
      parent$ = myParent$;
    }
  }

})(window.jQuery || window.Zepto || window.tire, window.Gsn || {}, window, document, window.GSNContext);
/**
 * gsn.easyModal.js v1.0.1
 * A minimal jQuery modal that works with your CSS.
 * Author: Flavius Matis - http://flaviusmatis.github.com/
 * URL: https://github.com/flaviusmatis/easyModal.js
 * Modified: Eric Schmit - GSN
 */

(function ($) {
	"use strict";
	var methods = {
		init : function (options) {
			var defaults = {
				top : 'auto',
				autoOpen : false,
				overlayOpacity : 0.5,
				overlayColor : '#000',
				overlayClose : true,
				overlayParent : 'body',
				closeOnEscape : true,
				closeButtonClass : '.close',
				transitionIn : '',
				transitionOut : '',
				onOpen : false,
				onClose : false,
				zIndex : function () {
					return (function (value) {
						return value === -Infinity ? 0 : value + 1;
					}
						(Math.max.apply(Math, $.makeArray($('*').map(function () {
										return $(this).css('z-index');
									}).filter(function () {
										return $.isNumeric(this);
									}).map(function () {
										return parseInt(this, 10);
									})))));
				},
				updateZIndexOnOpen : false,//true,
				adClass : 'gsnsw'
			};

			options = $.extend(defaults, options);

			return this.each(function () {

				var o = options,
				$overlay = $('<div class="lean-overlay"></div>'),
				$modal = $(this);

				$overlay.css({
					'display' : 'none',
					'position' : 'absolute',//'fixed',
					// When updateZIndexOnOpen is set to true, we avoid computing the z-index on initialization,
					// because the value would be replaced when opening the modal.
					'z-index' : 2147483640,//(o.updateZIndexOnOpen ? 0 : o.zIndex()-1),
					'top' : 0,
					'left' : 0,
					'height' : '100%',
					'width' : '100%',
					'background' : o.overlayColor,
					'opacity' : o.overlayOpacity,
					'overflow' : 'auto'
				}).appendTo(o.overlayParent);

				$modal.css({
					'display' : 'none',
					'position' : 'absolute',//'fixed',
					// When updateZIndexOnOpen is set to true, we avoid computing the z-index on initialization,
					// because the value would be replaced when opening the modal.
					'z-index' : 2147483647,//(o.updateZIndexOnOpen ? 0 : o.zIndex() + 1),
					'left' : (window.devicePixelRatio >= 2) ? 33 + '%' : 50 + '%',
          //'left' : 50 + '%',
					'top' : parseInt(o.top, 10) > -1 ? o.top + 'px' : 50 + '%'
				});

				$modal.bind('openModal', function () {
					var overlayZ = o.updateZIndexOnOpen ?
						o.zIndex() :
						parseInt($overlay.css('z-index'), 10),
					modalZ = overlayZ + 1;

					if (o.transitionIn !== '' &&
						o.transitionOut !== '') {
						$modal.removeClass(o.transitionOut).addClass(o.transitionIn);
					};

					$modal.css({
						'display' : 'block',
						'margin-left' :  (window.devicePixelRatio >= 2) ? 0 : - ($modal.outerWidth() / 2) + 'px',
						'margin-top' : (parseInt(o.top, 10) > -1 ? 0 :  - ($modal.outerHeight() / 2)) + 'px',
						'z-index' : modalZ
					});

					$overlay.css({
						'z-index' : overlayZ,
						'display' : 'block'
					});

					if (o.onOpen && typeof o.onOpen === 'function') {
						// onOpen callback receives as argument the modal window
						o.onOpen($modal[0]);
					}
				});
				
				$modal.bind('closeModal', function () {

					if (o.transitionIn !== '' &&
						o.transitionOut !== '') {

						$modal.removeClass(o.transitionIn).addClass(o.transitionOut);
						$modal.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
							$modal.css('display', 'none');
							$overlay.css('display', 'none');
						});
					} else {
						$modal.css('display', 'none');
						$overlay.css('display', 'none');
					}

					if (o.onClose &&
						typeof o.onClose === 'function') {
						// onClose callback receives as argument the modal window
						o.onClose($modal[0]);
					}
				});

				// Close on overlay click
				$overlay.click(function () {
					if (o.overlayClose) {
						//$modal.trigger('closeModal');	//ecs - want to force the user to click
					}
				});

				$(document).keydown(function (e) {
					// ESCAPE key pressed
					if (o.closeOnEscape &&
						e.keyCode === 27) {
						$modal.trigger('closeModal');
					}
				});

				//close when adpod pressed
				$modal.on('click', o.adClass, function (e) {
					$modal.trigger('closeModal');
					e.preventDefault();
				});

				// Close when button pressed
				$modal.on('click', o.closeButtonClass, function (e) {
					$modal.trigger('closeModal');
					e.preventDefault();
				});

				// Automatically open modal if option set
				if (o.autoOpen) {
					$modal.trigger('openModal');
				}
			});
		}
	};

	$.fn.easyModal = function (method) {

		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}

		if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}

		$.error('Method ' + method + ' does not exist on jQuery.easyModal');
	};

}(jQuery));

/*!
 *  Project:        jQuery DFP plugin
 *  Description:    Shopper Welcome DFP
 *  Author:         Tom Noogen/Eric Schmit
 *  License:        Grocery Shopping Network
 *                  MIT from derived work of Copyright (c) 2013 Matt Cooper: https://github.com/coop182/jquery.dfp.js  v1.0.18
 *  Version:        1.0.5
 *
 *  Requires:       jQuery >= 1.7.1
 */
;
(function ($, window, undefined) {

  "use strict";

  var sessionStorageX = sessionStorage;
  if (typeof(sessionStorageX) == 'undefined') {
    sessionStorageX = {
      getItem: function () {
      },
      setItem: function () {
      }
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
    dfpSelector = '.gsnsw',

  // DFP options object
    dfpOptions = {},

  // Keep track of if we've already tried to load gpt.js before
    dfpIsLoaded = false,

  // Collection of ads
    $adCollection,

  // Store adunit on div as:
    storeAs = 'gsnsw',

  //template location
    apiUrl = 'https://clientapi.gsn2.com/api/v1/ShopperWelcome/GetShopperWelcome/',
    cssUrl = 'http://cdn.gsngrocers.com/script/sw2/1.1.0/sw2-override.css',
    advertUrl = 'http://cdn.gsngrocers.com/script/sw2/1.1.0/advertisement.js',
    chainId = 0,
    didOpen = false,

    /**
     * Init function sets required params and loads Google's DFP script
     * @param  String id       The DFP account ID
     * @param  String selector The adunit selector
     * @param  Object options  Custom options to apply
     */
    init = function (id, selector, options) {

      setOptions(options);

      var css = dfpOptions.cssUrl || cssUrl;
      var advert = dfpOptions.advertUrl || advertUrl;

      if(dfpOptions.cancel){
        onCloseCallback({
          cancel: true
        });
      }
      setResponsiveCss(css);
      setAdvertisingTester(advert);

      if (getCookie("shopperwelcome2") == null){ //if the cookies are set, don't show the light-box

        dfpID = id;

        dfpLoader();
        getPopup(selector);

        Gsn.Advertising.on('clickBrand', function (e) {

          $('.sw-close').click();
        });
      } else {
        onCloseCallback({
          cancel: true
        });
      }
    },

    setResponsiveCss = function (css){

      //have we built this element before?
      if(0 === $('.respo').length){

        //insert css that will provide responsiveness
        var head = document.getElementsByTagName('head').item(0);
        var cssTag = document.createElement('link');
        cssTag.setAttribute('href', css);
        cssTag.setAttribute('rel', 'stylesheet');
        cssTag.setAttribute('class', 'respo');
        head.appendChild(cssTag);
      }
    },

    setAdvertisingTester = function (advert){

      //have we built this element before?
      if(0 === $('.advert').length){

        //insert the advertisement js (fails if an ad-blocker is not present)
        var body = document.getElementsByTagName('body').item(0);
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('src', advert);
        scriptTag.setAttribute('class', 'advert');
        body.appendChild(scriptTag);
      }
    },

    onOpenCallback = function (event) {

      didOpen = true;

      setTimeout(function(){
        if(typeof gsnGlobalTester === 'undefined'){
          jQuery('.sw-msg').show();
          jQuery('.sw-header-copy').hide();
          jQuery('.sw-row').hide();
        }
      }, 150);
    },

    onCloseCallback = function (event) {

      $('.sw-pop').remove();
      $('.lean-overlay').remove();

      if (getCookie("shopperwelcome2") == null) {
        setCookie("shopperwelcome2", "shopperwelcome2", 1);
      }

      if (typeof(dfpOptions.onClose) === 'function') {
        dfpOptions.onClose(didOpen);
      }
    },

    getPopup = function (selector) {

      var url = dfpOptions.apiUrl || apiUrl;
      var chain = dfpOptions.chainId || chainId;

      $.ajax({
        url: url + chain,
        dataType: 'json',
        success: function (data) {

          if (data) {

            //add the random cachebuster
            data = data
              .replace(/%%CACHEBUSTER%%/g, (new Date()).getTime())
              .replace(/%%CHAINID%%/g, chain);

            if(0 === $('#sw').length){  //have we built this element before?

              //insert the template for the shopper welcome window
              var body = document.getElementsByTagName('body').item(0);
              var div = document.createElement('div');
              div.setAttribute('id', 'sw');
              body.appendChild(div);
            }

            $('#sw').html(clean(data));
            $adCollection = $(selector);

            if ($adCollection) {

              createAds();
              displayAds();

              //open the modal to show shopper welcome
              $('.sw-pop').easyModal({
                autoOpen: true,
                closeOnEscape: false,
                onClose: onCloseCallback,
                onOpen: onOpenCallback,
                top: 25
              });
            }
          } else {
            onCloseCallback({
              cancel: true
            });
          }
        }
      });
    },

    clean = function(data){

      //use this to get rid of any elements (place-holder images)
      //before we render to reduce the # calls to the server/cdn
      var template = $(data.trim()); //http://bugs.jquery.com/ticket/13223
      $('.remove', template).remove();

      return template.prop('outerHTML');
    },

    getCookie = function (NameOfCookie) {

      if (document.cookie.length > 0) {

        var begin = document.cookie.indexOf(NameOfCookie + "=");
        var end = 0;

        if (begin != -1) {
          begin += NameOfCookie.length + 1;
          end = document.cookie.indexOf(";", begin);

          if (end == -1) {
            end = document.cookie.length;
          }

          //return unescape(document.cookie.substring(begin, end));
          return decodeURI(document.cookie.substring(begin, end));
        }
      }

      return null;
    },

    setCookie = function (NameOfCookie, value, expiredays) {

      var ExpireDate = new Date();
      ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000));
      document.cookie = NameOfCookie + "=" + encodeURI(value) + ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString()) + '; path=/';
    },

    clearCookie = function(nameOfCookie){

      if(nameOfCookie === getCookie(nameOfCookie)){
        document.cookie = nameOfCookie + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
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
        var adUnitID = getID($adUnit, 'gsnsw', count);

        // get dimensions of the adUnit
        var dimensions = getDimensions($adUnit);

        // get existing content
        var $existingContent = $adUnit.html();

        // wipe html clean ready for ad and set the default display class.
        $adUnit.html('').addClass('display-none');

        // Push commands to DFP to create ads
        window.googletag.cmd.push(function () {

          var googleAdUnit,
            $adUnitData = $adUnit.data(storeAs);

          if ($adUnitData)
            return;

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
            if (typeof(targeting) == 'string') {
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

            //googleAdUnit.oldRenderEnded();//ecs

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

        if (typeof(dfpOptions.setTargeting['brand']) === 'undefined') {
          if (sessionStorageX.getItem('brand')) {
            dfpOptions.setTargeting['brand'] = sessionStorageX.getItem('brand');
          }
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

        if (typeof(dfpOptions.setLocation) === "object") {
          if (typeof(dfpOptions.setLocation.latitude) === "number" &&
            typeof(dfpOptions.setLocation.longitude) === "number" &&
            typeof(dfpOptions.setLocation.precision) === "number") {

            window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude, dfpOptions.setLocation.precision);
          } else if (typeof(dfpOptions.setLocation.latitude) === "number" &&
            typeof(dfpOptions.setLocation.longitude) === "number") {
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
     * Display all created Ads
     */
    displayAds = function () {

      var toPush = [];

      // Display each ad
      $adCollection.each(function () {

        var $adUnit = $(this),
          $adUnitData = $adUnit.data(storeAs);

        if (dfpOptions.refreshExisting &&
          $adUnitData &&
          $adUnit.data('gsnDfpExisting')) {

          toPush.push($adUnitData);

        } else {
          $adUnit.data('gsnDfpExisting', true);
          window.googletag.cmd.push(function () {
            window.googletag.display($adUnit.attr('id'));
          });
        }
      });

      if (toPush.length > 0) {
        window.googletag.cmd.push(function () {
          window.googletag.pubads().refresh(toPush);
        });
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

      var useSSL = 'https:' === document.location.protocol;
      gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
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
            renderEnded: function () {
            },
            addService: function () {
              return this;
            }
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
          pubads: function () {
            return this;
          },
          noFetch: function () {
            return this;
          },
          disableInitialLoad: function () {
            return this;
          },
          disablePublisherConsole: function () {
            return this;
          },
          enableSingleRequest: function () {
            return this;
          },
          setTargeting: function () {
            return this;
          },
          collapseEmptyDivs: function () {
            return this;
          },
          enableServices: function () {
            return this;
          },
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
   - network id
   - chain id
   - store id (optional)
   */
  $.gsnSw2 = $.fn.gsnSw2 = function (id, options) {

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

    if ($(options.displayWhenExists || '.gsnunit').length) {
      init(id, selector, options);
    }

    return this;
  };

})(window.jQuery || window.Zepto || window.tire, window);

/**
 * Created by eschmit on 7/2/2014.
 */

$$('.AdMaster').each(function (e) {
  //set the unitname (networkid) in admaster
  var result = eval('(' + e.readAttribute('data-info') + ')');
  setMainAttr(result[1], result[2], result[3], result[4], result[5], result[6]);
});

checkCookie = function (NameOfCookie) {

  if (document.cookie.length > 0) {

    var begin = document.cookie.indexOf(NameOfCookie + "=");
    var end = 0;

    if (begin != -1) {
      begin += NameOfCookie.length + 1;
      end = document.cookie.indexOf(";", begin);

      if (end == -1) {
        end = document.cookie.length;
      }

      return decodeURI(document.cookie.substring(begin, end));
    }
  }

  return null;
}

document.observe('dom:loaded', function(){
  reDisplay = true;
})

if (0 < chainId) {

  if(null === checkCookie("shopperwelcome2")) {

    var didDisplay = false;

    //stop background ads from rendering (avoid race condition)
    shopperWelcomeInterrupt = true;

    jQuery.gsnSw2({

      dfpID: mainAttr.UnitNameRoot + '/' + mainAttr.UnitName + ((mainAttr.Zone != '') ? '/' + mainAttr.Zone : ''),
      chainId: chainId,
      displayWhenExists: '.AdMaster',
      onClose: function(didDisplay){

        shopperWelcomeInterrupt = false;

        if(didDisplay){
          didDisplay = true;
          DisplayAdPods();
          refreshAdPods();
        }

        if(reDisplay &&
           !didDisplay){

          //sometimes the admaster.js runs before this point
          //if that occurs, the display call already happened, but with the interrupt
          //so no adpods will be shown unless we re-call the display function
          DisplayAdPods();
        }
      }
    });
  }
}