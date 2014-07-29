//Asynchronous Google Page Tracking Script
if (typeof (GSNTrackingItems) == 'undefined' || GSNTrackingItems == null) {
    var GSNTrackingItems = new Object();
}

GSNTrackingItems.PageTracking = {
	TrackingKey: '', 
	TrackingHost: document.location.hostname
}

var _gaq = _gaq || [];

function submitPageTracking(){
	_gaq.push(['_setAccount', GSNTrackingItems.PageTracking.TrackingKey]);
	_gaq.push(['_setDomainName', GSNTrackingItems.PageTracking.TrackingHost]);
	_gaq.push(['_trackPageview']);		
	
	// google implements their script
	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
}

function submitTransactionTracking(){
	if (GSNOrderItems.Order.TotalItems > 0){
		// build transaction info
		_gaq.push(['_addTrans',
			GSNOrderItems.Order.OrderID,  // order ID - required
			GSNOrderItems.Order.StoreName,  // affiliation or store name
			GSNOrderItems.Order.Total,  // total - required
			GSNOrderItems.Order.Tax,  // tax
			GSNOrderItems.Order.DeliveryFee,  // shipping
			GSNOrderItems.Order.City,  // city
			GSNOrderItems.Order.State,  // state or province
			GSNOrderItems.Order.Country  // country
		]);	

		// loop through each item in the cart
		for (var j=0; j < GSNOrderItems.Order.TotalItems; j++){
			_gaq.push(['_addItem',
				GSNOrderItems.Order.OrderID,  // order ID - required
				GSNOrderItems.Order.SubSelectOptions[j].UPC,  // SKU/code - required
				GSNOrderItems.Order.SubSelectOptions[j].ProductName,  // product name
				GSNOrderItems.Order.SubSelectOptions[j].Category,  // category or variation
				GSNOrderItems.Order.SubSelectOptions[j].UnitPrice,  // unit price - required
				GSNOrderItems.Order.SubSelectOptions[j].Quantity  // quantity - required
			]);
		}

		// submit transaction to the Analytics servers
		_gaq.push(['_trackTrans']);
	}
}
