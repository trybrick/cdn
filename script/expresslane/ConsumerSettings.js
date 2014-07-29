if (typeof (GSNServices) == 'undefined' || GSNServices == null) {
    var GSNServices = new Object();
}

GSNServices.ConsumerSettingService = {
    ServiceURL: document.location.protocol + '//' + document.location.host + '/WebService/ConsumerSettings.asmx/',
    CommunicationMethod: 'post',
    ContentType: 'application/x-www-form-urlencoded',

    GetSaveSettingRequest: function(url, requestArguments, settingID, value) {
        var request = 'url=' + url
                    + '&requestArguments=' + encodeURIComponent(requestArguments)
                    + '&settingID=' + settingID
                    + '&value=' + encodeURIComponent(value);

        return request;
    },
    SaveSetting: function(url, requestArguments, settingID, value, onSuccess, onFail) {

        var postBody = this.GetSaveSettingRequest(url, requestArguments, settingID, value);

        var request = new Ajax.Request(this.ServiceURL + 'SaveSetting', {
            method: this.CommunicationMethod,
            postBody: postBody,
            contentType: this.ContentType,
            onSuccess: onSuccess,
            onFailure: onFail
        });
    },
    GetSaveSettingByNameRequest: function(url, requestArguments, name, value) {

        var request = 'url=' + url
                    + '&requestArguments=' + encodeURIComponent(requestArguments)
                    + '&name=' + encodeURIComponent(name)
                    + '&value=' + encodeURIComponent(value);

        return request;
    },
    SaveSettingByName: function(url, requestArguments, name, value, onSuccess, onFail) {

        var postBody = this.GetSaveSettingByNameRequest(url, requestArguments, name, value);

        var request = new Ajax.Request(this.ServiceURL + 'SaveSettingByName', {
            method: this.CommunicationMethod,
            postBody: postBody,
            contentType: this.ContentType,
            onSuccess: onSuccess,
            onFailure: onFail
        });
    },
    SetConsumerSetting: function(settingID, value) {
        var requestArgs = GSNContext.RequestArguments;
        var url = document.URL;

        if (typeof (refreshAdPods) == 'function') {
            this.SaveSetting(url, requestArgs, settingID, value, refreshAdPods, refreshAdPods);
        }
        else {
            this.SaveSetting(url, requestArgs, settingID, value, null, null);
        }
    },
    SetConsumerSettingByName: function(name, value) {
        var requestArgs = GSNContext.RequestArguments;
        var url = document.URL;

        if (typeof (refreshAdPods) == 'function') {
            this.SaveSettingByName(url, requestArgs, name, value, refreshAdPods, refreshAdPods);
        }
        else {
            this.SaveSettingByName(url, requestArgs, name, value, null, null);
        }
    },
    SetConsumerSettingByNameResponse: function(name, value, onSuccess) {
        var requestArgs = GSNContext.RequestArguments;
        var url = document.URL;

        if (typeof (refreshAdPods) == 'function') {
            this.SaveSettingByName(url, requestArgs, name, value, onSuccess, refreshAdPods);
        }
        else {
            this.SaveSettingByName(url, requestArgs, name, value, onSuccess, null);
        }
    }
};

function SaveSetting(url, requestArguments, settingID, value, onSuccess, onFail) {
    GSNServices.ConsumerSettingService.SaveSetting(url, requestArguments, settingID, value, onSuccess, onFail);
}

function SaveSettingByName(url, requestArguments, name, value, onSuccess, onFail) {
    GSNServices.ConsumerSettingService.SaveSettingByName(url, requestArguments, name, value, onSuccess, onFail);
}

function SetConsumerSetting(settingID, value) {
    GSNServices.ConsumerSettingService.SetConsumerSetting(settingID, value);
}

function SetConsumerSettingByName(name, value) {
    GSNServices.ConsumerSettingService.SetConsumerSettingByName(name, value);
}