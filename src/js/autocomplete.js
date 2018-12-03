import '../js/vendors/autocomplete'

var autocomplete = (options) => {
	var _options = $.extend({
		url: '',
		data: '',
		params: {},
		multiple: false,
		disabled: false,
		minLength: 1,
		focusFirstResult: true,
        selectionRequired: true,
        selector: '.autocomplete',
		searchIn: ["Title"],
        textProperty: '{Title}',
		noResultsText: 'نتیجه ای برای "{keyword}" پیدا نشد',
		visibleProperties: [],
        valueProperty: 'ID',
        onSelect: (value) => {},
        onRemove: (value) => {},
        onLoad: (value) => {}
    }, options);
    
    let $el = $(_options.selector),
        val;

    $el.flexdatalist(_options)
	.on('select:flexdatalist', function(event, set, options) {
        var nextStep = $(event.target).attr('data-next');
        val = $el.flexdatalist('value');
        $el.data('raw-value', val);
        if (nextStep) setFocus(nextStep);
        if (_options.onSelect && typeof _options.onSelect === 'function') _options.onSelect(val);
    })
	.on('after:flexdatalist.remove', function(event, data) {
        val = $el.flexdatalist('value');
        if (_options.onRemove && typeof _options.onRemove === 'function') _options.onRemove(val);
    })
    .on('after:flexdatalist.data', function(event, data) {
        val = $el.flexdatalist('value');
        if (_options.onLoad && typeof _options.onLoad === 'function') _options.onLoad(val);
    })
    
    return $el;
}

module.exports = autocomplete;