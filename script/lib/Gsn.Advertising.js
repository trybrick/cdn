/*!
 *  Project:        Event triggering
 *  Description:    gsnevent triggering
 *  Author:         Tom Noogen
 *  License:        Copyright 2014 - Grocery Shopping Network 
 *  Version:        1.1.13
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

  var parent$,
      myGsn = oldGsn || {},
      oldGsnAdvertising = myGsn.Advertising;
  
  if (typeof (oldGsnAdvertising) !== 'undefined') {
    if (oldGsnAdvertising.pluginLoaded) {
      return;
    }
  }
  
  function createTrackingPixel(url) {
    try {
      var img = new Image();
      if (typeof(img) === 'undefined') {
        img = doc.createElement('img');
      }
      
      img.src = (location.protocol == "https:" ? "https:" : "http:") + url.replace(/^(http\:|https\:)/i, '');
    } catch (err) {
      // some error occurred while creating tracking image
      var eDebug = err;
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
      }, 200);
    },
    
    on: function (eventName, callback) {
      if (eventName.indexOf('gsnevent') < 0) {
        eventName = 'gsnevent:' + eventName;
      }
      
      if ($.fn.bind) {
        $(doc).bind(eventName, callback);
      }
      else {
        $(doc).on(eventName, callback);
      }
    },

    off: function (eventName, callback) {
      if (eventName.indexOf('gsnevent') < 0) {
        eventName = 'gsnevent:' + eventName;
      }

      if ($.fn.unbind) {
        $(doc).unbind(eventName, callback);
      }
      else {
        $(doc).off(eventName, callback);
      }
    },

    ajaxFireUrl: function (url) {
      /// <summary>Hit a URL.  Good for click and impression tracking</summary> 
      if (typeof (url) === 'string') {
        if (url.length < 10) return;

        // this is to cover the cache buster situation
        url = url.replace("%%CACHEBUSTER%%", new Date().getTime());
        url = url.replace("%%CHAINID%%", gsnApi.getChainId());
        createTrackingPixel(url);
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
    try {
      // this should match the initialization entry below
      var myParent$ = win.top.Zepto || win.top.jQuery || win.top.tire;
      if (myParent$ !== $) {
        parent$ = myParent$;
      }
    } catch() {}
  }

})(window.Zepto || window.jQuery || window.tire, window.Gsn || {}, window, document, window.GSNContext);