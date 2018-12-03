var Config = require('../config');
var Ajax = require('./ajax');

var baseUrl = Config.apiServer.baseUrl;

var AjaxCall = {
    GetProvinces: function (model, element) {
        return Ajax.get(baseUrl + Config.apiServer.provinces, {
            data: model,
            cache: true,
            element: element
        })
    },

    GetCategories: function (model, element) {
        return Ajax.get(baseUrl + Config.apiServer.category, {
            data: model,
            cache: true,
            element: element
        })
    },

    ShowAllAdverts: function (model, cat, element) {
        return Ajax.post(baseUrl + Config.apiServer.allAdverts + `/${cat}`, {
            data: model,
            cache: true,
            element: element
        })
    },

    AdvertDetail: function (id) {
        return Ajax.get(`${baseUrl}${Config.apiServer.advertDetail}/${id}`, { element: 'body' })
    },
    
    ContactNumber: function (id) {
        return Ajax.get(`${baseUrl}${Config.apiServer.contact}/${id}`, {})
    },

    GetParts: function (id) {
        return Ajax.get(`${baseUrl}${Config.apiServer.requireParts}`, {})
    }
};

module.exports = AjaxCall;