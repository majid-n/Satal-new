import 'bootstrap';
import './lib/dictionary';

var vars = {
    win: $(window),
	ww: $(window).innerWidth(),
	wh: $(window).innerHeight(),
	st: $(window).scrollTop(),
	mac: navigator.platform.toUpperCase().indexOf('MAC') >=0 ? true : false,
    mob: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
}

$(function () {
	'use strict';

	vars.win.on('load', function () {
        vars.win.scroll();
        vars.win.resize();
	})
    
	vars.win.on('resize', function(event) {
        vars.ww = vars.win.innerWidth(),
        vars.wh = vars.win.innerHeight();
        if (vars.ww < 990) $('.categories').removeClass('open');
    });

	vars.win.on('scroll', function(event) {
		vars.st = vars.win.scrollTop();
		if ($(this).scrollTop() > $('header').outerHeight()) $('header').addClass("sticky");
		else $('header').removeClass("sticky");

		if (vars.win.scrollTop() >= 800) $(".goTop").addClass('visible');
		else $(".goTop").removeClass('visible')
    });

    $(document).on('click', function(event) {
        if(!$('.search-top [name="mainSearch"]').val()) $('.search-top').removeClass('open');
    })

    $('.search-top').on('click', function(event) {
        event.stopPropagation();
    })

    $('.searchBtn').on('click', function(e) {
        e.preventDefault();
        let $this = $(this),
            $input = $this.prev('input');
        if (!$this.parent().is('.open')) _setFocus($input);
        if ($input.val()) console.log('search');
        else $this.parent().toggleClass('open');
    })

    $('.cat_toggle').on('click', function () {
        $(this).parent().toggleClass('open');
    });

    $('.navbar-toggler').on('click', function () {
        $(this).toggleClass('open');
    });

	// Go Top button
	$('.goTop').on('click', function (e) {
		e.preventDefault();
		goTo();
    });
});

var _setFocus = (element) => {
	let $el = typeof element === 'string' ? $(element) : element;
	
	if ($el.hasClass("flexdatalist")) $el.next('.flexdatalist-alias').focus();
	else if ($el.hasClass("hasDatepicker")) setTimeout(() => $el.focus(), 1);
	else $el.focus();
}

var _bgSize = () => {
	var bg = $('.hasbg');
	bg.each(function(index,el) {
		$(el).css('background','url('+ $(el).data('img') +') 50% 50% / cover');
	});
	if(mob) bg.css('background-attachment','scroll');
}

var _goTo = (element, offset, callback) => {
    var elem = typeof element === 'string' ? $(element) : element;
	var top = (element && element !='') ? elem.offset().top : 0;
	$('html, body').animate({
        scrollTop: offset ? top - offset : top
    }, 1000, 'swing', () => {
        if (callback && typeof callback === 'function') {
            callback();
        }
    });
}

var _animEnd = (element, callback) => {
	$(element).one("webkitTransitionEnd otransitionend msTransitionEnd transitionend",function() {
	    if (callback && typeof callback === 'function') {
            callback();
        }
	});
}

var _getAttr = (config) => {
    var options = $.extend({ target: '', attr: '', def: '' }, config);
    if (options.attr == '') return options.def;
    var temp = $(options.target).attr(options.attr);
    if (!temp) return options.def;
    return temp;
}

var _toEn = string => {
    var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
        arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    if(typeof string === 'string') {
        for(var i=0; i<10; i++) {
            string = string.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }
    }
    return string;
}

module.exports = {
    vars: vars,
    setFocus: (element) => _setFocus(element),
    bgSize: () => _bgSize(),
    goTo: (element, offset, callback) => _goTo(element, offset, callback),
    animEnd: (element, callback) => _animEnd(element, callback),
    getAttr: (config) => _getAttr(config),
    toEn: (string) => _toEn(string)
}