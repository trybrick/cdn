if (typeof (GSNServices) == 'undefined' || GSNServices == null) {
    var GSNServices = new Object();
}

GSNServices.AdService = {
    ServiceURL: document.location.protocol + '//' + document.location.host + '/WebService/Ad.asmx/',
    CommunicationMethod: 'post',
    ContentType: 'application/json; charset=utf-8',
    GetAdRequestRequest: function(requestUrl) {
        var request = "{url:\'" + requestUrl + "'}";

        return request;
    },
    GetLogExternalAdImpressionRequest: function(requestUrl, adCode, creativeID, adRequestUrl) {

        var creativeIDNum = new Number(creativeID);

        if (creativeIDNum.toString() == 'NaN') {
            creativeID = 0;
        }
        else {
            creativeID = creativeIDNum.toFixed(0);
        }

        var request = "{url:\'" + requestUrl + "\',adCode:\'" + adCode + "\',creativeID:\'" + creativeID + "\',adRequestUrl:\'" + adRequestUrl + "\'}";

        return request;
    },
    GetLogAdRequestRequest: function(url, requestArguments, adRequest) {

        var request = "{url:\'" + url + "\',requestArguements:\'" + requestArguments + "\',adRequest:\'" + adRequest + "\'}";

        return request;
    },
    GetLogImpressionRequest: function(url, requestArguments, adCode, creativeID, adRequestUrl) {

        var creativeIDNum = new Number(creativeID);

        if (creativeIDNum.toString() == 'NaN') {

            creativeID = 0;
        }
        else {

            creativeID = creativeIDNum.toFixed(0);
        }

        var request = "{url:\'" + url + "\',requestArguments:\'" + requestArguments + "\',adCode:\'" + adCode + "\',creativeID:\'" + creativeID + "\',adRequestUrl:\'" + adRequestUrl + "\'}";

        return request;
    },
    /*GetAdInternalRequest: function(url, requestArguments, staticpagetypeid) {

        var request = "{url:\'" + url + "\',requestArguements:\'" + requestArguments + "\',staticpagetypeid:\'" + staticpagetypeid + "\'}";

        return request;
    },*/
    GetGetAdRequestsRequest: function(requestArguments, sourceID) {
        return "{requestArguments:\'" + requestArguments + "\', sourceID:" + new Number(sourceID) + " }";
    },
    GetSetAdBrandingRequest: function(requestArguments, brandName) {
        return "{requestArguments:\'" + requestArguments + "\', brandOnDemand:'" + brandName + "' }";
    },
    /*GetAdInternal: function(url, requestArguments, staticpagetypeid, onSuccess, onFail) {

        var postBody = this.GetAdInternalRequest(url, requestArguments, staticpagetypeid);

        var request = new Ajax.Request(this.ServiceURL + 'GetAdInternalRequest', {
            method: this.CommunicationMethod,
            postBody: postBody,
            contentType: this.ContentType,
            onSuccess: onSuccess,
            onFailure: onFail
        });
    },*/
    LogImpression: function(url, requestArguments, adCode, creativeID, adRequestUrl, onSuccess, onFail) {

        var postBody = this.GetLogImpressionRequest(url, requestArguments, adCode, creativeID, adRequestUrl);

        var request = new Ajax.Request(this.ServiceURL + 'LogImpression', {
            method: this.CommunicationMethod,
            postBody: postBody,
            contentType: this.ContentType,
            onSuccess: onSuccess,
            onFailure: onFail
        });
    },
    GetAdRequest: function(requestUrl, onSuccess, onFail) {

        var postBody = this.GetAdRequestRequest(requestUrl);

        var request = new Ajax.Request(this.ServiceURL + 'GetAdRequest', {
            method: this.CommunicationMethod,
            postBody: postBody,
            contentType: this.ContentType,
            onSuccess: onSuccess,
            onFailure: onFail
        });
    },
    LogExternalAdImpression: function(requestUrl, adCode, creativeID, adRequestUrl, onSuccess, onFail) {

        var postBody = this.GetLogExternalAdImpressionRequest(requestUrl, adCode, creativeID, adRequestUrl);

        var request = new Ajax.Request(this.ServiceURL + 'LogExternalAdImpression', {
            method: this.CommunicationMethod,
            postBody: postBody,
            contentType: this.ContentType,
            onSuccess: onSuccess,
            onFailure: onFail
        });
    },
    LogAdRequest: function(url, requestArguements, adRequest, onSuccess, onFail) {

        var postBody = this.GetLogAdRequestRequest(url, requestArguements, adRequest);

        var request = new Ajax.Request(this.ServiceURL + 'LogAdRequest', {
            method: this.CommunicationMethod,
            postBody: postBody,
            contentType: this.ContentType,
            onSuccess: onSuccess,
            onFailure: onFail
        });
    },
    GetAdRequests: function(requestArguments, onSuccess, onFail, sourceID) {
        var postBody = this.GetGetAdRequestsRequest(requestArguments, sourceID);

        var request = new Ajax.Request(this.ServiceURL + 'GetAdRequests', {
            method: this.CommunicationMethod,
            postBody: postBody,
            contentType: this.ContentType,
            onSuccess: onSuccess,
            onFailure: onFail
        });
    },
    SetAdBranding: function(requestArguments, onSuccess, onFail, brandName) {
        var postBody = this.GetSetAdBrandingRequest(requestArguments, brandName);

        var request = new Ajax.Request(this.ServiceURL + 'SaveBrandOnDemandtoSession', {
            method: this.CommunicationMethod,
            postBody: postBody,
            contentType: this.ContentType,
            onSuccess: onSuccess,
            onFailure: onFail
        });
    }
};

function GetAdInternal(url, requestArguements, staticpagetypeid, onSuccess, onFail) {
    GSNServices.AdService.GetAdInternal(url, requestArguements, staticpagetypeid, onSuccess, onFail);
}

function LogImpression(url, requestArguements, adCode, creativeID, adRequestUrl, onSuccess, onFail) {
    GSNServices.AdService.LogImpression(url, requestArguements, adCode, creativeID, adRequestUrl, onSuccess, onFail);
}

function GetAdRequest(requestUrl, onSuccess, onFail) {
    GSNServices.AdService.GetAdRequest(requestUrl, onSuccess, onFail);
}

function LogExternalAdImpression(requestUrl, adCode, creativeID, adRequestUrl, onSuccess, onFail) {
    GSNServices.AdService.LogExternalAdImpression(requestUrl, adCode, creativeID, adRequestUrl, onSuccess, onFail);
}

function LogAdRequest(url, requestArguments, adRequest, onSuccess, onFail) {
    GSNServices.AdService.LogAdRequest(url, requestArguments, adRequest, onSuccess, onFail);
}

function SetAdBranding(brandName, onComplete) {
    GSNServices.AdService.SetAdBranding(GSNContext.RequestArguments, onComplete, onComplete, brandName);
}