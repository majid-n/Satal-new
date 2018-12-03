var Toast = require('../lib/toast');

var localCache = {
    timeout: 30000,
    data: {},
    remove: function (url) {
        delete localCache.data[url];
    },
    exist: function (url) {
        return !!localCache.data[url] && ((new Date().getTime() - localCache.data[url]._) < localCache.timeout);
    },
    get: function (url) {
        return localCache.data[url].data;
    },
    set: function (url, cachedData, callback) {
        localCache.remove(url);
        localCache.data[url] = {
            _: new Date().getTime(),
            data: cachedData
        };
        if ($.isFunction(callback)) callback(cachedData);
    }
};

function _sendRequest(url, options) {
    var settings = $.extend({
        url: url,
        async: true,
        cache: false,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        crossDomain: true,
        data: {},
        element: '',
        dataType: 'json',
        headers: {},
        method: 'GET',
        timeout: 10000,
        statusCode: {},
        beforeSend: (jqXHR, settings) => {},
        always: (jqXHR, textStatus) => {},
        done: (data, textStatus, jqXHR) => {},
        fromCache: (data) => {},
        fail: (jqXHR, textStatus, error) => {
            Toast.showDanger({ text: 'خطا در دریافت اطلاعات' });
            $(settings.element).addClass('has-error');
        }
    },options);
    
    $.ajaxPrefilter((options, originalOptions, jqXHR) => {
        if (options.cache) {
            var complete = originalOptions.complete || $.noop,
                url = originalOptions.url;

            options.cache = false;
            options.beforeSend = function () {
                if (localCache.exist(url)) {
                    console.log('cache exists', localCache.exist(url));
                    options.fromCache(localCache.get(url));
                    return false;
                }
                return true;
            };
            
            options.done = function (data, textStatus) {
                localCache.set(url, data, complete);
            };
        }
        if (options.element) {
            options.beforeSend = () => {
                let classname = options.element === 'body' ? 'fixed' : '';
                $(options.element).append(`<div class="wait ${classname}"/>`);
            };
            options.complete = () => {
                let wait = $(options.element).find('.wait');
                wait.fadeOut(() => wait.remove());
            };
        }
    });

    if (!settings.url || !settings.url.length) {
        console.error('Ajax call url can not be empty');
    }

    var _ajaxResponse = null;

    if (settings.contentType.toLowerCase() === 'application/json') {
        settings.data = JSON.stringify(settings.data);
    }

    var result = $.ajax(settings)
        .always(function (response, resultStatus, xhr) {
            _ajaxResponse = response;
            switch (resultStatus.toLowerCase())
            {
                case ("error"):
                    // در صورتی که خطا داشتیم پارامتر اول اکس اچ آر است !!!!
                    if (response && response.responseJSON) {
                        _ajaxResponse = response.responseJSON;
                        xhr = response;
                    }
                    break;
            }
            if (settings.always && typeof (settings.always) === 'function') {
                //settings.always(_ajaxResponse, resultStatus, xhr);
                settings.always({
                    response: _ajaxResponse,
                    resultStatus: resultStatus,
                    xhr : xhr
                });
            }
        })
        .catch(function (xhr) {
            if (settings.apiFailed && typeof (settings.apiFailed) === 'function') {
                //settings.apiFailed(_ajaxResponse, xhr.statusText, xhr);
                settings.apiFailed({
                    response: _ajaxResponse,
                    resultStatus: 'error',
                    xhr: xhr
                });
            }
            else if (settings.fail && typeof (settings.fail) === 'function') {
                //settings.fail(_ajaxResponse, xhr.statusText, xhr);
                settings.fail({
                    response: _ajaxResponse,
                    resultStatus: 'error',
                    xhr: xhr
                });
            }
            
        });

    return result;
}

var Ajax = {
    get : function (url, options) {
        options.method = 'get';
        var result = _sendRequest(url, options);
        return result;
    },

    post : function (url, options) {
        options.method = 'post';
        var result = _sendRequest(url, options)
        return result;
    }
};

module.exports = Ajax;