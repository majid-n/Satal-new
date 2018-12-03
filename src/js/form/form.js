var Ajax = require('../form/ajax');
var Global = require('../global');
var validator = require('./validator');
var Toast = require('../lib/toast');

function handle_form_help_inputs() {
    $(document).ready(function () {
        $('[data-help]').each(function (index, element) {
            var $e = $(element);
            var helpMessage = $e.attr('data-help');
            if ($e.parent().hasClass('input-group')) {
                $e = $e.parent();
            }
            if (helpMessage) {
                var helpMessages = helpMessage.split('|');
                var helpContainer = $('<div class="input-help-container"></div>');
                for (var i = 0; i < helpMessages.length; i++) {
                    $('<small class="text-muted">' + helpMessages[i] + '</small>').appendTo(helpContainer);
                }
                if ($e.is('.flexdatalist')) {
                    helpContainer.insertAfter($e.next('.flexdatalist-alias'));
                    return;
                }
                helpContainer.insertAfter($e);
            }
        });
    });
}
function handle_form_submits(config) {
    $(document).ready(function () {
        $('.form-container[data-submit-ajax="true"]').each(function () {
            var $form = $(this);
            var $submitButton = $form.find('.btn-submit');
            if ($form.length && $submitButton.length) {
                $submitButton.on('click', function (e) {
                    e.preventDefault();
                    _submit(
                        $.extend({
                            form: $form,
                            target: $(this)
                        }, config)
                    );
                });
            }
        });
    });
}
function show_form_summary_modal(config) {
    var settings = {
        target: '',
        delay : 250,
        modalType: 'modal-success',
        actionMessage: '<div><span class="fa fa-check fa-2x"></span> اطلاعات با موفقیت ثبت شد</div>',
        redirectMessage: '<div>لطفا شکیبا باشید ...</div>'
    };

    settings = $.extend(settings, config);

    var $form = $(settings.target);
    
    if ($form.length) {
        window.setTimeout(function () {
            var $summary = $form.find('.form-summary');
            if ($summary.length) {
                var $messageContainer = $(`<div class="form-summary-modal-message-container ${settings.modalType}"></div>`);
                if (settings.actionMessage.length) {
                    $(settings.actionMessage).appendTo($messageContainer);
                }
                if (settings.redirectMessage.length) {
                    $(settings.redirectMessage).appendTo($messageContainer);
                }
                $messageContainer.appendTo($summary);
                $summary.addClass('modal show-modal');
            }
        }, settings.delay);
    }
}

