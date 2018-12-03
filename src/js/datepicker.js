import '../js/vendors/datepicker'
import '../js/vendors/datepicker.fa'

var datePicker = (options) => {
	var _options = $.extend({
        isRTL: true,
        selector: '',
		minDate: new Date(),
        dateFormat: 'yy/mm/dd',
		numberOfMonths: 2,
		showButtonPanel: true,
		onSelect: function(minText) {
			var $this = $(this);
			
			var related = $this.attr('data-related');
			if (related) {
				$(related).datepicker("option", "minDate", minText);
				$(related).datepicker("option", "onSelect", function(maxText) {
					$this.datepicker("option", "maxDate", maxText);
					var nextStep = $(related).attr('data-next');
					if (nextStep) setFocus(nextStep);
				});
			}

			var nextStep = $this.attr('data-next');
			if (nextStep) setFocus(nextStep);
		}
    }, options);
	var _selector = $(_options.selector || '.datePicker');

    _selector.datepicker(_options);
    _selector.datepicker("setDate",'now');
    
}

module.exports = datePicker;