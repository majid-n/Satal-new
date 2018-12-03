import noUiSlider from '../js/vendors/nouislider'
var wNumb = require('../js/vendors/wNumb');

var rangeSlider = (options) => {
	var _options = $.extend({
        selector: '',
        start: [ 0, 100 ],
        direction: 'rtl',
        orientation: 'horizontal',
        behaviour: 'tap-drag',
        step: 1,
        format: wNumb({
            decimals: 0
        }),
    }, options);

    if(!_options.range) {
        _options.range = {
            'min' : _options.start[0],
            'max' : _options.start[1]
        }
    }

    var _selector = $(_options.selector || '.customRange');
    var _slider = _selector.find('.slider');

    _slider.each((i, el) => {
        noUiSlider.create(el, _options);

        el.noUiSlider.on('update', function(values, handle, raw) {
            if (_selector.hasClass('single')) {
                _slider.data('range-value', Math.round(raw[0]));
            } else {
                $(el).parent().find('.min > span').html(values[0]);
                $(el).parent().find('.min').data('range-value', Math.round(raw[0]));
                $(el).parent().find('.max > span').html(values[1]);
                $(el).parent().find('.max').data('range-value', Math.round(raw[1]));
            }
        });

        var handle = $(el).find('.noUi-handle');
        handle.on('keydown', function (e) {
            var value = Number(el.noUiSlider.get());
            if (e.which === 39) el.noUiSlider.set(value - 1);
            if (e.which === 37) el.noUiSlider.set(value + 1);
        });
    })


}

module.exports = rangeSlider;