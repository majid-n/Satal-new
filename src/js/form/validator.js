var _emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var _urlFilter = /^http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$/;

function _validateRequired($Elem) {
    if (!$Elem) return false;
    if ($Elem.length == 0) return false;

    var val = $Elem.val();

    if (val == undefined || val == null) return false;

    if (val.length == 0) return false;

    return true;
}

function _validateEmail($Elem) {

    var val = $Elem.val();
    if (val && !_emailFilter.test(val)) { return false; }
    return true;
}

function _validateMobile ($Elem) {
    var val = $Elem.val();
    if (!val || !val.length) return true;
    if (isNaN(parseInt(val))) return false;
    if(isNaN(parseInt(val) - val)) return false;
    return (
        val.indexOf('09') == 0 && /*با 09 شروع شود*/
        val.length == 11 /*11 کاراکتر باشد*/
    );
}

function _validateUrl($Elem) {
    var val = $Elem.val();
    if (val && !_urlFilter.test(val)) { return false; }
    return true;
}

function _validateNationalCode($Elem)
{
    var val = $Elem.val();
    if (val && !val.isValidNationalCode()) { return false; }
    return true;
}

function _validateAgreement($Elem) {
    return $Elem.is(":checked");
}

function _validateConfirmPassword($Elem) {
    
    var val = $Elem.val();
    var confirmVal = null;
    var elemId = $.getAttr({ target: $Elem, attr: 'id', def: '' });
    var confirmElemId = $.getAttr({ target: $Elem, attr: 'data-validator-confirm-password-id', def: '' });
    var $confirmElem = null;
    if (elemId && elemId.length) {
        $confirmElem = $(`[for="${elemId}"]`);
    }

    if (!$confirmElem && confirmElemId && confirmElemId.length) {
        $confirmElem = $(confirmElemId);
    }

    if ($confirmElem) {
        confirmVal = $confirmElem.val();

        if (confirmVal != val) {
            return false;
        }
    }

    return true;
}

function _getElementDataValidatorAttributes(element)
{
    var result = new Array();

    $.each(element.attributes, function() {
        if (this.name.toLowerCase().indexOf('data-validator-') == 0) {
            var validatorName = this.name.toLowerCase().substr('data-validator-'.length);
            var fn = null;
            switch(validatorName)
            {
                case('required'):
                    fn = function () { return _validateRequired($(element)); }
                    break;
                case('nationalcode'):
                    fn = function () { return _validateNationalCode($(element)); }
                    break;
                case('email'):
                    fn = function () { return _validateEmail($(element)); }
                    break;
                case ('mobile'):
                    fn = function () { return _validateMobile($(element)); }
                    break;
                case ('agreement'):
                    fn = function () { return _validateAgreement($(element)); }
                    break;
                case ('confirm-password'):
                    fn = function () { return _validateConfirmPassword($(element)); }
                    break;

            }
            result.push({
                validatorName : validatorName,
                target : $(element),
                message : this.value,
                fn : fn
            });
        }
    });
    return result;
}

function _validateForm(config) {
    var options = $.extend({ 
        target : "#frm",
        resetForm: true,
        exclude : ''
    },config);
    var $form = $(options.target);

    if(options.resetForm === true)
    {
        $form.find('small.error-validator').remove();
        $form.find('.has-error').removeClass('has-error');
    }

    var validators = new Array();

    $($form).find('[name]').not(options.exclude).each(function (index, element) {
        $.each(_getElementDataValidatorAttributes(element),function(index,v){
            validators.push(v);
        })
    });

    var result = true;
    $.each(validators,function(index,validator){

        if(validator.fn() === false) {
            result = false;
            var error = $(`<small class="error-validator">${validator.message}</small>`);
            validator.target.addClass('has-error');
            if (validator.validatorName === 'agreement') {
                var agreementLabel = $(validator.target).nextAll('.indicator');
                error.addClass('mdl-block');
                $(error).insertAfter(agreementLabel);
            }
            else {
                if (validator.target.is('.flexdatalist')) {
                    $(error).insertAfter(validator.target.next('.flexdatalist-alias'));
                    return;
                }
                $(error).insertAfter(validator.target);
            }
        }
    });
    return result;
}

var validator = {
    validateRequired: function (elem) {
        return _validateRequired($(elem));
    },
    validateEmail: function (elem) {
        return _validateEmail($(elem));
    },
    validateUrl: function (elem) {
        return _validateUrl($(elem));
    },
    validateMobile: function (elem) {
        return _validateMobile($(elem));
    },
    validateNationalCode: function (elem) {
        return _validateNationalCode($(elem));
    },
    validateConfirmPassword: function (elem) {
        return _validateConfirmPassword($(elem));
    },
    validateForm: function (config) {
        return _validateForm(config);s
    }
};

module.exports = validator;