function _handleError(config) {
    var settings = {
        configCallback: null,
        defaultCallback: null,
        xhr: null,
        response : null
    };

    settings = $.extend(settings, config);

    if (settings.configCallback && typeof (settings.configCallback) === 'function') {
        settings.configCallback(settings);
    }
    else if (settings.defaultCallback && typeof (settings.defaultCallback) === 'function') {
        settings.defaultCallback(settings);
    }

}
function _handleError400(config)
{
    var response = config.response;
    var errorList = new Array();

    errorList.push('از سرور خطا دریافت شده است');
    if (response && response.errors) {
        $.each(response.errors, function (message) {
            errorList.push(message.errormessage);
        });
        //errorList = new Array();
        
        _showFormSummary(config.settings.form, errorList);
    }
}
function _handleError500(config) {
    var response = config.response;
    var errorList = new Array();

    errorList.push('از سرور خطا دریافت شده است');
    if (response && response.errors) {
        _.forEach(response.errors, function (message) {
            errorList.push(message.errormessage);
        });
        //errorList = new Array();
    }
    _showFormSummary(config.settings.form, errorList);
}
function _handleError401(config) {
    var response = config.response;
    var errorList = new Array();

    errorList.push('خطای دسترسی. شما مجوز لازم برای انجام کار را ندارید');
    _showFormSummary(config.settings.form, errorList);
}
function _removeFormSummary(target) {
    var $summary = $(target).find('.form-summary');
    if ($summary.length) {
        $summary.removeClass('show');
        $summary.empty();
    }
}
function _showFormSummary(target, messages) {
    var $summary = $(target).find('.form-summary'); 
    $summary.empty();
    var errorList = $('<ul class="mdl-list"></ul>');
    _.forEach(messages, function (message) {
        $(`<li class="mdl-list__item"><span class= "mdl-list__item-primary-content" >${message}</span></li>`).appendTo(errorList);
    });
    errorList.appendTo($summary);
    if (!$summary.hasClass('show')) {
        $summary.addClass('show');
    }
}
function _deepSerialize(config) {
    var options = $.extend({
            target: '',
            checkCollection: true
        }, config);

    var rv, obj, names, nameIndex, value;
    rv = {};

    $('[name]', options.target).each(function (i, el) {
        if ($(el).attr(name) === 'terms') return;
        var changeToLookupId = false;
        var addToList = true;
        var ignore = false;
        value = null;
        ignore = Global.getAttr({
            target: $(el),
            attr: 'data-serilization',
            def: ''
        }).toLowerCase() === 'ignore' || $(el).is('.flexdatalist-set');

        ignore = ignore || (
            Global.getAttr({
                target: $(el),
                attr: 'data-serilization',
                def: ''
            }).toLowerCase() === 'ignore-none-collection'
            && options.checkCollection === true);

        if (ignore === false) {
            name = this.name;
            var isMap = $(this).attr('data-map');
            var isRange = $(this).attr('data-range');
            var isAutocomplete = $(this).is('.autocomplete');

            var customDataSerializerName = Global.getAttr({ target: $(this), attr: 'data-serializer', def: '' });
            var hasCustomDataSerializer = customDataSerializerName.length > 0;

            if (isMap || isRange) name = $(this).attr('name');

            if (name && name != 'undefined' && name != "" && !rv.hasOwnProperty(name)) {

                if (this.type && this.type.toLowerCase() === "checkbox") {

                    var isCheckList = Global.getAttr({ target: this, attr: 'data-is-check-list', def: 'false' }) === 'true';
                    var isBooleanList = Global.getAttr({ target: this, attr: 'data-boolean', def: 'true' }) === 'true';
                    var isChecked = $(this).is(':checked');

                    addToList = true;

                    if (isCheckList === true) {
                        $(options.target).find('input[name="' + name + '"]:checked').each(function () {
                            if ($(this).val() != undefined) {
                                value += ',' + $(this).val();
                            }
                        });
                        if (value && value.length > 1) value = value.substring(1);
                    }
                    if (isBooleanList === true && !value) {
                        value = isChecked;
                    }
                }

                else if (this.type && this.type.toLowerCase() == "radio") value = $(options.target).find('input[name="' + name + '"]:checked').val();

                else if (isMap) {
                    var map = $(this).data('adora-map');
                    if (map) {
                        var mapValue = map.getValue();
                        // value = {
                        //     lat: mapValue.lat,
                        //     lng: mapValue.lng,
                        //     zoom: parseInt(mapValue.zoom)
                        // };
                        value = [ mapValue.lat, mapValue.lng, parseInt(mapValue.zoom) ];
                    }
                }

                else if (isRange) {
                    value = $(this).data('range-value');
                }

                else if (isAutocomplete) {
                    value = $(this).data('raw-value');
                    console.log(value);
                    
                }
                
                else if (hasCustomDataSerializer) {
                    switch (customDataSerializerName.toLowerCase()) {
                        case ("address-autocomplete"):
                            var autoComplete = $(this).data('address:autocomplete');
                            if (autoComplete) {
                                value = autoComplete.getValue($(this));
                            }
                            else {
                                value = $(this).val();
                            }
                            break;
                        case ("address-serializer"):
                            var serializerObject = $(this).data('address:serializer');
                            if (serializerObject) {
                                value = serializerObject.getAddressValue();
                            }
                            else {
                                value = null;
                            }
                            break;
                    }
                }

                else value = $(this).val();

                //#region " Adding to list "
                if (addToList === true) {
                    names = name.split(".");
                    obj = rv;
                    
                    for (nameIndex = 0; nameIndex < names.length; ++nameIndex) {
                        name = names[nameIndex];
                        if (nameIndex == names.length - 1) {
                            obj[name] = value;
                        }
                        else {
                            obj = obj[name] = obj[name] || {}
                        };
                    }
                }
                //#endregion
            }
        }
    });

    //#region " Collection Generator For Hierarchy Models ! "
    // if (options.checkCollection === true) {
    //     /***************************************************************** Getting Collection Model **************************/
    //     // 1 : Generate Dictionary Array
    //     var dict = new Dictionary();
    //     var collectionModels = new Array();
    //     $('[data-model-collection]', options.target).each(function (index, elem) {
    //         var array = new Array();
    //         var key = $(elem).attr('data-model-collection');
    //         if (dict.containsKey(key)) {
    //             array = dict.value(key) || [];
    //         }
    //         var _val = _({ target: $(elem), checkCollection: false });
    //         _val.ordinal = $(elem).index();
            
    //         if (_val && Adora.getObjectPropertiesLength(_val) > 0) {
    //             array.push(_val);
    //             dict.add(key, array, true);
    //         }
    //     });

    //     //2 : Generating Object From Keys contain in dictionary!
    //     for (var i = 0; i < dict.collection.length; i++) {
    //         var o = {};
            
    //         o[dict.collection[i].key] = dict.value(dict.collection[i].key);

    //         collectionModels.push(Adora.deepen(o,true));
    //     }

    //     for (var i = 0; i < collectionModels.length; i++) {
    //         $.extend(true, rv, collectionModels[i]);
    //     }
    //     /*********************************************************************************************************************/
    // }
    //#endregion
    return rv;

}
function _deepSerializeCollection(config) {
    // 1 : Generate Dictionary Array
    var dict = new Dictionary();
    var collectionModels = new Array();
    $('[data-model-collection]', options.target).each(function (index, elem) {
        var array = new Array();
        var key = $(elem).attr('data-model-collection');
        if (dict.containsKey(key)) {
            array = dict.value(key) || [];
        }
        var _val = _deepSerialize({ target: $(elem), checkCollection: false });
        _val.ordinal = $(elem).index();

        if (_val && Adora.getObjectPropertiesLength(_val) > 0) {
            array.push(_val);
            dict.add(key, array, true);
        }
    });

    //2 : Generating Object From Keys contain in dictionary!
    for (var i = 0; i < dict.collection.length; i++) {
        var o = {};

        o[dict.collection[i].key] = dict.value(dict.collection[i].key);

        collectionModels.push(Adora.deepen(o, true));
    }

    return collectionModels;
}
function _submit(config) {

    var settings = {
        target                      : '',
        form                        : '#frm',
        actionForm                  : '',
        url                         : '',
        contentType                 : 'application/json',
        dataType                    : 'json',
        validateForm                : true,
        formData                    : null,

        beforeSend                  : function () { },
        always                      : function () { },
        apiFailed                   : null,
        done                        : function () { },
        badRequest                  : null
    };

    settings = $.extend(settings, config);

    // checking url to call.
    var url = settings.url;
    if (!url || !url.length) {
        url =  Global.getAttr({ target: settings.form, attr: 'data-url', def: '' });
        if (!url || !url.length) {
            console.error('invalid form post url');
            return false;
        }
        // else {
        //     url = Adora.resolveUrl(url);
        // }
    }
    var $form = $(settings.form);
    var $button = $(settings.target);

    // checking form validation
    if (settings.validateForm) {
        var formIsValid = _validateForm(settings);
    }

    if (formIsValid === true || !settings.validateForm) {

        var formData = {};
        if (settings.formData === null) {
            formData = _deepSerialize({
                target: $form
            });
            for (const key in formData) {
                if (formData.hasOwnProperty(key)) {
                    formData[key] = Global.toEn(formData[key]);
                }
            }
            console.log(formData);
        }
        else {
            formData = settings.formData;
        }
        delete formData['terms'];
        
        var result = Ajax.post(url, {
            data: formData,
            contentType: settings.contentType,
            beforeSend: function () {
                if ($button.length) {
                    $button.attr('disabled', 'disabled');
                }
            },
            always: function (p) {
                _removeFormSummary($form);
                window.setTimeout(function () {
                    if ($button.length) {
                        $button.removeAttr('disabled');
                    }
                }, 150);

                p.isSuccess = false;

                // form neon animating
                switch (p.xhr.status) {
                    case (200):
                        var isSuccess = p.response && p.response.issuccess === true;
                        p.isSuccess = isSuccess;
                        break;
                    case (401):
                        _handleError({
                            configCallback: function () { _handleError401({ xhr: p.xhr, response: p.response, settings: settings }) },
                            defaultCallback: settings.apiFailed,
                            xhr: p.xhr,
                            response: p.response
                        });
                        Global.
                        $.scrollToElement({
                            target: $form.find('.form-summary')
                        });
                        break;
                    default:
                        break;
                }

                if (typeof (settings.always) === 'function' && settings.always) {
                    settings.always(p);
                }
            },
            apiFailed: function (p) {
                Toast.showDanger({
                    text: 'خطا رخ داده است'
                });
                var xhr = p.xhr;
                var response = p.response;
                if (xhr) {
                    var httpStatusCode = xhr.status;
                    var response = xhr.responseJSON;
                    switch (httpStatusCode) {
                        // bad request
                        case (400):
                            _handleError({
                                configCallback: function () { _handleError400({ xhr: xhr, response: response, settings: settings }) },
                                defaultCallback: settings.apiFailed,
                                xhr: xhr,
                                response: response
                            });
                            break;
                        case (500):
                            _handleError({
                                configCallback: function () { _handleError500({ xhr: xhr, response: response, settings: settings }) },
                                defaultCallback: settings.apiFailed,
                                xhr: xhr,
                                response: response
                            });
                            //console.error('Erro 500!');
                            //console.error(xhr.responseJSON);
                            break;
                    }
                }
            }
        });

        result.done(function (response) {
            if (response) {
                var isSuccess = response.issuccess;
                Toast.showSuccess({
                    text: 'عملیات با موفقیت انجام شد'
                });
                if (isSuccess) {
                    var dataModel = response.data;
                    if (settings.done && typeof (settings.done) === 'function') {
                        settings.done(dataModel, isSuccess);
                    }
                } else {
                    Toast.showDanger({
                        text: 'عملیات با خطا مواجه شده است'
                    });
                    settings.done(response, false);
                }
            }
        });

        return result;
    }
    else {
        return 'invalid';
    }
}
function _validateForm(config) {
    var settings = {
        target: '',
        form: '#frm',
        exclude: '',
        actionForm : null,
        doFormNotification : true
    };

    settings = $.extend(settings, config);

    if (!settings.actionForm) settings.actionForm = settings.form;

    var $form = $(settings.form);
    var $button = $(settings.target);

    // checking form validation
    var formIsValid = validator.validateForm({ target: $form, exclude: settings.exclude });

    if (!formIsValid) {
        let _firstError = $form.find('.has-error').first();
        Global.goTo(_firstError, 110);
        Global.setFocus(_firstError);
        Toast.showDanger({
            text: 'اطلاعات صحیح نیست'
        });
    }

    return formIsValid;
}

var Form = {
    init: config => {
        // if (!target) target = $('body');
        $(document).ready(function () {
            handle_form_help_inputs();
            handle_form_submits(config);
        });
    },

    deepSerialize: (config) => _deepSerialize(config),
    validateForm: (config) => _validateForm(config),

    showFormSummaryModal: function (config) {
        show_form_summary_modal(config);
    }
};

module.exports = Form;