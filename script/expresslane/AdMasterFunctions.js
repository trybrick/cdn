/*************************************************************
* Functions defined here must also be referenced in AdPod.html
* otherwise Internet Explorer cannot find the definition.
**************************************************************/
var iExplore = /msie/.test(navigator.userAgent.toLowerCase());
var ord;
var globalslots = [];
var cirPlusSlot, unitName, canShowSlot1;
var cirPlusSlots = [];
var lastTargetting = { dept: null };
var mainAttr = { Targetting: {} };
var shopperWelcomeInterrupt = false;
var hasInitAdpods = false;
				
	/* BOILERPLATE */
	(function(){
		var useSSL = 'https:' == document.location.protocol;
		var src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
		document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
	})();
	
	function setMainAttr(zone, uName, unitNameRoot, departments, brand, pageName) {
	
		if (typeof(unitName) == 'undefined') {
		
			mainAttr.Zone = zone == '##city##-##stateabbreviation##-##postalcode##-##storeid##' ? '' : zone;
			mainAttr.UnitName = uName;
			mainAttr.UnitNameRoot = unitNameRoot;
			mainAttr.Targetting.Departments = departments;
			
			if (Gsn.Advertising.getBrand) {
				mainAttr.Targetting.BrandName = Gsn.Advertising.getBrand();
			}
			
			mainAttr.Targetting.PageName = pageName;
			unitName = mainAttr.UnitNameRoot + '/' + mainAttr.UnitName + ((mainAttr.Zone != '') ? '/' + mainAttr.Zone : '');
			canShowSlot1 = (mainAttr.Targetting.PageName != 'printlist') && mainAttr.UnitName != '224.raleys';
		}
	}
	
	function createSlot(size, tile, isGlobalSlot, isCompanionSlot){
				
		var slot = googletag.defineSlot(unitName, size, 'div-gpt-ad-' + tile);
		slot.tile = parseInt(tile);
		var canSlowSlot = (tile != 1) || (tile == 1 && canShowSlot1);
		if  (canSlowSlot) {
			if (isGlobalSlot)  {
				globalslots.push(slot);
			}
			else {
				if (tile == 7) { 
					cirPlusSlot = slot;
					cirPlusSlot.oldRenderEnded = cirPlusSlot.renderEnded;
					cirPlusSlot.renderEnded = function(){
						if ($('div-gpt-ad-7').visible()) {
						/*
							$('availablevarietiestop').innerHTML = '';
							$('availproductimage').hide();
							$('availprice').hide();
							$('availproductdescription').hide();
							if (!$('availablevarietiesadditemlink')) {
								$('availablevarietiesmiddle').hide();
								$('availablevarietiesbottom').hide();
								$('availablevarietiestop').hide();
							}
							*/
						}
						cirPlusSlot.oldRenderEnded();
					};
				}
				cirPlusSlots.push(slot);
			}
			
			slot.addService(googletag.pubads()).setTargeting("tile", tile);
			if (isCompanionSlot) {
				slot.addService(googletag.companionAds());
			}
			setTargetings(slot, mainAttr.Targetting, tile > 6 ? true : null);
		}
		return slot;
	}
	
	document.observe('dom:loaded', function(){
	
		if(typeof(window.Gsn) == 'undefined') {
			window.Gsn = {};
		}
		
		if (typeof(window.Gsn.Advertising) == 'undefined') {
			window.Gsn.Advertising = {
				clickThru: clickThru,
				promotionRedirect: promotionRedirect,
				logAdImpression: logAdImpression,
				recipeRedirect: recipeRedirect,
				verifyClickThru: verifyClickThru,
				brickRedirect: brickRedirect,
				logAdRequest: logAdRequest
			};
		}
		
		// click tracking image
		var img = document.createElement('img');
		img.src = "/assets/common/images/pixel.gif";
		img.setAttribute("id", "pixel");
		img.style.cssText = "display: none";
		document.body.appendChild(img);
	
		// load slots and enable google service
		// googletag.cmd.push(function() {
			// $$('.AdMaster').each(function (e) {
				// var result = eval('(' + e.readAttribute('data-info') + ')');
				// setMainAttr(result[1], result[2], result[3], result[4], result[5], result[6]);
				
				// var size = eval('(' + e.readAttribute('data-size') + ')');
				// createSlot(size, result[0], true, false);
			// });
			// createSlot([[300,100],[300,120]], 7, false, false);
			// createSlot([300,50], 8, false, true);
			
			// googletag.pubads().collapseEmptyDivs();
			// googletag.pubads().enableAsyncRendering(); 
			// googletag.companionAds().setRefreshUnfilledSlots(true);

			// googletag.enableServices();
		// });
					
		try 
		{
            // Get the value.
            var value = GetCookie("GSN.Cookies.Campaign");
			
            if (value == null)
            {
			    // Get the consumer id.
			    var consumerId = new String("");
    			
			    // Make sure that we can use it.
			    if ((typeof(GSNContext) == 'object') 
			    && (GSNContext != null)) 
			    {
			        consumerId = GSNContext.ConsumerID.toString();
			    }
    			
			    // Make the request
			    $jq.ajax(
			    {
                    type : "GET",
                    dataType : "jsonp",
                    url : ("https://clientapi.gsn2.com/api/v1/profile/GetCampaign/" + consumerId + "?callback=?"),
                    success: CampaignCallback
                }
                );
            }
            else
            {
                // Display the ad pods.
				DisplayAdPods();
            }
		}
        catch (e) 
        { 
			
		}  
	});

    // Display the ad pods.
    function DisplayAdPods()
    {
		if(shopperWelcomeInterrupt) {
			return;
		}
		
		if(hasInitAdpods) {
			refreshAdPods();
			return;
		}
		
		hasInitAdpods = true;
		
		googletag.cmd.push(function() {
			$$('.AdMaster').each(function (e) {
				var result = eval('(' + e.readAttribute('data-info') + ')');
				setMainAttr(result[1], result[2], result[3], result[4], result[5], result[6]);
				
				var size = eval('(' + e.readAttribute('data-size') + ')');
				createSlot(size, result[0], true, false);
			});
			createSlot([[300,100],[300,120]], 7, false, false);
			createSlot([300,50], 8, false, true);
			
			googletag.pubads().collapseEmptyDivs();
			googletag.pubads().enableAsyncRendering(); 
			googletag.companionAds().setRefreshUnfilledSlots(true);

			googletag.enableServices();
		});
			
        googletag.cmd.push(function() 
        {
			// then load the div
			for(var i = 0; i < globalslots.length; i++) 
			{
				googletag.display('div-gpt-ad-' + globalslots[i].tile);
			}
		});
    }
    // Sort    
	function setOrd()
	{
		var axel = Math.random() + "";
		ord = axel * 1000000000000000000; 
	}
	
	setOrd();
	
    function countClick(click)
    {
		var obj = document.getElementById('pixel');
		
		if (obj != null)
		{
			if(click != '%c')
			{
				if(obj.src) {
					obj.src = click;
				}
			}
		}
    }
   
    function clickThru(click, DepartmentID, BrandName, ProductDescription, ProductCode, Quantity, DisplaySize, RegularPrice, CurrentPrice, SavingsAmount, SavingsStatement, AdCode, CreativeID){
		countClick(click);
		
        var QueryString = new String('');
        QueryString += buildQueryString('DepartmentID', DepartmentID);
        QueryString += '~';
        QueryString += buildQueryString('BrandName', BrandName);
        QueryString += '~';
        QueryString += buildQueryString('ProductDescription', ProductDescription);
        QueryString += '~';
        QueryString += buildQueryString('ProductCode', ProductCode);
        QueryString += '~';
        QueryString += buildQueryString('DisplaySize', DisplaySize);
        QueryString += '~';
        QueryString += buildQueryString('RegularPrice', RegularPrice);
        QueryString += '~';
        QueryString += buildQueryString('CurrentPrice', CurrentPrice);
        QueryString += '~';
        QueryString += buildQueryString('SavingsAmount', SavingsAmount);
        QueryString += '~';
        QueryString += buildQueryString('SavingsStatement', SavingsStatement);
        QueryString += '~';
        QueryString += buildQueryString('Quantity', Quantity);
        QueryString += '~';
        QueryString += buildQueryString('AdCode', AdCode);
		QueryString += '~';
        QueryString += buildQueryString('CreativeID', CreativeID);
        AddAdToShoppingList(QueryString);
    }
    //For testing only
    function clickThruTest(click, DepartmentID, BrandName, ProductDescription, ProductCode, Quantity, DisplaySize, RegularPrice, CurrentPrice, SavingsAmount, SavingsStatement, AdCode, CreativeID){
    		alert('Inside clickThruTest'); 
    		//countClick(click);
    		
            var QueryString = new String('');
            QueryString += buildQueryString('DepartmentID', DepartmentID);
            QueryString += '~';
            QueryString += buildQueryString('BrandName', BrandName);
            QueryString += '~';
            QueryString += buildQueryString('ProductDescription', ProductDescription);
            QueryString += '~';
            QueryString += buildQueryString('ProductCode', ProductCode);
            QueryString += '~';
            QueryString += buildQueryString('DisplaySize', DisplaySize);
            QueryString += '~';
            QueryString += buildQueryString('RegularPrice', RegularPrice);
            QueryString += '~';
            QueryString += buildQueryString('CurrentPrice', CurrentPrice);
            QueryString += '~';
            QueryString += buildQueryString('SavingsAmount', SavingsAmount);
            QueryString += '~';
            QueryString += buildQueryString('SavingsStatement', SavingsStatement);
            QueryString += '~';
            QueryString += buildQueryString('Quantity', Quantity);
            QueryString += '~';
            QueryString += buildQueryString('AdCode', AdCode);
    		QueryString += '~';
            QueryString += buildQueryString('CreativeID', CreativeID);
            alert(QueryString);
    }
   
    function buildQueryString(KeyWord, KeyValue){
        if (KeyValue != null){
          	KeyValue = new String(KeyValue); 
          	if(KeyWord != 'ProductDescription'){ // some product descriptions have '&amp;' which should not be replaced with '`'. 
				KeyValue = KeyValue.replace(/&/, '`'); 
			}
          	return KeyWord + '=' + KeyValue.toString();
        } else{
          return '';
        }
     }
	
    function recipeRedirect(click, recipeID){
	
		var obj = document.getElementById('pixel');
				
		if (obj != null)	{
			if(click != '%c'){
				obj.src = click;
			}
		}
		
		setTimeout(function(){
			window.location.replace('http://'+window.location.hostname+'/Recipes/RecipeFull.aspx?recipeid=' + recipeID.toString())
		}, 2000);
    }
	
    function brickRedirect(click, offerCode, checkCode) {
        countClick(click);

        if (typeof (GSNContext) == 'object' && GSNContext != null) {
		
            var redirect = 'http://' + window.location.hostname + '/Ads/CouponsInc/BrickRedirect.aspx?';
            var pinCode = GSNContext.ConsumerID;
            redirect += 'o=' + encodeURIComponent(offerCode);
            redirect += '&c=' + encodeURIComponent(checkCode);
            redirect += '&p=' + encodeURIComponent(pinCode);

            window.open(redirect);
        }
    }
    
    function promotionRedirect(click, adCode){
        countClick(click);
        window.location.replace('http://'+window.location.hostname+'/Ads/Promotion.aspx?adcode=' + adCode.toString());        
    }
        
    function verifyClickThru(click, url, target) {
		if(target == undefined || target == '') {
			target = "_top";
		}
		
		countClick(click);
		
		if(target == "_blank") {
			// this is a link out to open in new window
			window.open(url);	
		} else {
			// assume this is an internal redirect
			window.location.replace('http://' + window.location.hostname + url); 
		}
    }

    function logAdImpression(adcode, creativeID, adRequest) {
        try {
            if (document.getElementById('ctl00_hfRequestVars') != null) {
                var displayUrl = document.location.href;
                var requestArgs = document.getElementById('ctl00_hfRequestVars').value;

                LogImpression(displayUrl, requestArgs, adcode, creativeID, adRequest, null, null);
            } else {
                var displayUrl = document.location.href;
                var request = '';
                if (document.getElementById('hfAdRequest')) {
                    var request = document.getElementById('hfAdRequest').value;
                }

                LogExternalAdImpression(document.URL, adcode, creativeID, request, null, null);
            }
        } catch (e) { }	
    }

    function logAdRequest(adRequest) {
        try {
            if (document.getElementById('ctl00_hfRequestVars') != null) {
                var displayUrl = document.location.href;
                var requestArgs = document.getElementById('ctl00_hfRequestVars').value;

                LogAdRequest(displayUrl, requestArgs, adRequest, null, null);
            }
        }
        catch (e) { }
    }

    function UpdateQuantCast() {
        /*
        try {
            var gsnConsumerID;

            if (typeof (GSNContext) == 'object') {
                gsnConsumerID = GSNContext.ConsumerID.toString();
            }
        
            _qoptions = {
                qacct: "p-1bL6rByav5EUo",
                media: "webpage",
                event: "refresh",
                labels: gsnConsumerID
            };

            quantserve();
        }
        catch (e) { }
		*/
    }

    function UpdateGoogle() {

        try {

            if (typeof (pageTracker) == 'object') {
                pageTracker._trackPageview();
            }

            if (typeof (globalPageTracker) == 'object') {
                globalPageTracker._trackPageview();
            }

            if (typeof (chainPageTracker) == 'object') {
                chainPageTracker._trackPageview();
            }
        } catch (e) { }
    }

    function refreshAdPods() {
        if (typeof (GSNServices) == 'object' && typeof (GSNServices.AdService) == 'object') {
            GSNServices.AdService.GetAdRequests(GSNContext.RequestArguments, RefreshAdPods, RefreshAdPods, 2);
        }
        else {
            RefreshAdPods(null);
        }
    }

    function autoRefreshAdPods() {
        if (typeof (GSNServices) == 'object' && typeof (GSNServices.AdService) == 'object') {
            GSNServices.AdService.GetAdRequests(GSNContext.RequestArguments, RefreshAdPods, RefreshAdPods, 3);
        }
        else {
            RefreshAdPods(null);
        }
    }
	
	function getCookieVal (offset) {
	  var endstr = document.cookie.indexOf (';', offset);
	  if (endstr == -1)
		endstr = document.cookie.length;
	  return unescape(document.cookie.substring(offset, endstr));
	}

	function GetCookie (name) {
	  var arg = name + '=';
	  var alen = arg.length;
	  var clen = document.cookie.length;
	  var i = 0;
	  while (i < clen) {
	  var j = i + alen;
	  if (document.cookie.substring(i, j) == arg)
		return getCookieVal (j);
	  i = document.cookie.indexOf(' ', i) + 1;
	  if (i == 0) break;
	  }
	  return null;
	}

    ///
    // Use this method to create a session only cookie.
    ///
    function SetCampaignCookie (campaignName, value) 
    {
        // By not setting the expiration on the cookie, the cookie will
        // expire when the browser closes.
        document.cookie = campaignName + '=' + escape(value)
    }
    
	function SetCookie (name, value) {
	  // Enter number of days the cookie should persist
	  var expDays = 90000;
	  var exp = new Date();
	  exp.setTime(exp.getTime() + (expDays * 24 * 60 * 60 * 1000));
	  expirationDate = exp.toGMTString();
	  // Set cookie with name and value provided
	  // in function call and date from above
	  document.cookie = name + '=' + escape(value)
	  document.cookie += '; expires=' + exp.toGMTString();
	}

	function refreshCirPlusSlot() {
		var myCirPlusSlot = document.getElementById('cirPlusSlot');
		
		if (cirPlusSlot) {
			for(var i = 0; i < cirPlusSlots.length; i++) {
				setTargetings(cirPlusSlots[i], lastTargetting, true);
			}
		}
		
		if (myCirPlusSlot == null) {
			var add_here = document.getElementById('availablevarieties');
			var src = document.createElement('div');
			src.innerHTML = '<div class="group leaderboard"><div id="div-gpt-ad-8" class="AdMaster Tile8"></div></div><div class="group leaderboard" style="padding-bottom: 5px"><div id="cirPlusSlot" class="group leaderboard"><div id="div-gpt-ad-7" class="AdMaster Tile7"></div></div>';
			add_here.appendChild(src);
			add_here.parentNode.insertBefore(src, add_here);
			googletag.cmd.push(function() { googletag.display("div-gpt-ad-7") });
			googletag.cmd.push(function() { googletag.display("div-gpt-ad-8") });
		}
		else if (GetCookie('cirPlusDept')) {
			googletag.pubads().refresh(cirPlusSlots); 
		}
	}
	
	function setTargetings(obj, dataAttr, isCirPlus) {
		for(var k in dataAttr) {
			var property = dataAttr[k];
			var key = '';
			if (property != null && property != '' && typeof(property) != 'function') {
				if (k == 'Departments') {
					property = property.split(',');
					key = 'dept';
				}
				else if (k == 'BrandName') {
					key = 'brand';
				}
				else if (k == 'PageName') {
					key = 'kw'
				}
				
				// we will manually set dept value of cirPlusSlot
				if (typeof(cirPlusSlot) !== 'undefined'){
					if ( typeof(isCirPlus) !== 'undefined' && key == 'dept') {
						property = [GetCookie('cirPlusDept')];
					}
				}
				
				if (key != '') obj.setTargeting(key, property);
			}							
		}
	}
	
	////
	// Refresh the Adpods.
	////
    function RefreshAdPods(response) {
		var data = [];
		
		// parse json for new targetting
		if (response) {
			if (response.responseJSON.d) {
				if (globalslots) {
					lastTargetting = response.responseJSON.d.AdPods[0];
					
					if (Gsn.Advertising.getBrand) {
						lastTargetting.BrandName = Gsn.Advertising.getBrand();
					}
					
					for(var i = 0; i < globalslots.length; i++) {
						setTargetings(globalslots[i], lastTargetting);
					}
					
					// call set targetting for cirPlusSlot
					if (cirPlusSlot) {
						for(var i = 0; i < cirPlusSlots.length; i++) {
							setTargetings(cirPlusSlots[i], lastTargetting, true);
						}
					}
				}
			}
		}
		try {
			
			// Publish the ads
			googletag.pubads().refresh(globalslots); 
			
            // Update google.
            UpdateGoogle();
		}
        catch (e) { 
			
		}  
    }
    ////
    // Campaign Callback
    ////
    function CampaignCallback(response)
    {
        // entry object
        var entry = null;
        var entries = [];
        
        // Get the request length.
        var len = response.length;
        if (len > 0)
        {
            // Loop through the campaigns.
            for(var index =0; index < len; index++)
            {
                // Get the entry
                entry = response[index];
    			  
    		    // Set the campaign cookie.
	    		SetCampaignCookie("GSN.Cookies.Campaign", entry.Value);

                // Push the value onto the array	    		
	    	    entries.push(entry.Value);
		    }
		    
		    // set targetting department
            for(var i = 0; i < globalslots.length; i++) 
		    {
			    setTargetings(globalslots[i], { Departments: entries.join(',')});
		    }
        }
        else
        {
            // Set the campaign cookie.
	    	SetCampaignCookie("GSN.Cookies.Campaign", 0);
        } 
      
	    // Refresh the add pods.				
        DisplayAdPods();
    }
    
    function ClearStyle(iframe) {

        try {
            if (typeof(iframe.style) != 'undefined') {
                iframe.removeAttribute('style');
            }
        }
        catch (e) {
        }
    }

    /*function Purge(adPodDiv) {
        if (adPodDiv != null) {
            var childElements = adPodDiv.children;
            if (childElements != null) {
                for (var i = 0; i < childElements.length; i++) {
                    if (childElements[i].tagName.toLowerCase() != 'iframe' && !childElements[i].className.match('No-Remove')) {
                        adPodDiv.removeChild(childElements[i]);
                    }
                }
            }
        }
    }*/

    function addResizeHandler(iframe) {
        if (iExplore) {
            Event.observe(iframe, 'readystatechange', resizeIframe(iframe));
        }
        else {
            Event.observe(iframe, 'load', resizeIframe(iframe));
        }
    }

    function resizeIframe(frame) {
        try {
            if (frame == null) {
                return;
            }
        
            var innerDoc = (frame.contentDocument) ? frame.contentDocument : frame.contentWindow.document;

            if (innerDoc == null) {
                return;
            }
            
            var ad = innerDoc.getElementById("ad");
            var height = innerDoc.body.scrollHeight;

            if (height == 0 && ad != null) {
                height = ad.offsetHeight;
            }

            if (height > 50) {
                frame.height = height;
				
				// For 728 banners. Display style causes bugs so use position and visibility hide/show banner.
				frame.style.visibility = "visible";
				frame.style.position = "static";
				frame.style.display = 'block';
            }
			else {
				frame.style.visibility = 'hidden';
				frame.style.display = 'none';
			}
	    
        } catch (e) { }
    }