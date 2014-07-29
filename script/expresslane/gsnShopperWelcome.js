var GSNContext = parent.GSNContext;

(function(window, undefined) {
	
	if (typeof (window.console) == 'undefined' || 
		window.console == null) {
		window.console = {log: function(){} }; 
	}
		
	if (typeof (window.gsnShopperWelcome) == 'undefined' || 
		window.gsnShopperWelcome == null) {
		
		window.gsnShopperWelcome = new Object();
	}
	
	// @win window reference
	// @fn function reference
	gsnShopperWelcome.contentLoaded = function (win, fn) {

		var done = false, top = true,

		doc = win.document, root = doc.documentElement,

		add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
		rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
		pre = doc.addEventListener ? '' : 'on',

		init = function(e) {
		
			if (e.type == 'readystatechange' && 
				doc.readyState != 'complete') {
				return;
			}
			
			(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
			
			if (!done && (done = true)) {
				fn.call(win, e.type || e);
			}
		},

		poll = function() {
			try { 
				root.doScroll('left'); 
			} 
			catch(e) { 
				setTimeout(poll, 50); 
				return; 
			}
			
			init('poll');
		};

		if (doc.readyState == 'complete') {
			fn.call(win, 'lazy');
		}
		else {
			if (doc.createEventObject && 
				root.doScroll) {
				
				try { 
					top = !win.frameElement; 
				} 
				catch(e) { 
				}
				
				if (top) {
					poll();
				}
			}
			
			doc[add](pre + 'DOMContentLoaded', init, false);
			doc[add](pre + 'readystatechange', init, false);
			win[add](pre + 'load', init, false);
		}
	};

	gsnShopperWelcome.addEvent = function(elem, type, eventHandle) {
		
		if (elem == null || 
			elem == undefined) {
			return;
		}
		
		if ( elem.addEventListener ) {
			elem.addEventListener( type, eventHandle, false );
		} 
		else if ( elem.attachEvent ) {
			elem.attachEvent( "on" + type, eventHandle );
		} 
		else {
			elem["on"+type]=eventHandle;
		}
	};

	gsnShopperWelcome.reportClick = function (chain, id, type) {
	
		var url = document.location.protocol + '//' + document.location.host + '/WebService/ShopperWelcome/Popup.asmx/ShopperWelcomeClicked?chainId=' + chain + '&id=' + id + '&type=' + type;
		
		if (typeof (GSNDomainName) != 'undefined') {
		
			url = 'http://' + GSNDomainName + '/WebService/ShopperWelcome/Popup.asmx/ShopperWelcomeClicked?chainId=' + chain + '&id=' + id + '&type=' + type;
		}

		var iframe = document.createElement('iframe');
		
		iframe.setAttribute('style','display:none');
		iframe.setAttribute('src', url);
		
		document.body.appendChild(iframe);
	};
	
	gsnShopperWelcome.changeSrc = function (id, newSrc) {
		
		var bodTracking = document.getElementById('gsnTracking' + id);
		
		if (bodTracking) {
			bodTracking.src = newSrc;
		}
	};
	
	gsnShopperWelcome.changeSrc1 = function (newSrc) {
		gsnShopperWelcome.changeSrc(1, newSrc);
	};
	
	 gsnShopperWelcome.closeAndSetBrand = function (brand) {
	 
		if (GSNContext) {
			if (Gsn.Advertising.getBrand) {
				Gsn.Advertising.setBrand(brand);
			}
			
			SetAdBranding(brand, gsnShopperWelcome.closeShopperWelcomePopup);
		}
		else {
			gsnShopperWelcome.closeShopperWelcomePopup(brand);
		}
	};
	
	gsnShopperWelcome.closeShopperWelcomePopup = function (brand) {
	
		if (typeof(brand) !== 'undefined') {
			if (typeof(shopperWelcomeSetBrand) === 'function') {
				shopperWelcomeSetBrand(brand);
			}
		}
		
		if (GSNContext != null) { 
			//refreshAdPods(); 
      DisplayAdPods();
		}
		
		// perform actual close
		if (typeof (Effect) == 'object') {
			Effect.toggle('bgWelcomePopup', 'appear', { duration: 0.5 });
		}
		else {
			
			var popup = document.getElementById("bgWelcomePopup");
			
			if (popup) {
				document.body.removeChild(popup);
			}
		}
	};
		
	/*Disable popup on Out Out Text Click*/
	gsnShopperWelcome.disablePopup = function () {
	
		var popup = document.getElementById("bgWelcomePopup");
		
		if (popup) {
			document.body.removeChild(popup);
		}
	};

	gsnShopperWelcome.getDocHeight = function () {
		var D = document;
		return Math.max(
			D.body.scrollHeight, D.documentElement.scrollHeight,
			D.body.offsetHeight, D.documentElement.offsetHeight,
			D.body.clientHeight, D.documentElement.clientHeight
		);
	};

	gsnShopperWelcome.centerPopup = function () {
	
		var popup = document.getElementById("bgWelcomePopup");
		
		if (popup) {
			//IE6
			popup.style.height = gsnShopperWelcome.getDocHeight();
		}
	};

	gsnShopperWelcome.getCookie = function (NameOfCookie) {
		if (document.cookie.length > 0) {
			var begin = document.cookie.indexOf(NameOfCookie + "=");
			
			if (begin != -1) {
				begin += NameOfCookie.length + 1;
				end = document.cookie.indexOf(";", begin);
		
				if (end == -1) {
					end = document.cookie.length;
				}
				
				return unescape(document.cookie.substring(begin, end));
			}
		}
		
		return null;
	};

	gsnShopperWelcome.setCookie = function (NameOfCookie, value, expiredays) {
		var ExpireDate = new Date();
		ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000));
		document.cookie = NameOfCookie + "=" + escape(value) + ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString()) + '; path=/';
	};
	
	gsnShopperWelcome.CallServer = function() {

		var request  = document.location.protocol + '//' + document.location.host + '/WebService/ShopperWelcome/Popup.asmx/ShopperWelcomePopup';

		if (typeof (GSNDomainName) != 'undefined') {
			request = 'http://' + GSNDomainName + '/WebService/ShopperWelcome/Popup.asmx/ThirdPartyShopperWelcomePopup?url=http://' + location.hostname + '&webServiceKey=' + ChainId + '';
		}
		
		var head = document.getElementsByTagName("head").item(0);
		var script = document.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", request);
		head.appendChild(script);
		
		gsnShopperWelcome.addEvent(window, "resize", gsnShopperWelcome.centerPopup);
	};
	
	gsnShopperWelcome.addStyleElement = function (css){
		var elem = document.createElement('style');
		elem.type = "text/css";
	  
		if(elem.styleSheet) {
			elem.styleSheet.cssText=css;
		}	  
		else {
			elem.appendChild(document.createTextNode(css));
		}
	  
		document.body.appendChild(elem); 
	};

	gsnShopperWelcome.addScriptElement = function (src){
		var elem = document.createElement('style');
		elem.type = "text/javascript";
		script.src = src;
		document.body.appendChild(elem); 
	};
	
	gsnShopperWelcome.ServerResponse = function (JSONData) {
	
		JSONData = JSONData.replace(/\"/g, "");
		JSONData = JSONData.replace(/\^/g, "\"");
		JSONData = JSONData.replace(/%%CACHEBUSTER%%/g, Math.random()*10000000000000000);
		
		if (JSONData.indexOf("NOTCONFIGURED") == -1) {
			/*Create dynamic Div*/
			var gsnwelcomediv = document.createElement('div');
			gsnwelcomediv.id = "bgWelcomePopup";

			// grab style
			var styleEnds = JSONData.indexOf('</style>');
			var styleData = JSONData.substr(0, styleEnds - 1);
			var htmlData = JSONData.substr(styleEnds + 8);
			
			/*Set cookie to the client machine*/
			gsnShopperWelcome.setCookie("gsn.com", "shopperwelcome", 1);
			gsnwelcomediv.innerHTML = htmlData;
			document.body.appendChild(gsnwelcomediv);

			gsnShopperWelcome.addStyleElement(styleData);
			gsnShopperWelcome.centerPopup();
			
			// eval dynamic scripts
			var scriptEls = document.getElementsByTagName("script");
			
			if (typeof(scriptEls) === "undefined") {
				return;
			}
			
			for(var i = 0; i < scriptEls.length; i++) {
				if (scriptEls[i].className == "shopperWelcomeScript") {
					gsnShopperWelcome.addScriptElement(scriptEls[i]);
				}
			}
		}
	};
	
	gsnShopperWelcome.contentLoaded(window, function() {

		if (GSNContext) {
			if (location.hostname.indexOf('beta') > 0 || 
				gsnShopperWelcome.getCookie("gsn.com") == null) {
				
				if (typeof(shoppingListServiceURL) !== 'undefined') {
					gsnShopperWelcome.CallServer();
				}
			}
		}
		else if ((location.hostname.indexOf('gsn.io') > 0 || 
				gsnShopperWelcome.getCookie("gsn.com") == null) && 
				typeof (GSNDomainName) != 'undefined' && 
				typeof (webServiceKey) != 'undefined') {
				
			gsnShopperWelcome.CallServer();
		}
	});
})(this);
