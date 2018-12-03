var onAnimEnd = require('../global').animEnd;

function _show(config) {
    var settings = {
        text: '',
        duration: 3000,
        closable: true,
        type: '',
        addIcon : true,
        append: 'body'
    };
    settings = $.extend(settings, config);

    var $ToastContainer = $('.toast-container');
    if (!$ToastContainer || !$ToastContainer.length) {
        $ToastContainer = $('<div class="toast-container"></div>');
    }
    
    var $Toast = $(`<div class="toast"></div>`);

    if (settings.type) {
        settings.type = settings.type.toLowerCase();
        $Toast.addClass(`toast-${settings.type}`);
    }

    if (settings.append !== 'body') {
        $ToastContainer.css('overflow', 'hidden');
        $Toast.css('position', 'absolute');
    }
    $ToastContainer.appendTo(settings.append);

    var icon = "";
    if (settings.addIcon) {
        switch (settings.type) {
            case ("info"): icon = `<i class="fa fa-info toast-message-icon"></i>`; break;
            case ("success"): icon = `<i class="fa fa-check toast-message-icon"></i>`; break;
            case ("danger"): icon = `<i class="fa fa-times toast-message-icon"></i>`; break;
            case ("warning"): icon = `<i class="fa fa-fa-exclamation-triangle toast-message-icon"></i>`; break;
        }
    }

    var $ToastMessage = $(`<div class="toast-message">${icon}${settings.text}</div>`);
    $ToastMessage.appendTo($Toast);
    if (settings.closable === true) {
        $Toast.addClass(`toast-closable`);
        var $ToastCloser = $(`<a href="javascript:;" class="toast-close" rel="nofollow"><i class="fa fa-times"></i></a>`);
        $ToastCloser.on('click', function () {
            _closeToast($(this).closest('.toast'));
            return false;
        });
        $ToastCloser.appendTo($Toast);
    }

    $Toast.appendTo($ToastContainer);

    window.setTimeout(function () {
        $Toast.addClass('show');
    }, 100);
    
    if (settings.duration > 0) {
        window.setTimeout(function () {
            _closeToast($Toast);
        }, settings.duration);
    }
                    
}

function _closeToast(toast) {
    toast.removeClass('show');
    onAnimEnd(toast, function() { toast.parent().remove(); });
}

var _module = {

    show: function (config) {
        _show(config);
    },

    showDanger: function (config) {
        _show($.extend(config, {
            type: 'danger'
        }));
    },

    showInfo: function (config) {
        _show($.extend(config, {
            type: 'info'
        }));
    },

    showWarning: function (config) {
        _show($.extend(config, {
            type: 'warning'
        }));
    },

    showSuccess: function (config) {
        _show($.extend(config, {
            type: 'success'
        }));
    },

};

module.exports = _module;