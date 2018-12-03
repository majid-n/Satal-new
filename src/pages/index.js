import '../sass/index_page.scss'
// import '../js/vendors/autocomplete'
import '../js/updateDom'
import '../js/global'

// var Config = require('../js/config');
var AjaxCall = require('../js/form/ajaxCall');
// var AutoComplete = require('../js/autocomplete');

// import './js/vendors/wow'
// new WOW().init();

$(function () {
    'use strict';
    
    $('.cities-container').on('click', 'button', (e) => {
        e.preventDefault();
        let $this = $(e.currentTarget);
        let id = $this.attr('data-id'),
            name = $this.attr('data-title'),
            parent = $this.parent();
            
        if (parent.hasClass('has-cities')) {
            window.location = `/adverts.html?cityid=${id}`;
        } else {
            AjaxCall.GetProvinces({ provinceID: id }).done(cities => {
                $('.cities-container').updateDom(cities, {
                    callback: (parent, items) => {
                        if (!parent.hasClass('has-cities')) parent.addClass('has-cities');
                    }
                });
            });
        }
    })

    // AutoComplete({
    //     url: Config.apiServer.baseUrl + Config.apiServer.provinces,
    //     // data: ''
    // });
});

AjaxCall.GetProvinces({}, '.cities-container').done(provinces => {
    $('.cities-container').updateDom(provinces, { animate: true });
});

// function ripple(selector) {
//     var _selector = selector || '.customBtn';
// 	$(_selector).on('click', function (event) {
// 		if ($(this).find('.ripple-effect').length) {
// 			$(this).find('.ripple-effect').remove();
// 		}
// 		var $div = $('<div/>'),
// 			btnOffset = $(this).offset(),
// 			xPos = event.pageX - btnOffset.left,
// 			yPos = event.pageY - btnOffset.top;

// 		$div.addClass('ripple-effect');
// 		var $ripple = $(".ripple-effect");

// 		$ripple.css("height", $(this).height());
// 		$ripple.css("width", $(this).height());
// 		$div.css({
// 			top: yPos - ($ripple.height()/2),
// 			left: xPos - ($ripple.width()/2)
// 		}).appendTo($(this));

// 		window.setTimeout(function(){
// 			$div.remove();
// 		}, 1900);
// 	});
// }

// function increment(selector) {
//     var _selector = selector || "[data-increment]";
//     $(_selector).append('<div class="inc button_inc">+</div><div class="dec button_inc">-</div>');
// 	$(".button_inc").on("click", function () {
// 		var $button = $(this);
// 		var oldValue = $button.parent().find("input").val();
// 		if ($button.text() == "+") {
// 			var newVal = parseFloat(oldValue) + 1;
// 		} else {
// 			if (oldValue > 1) var newVal = parseFloat(oldValue) - 1;
// 			else newVal = 0;
// 		}
// 		$button.parent().find("input").val(newVal);
// 	});
// }

// $(document).ready(function () {
//     var map = $('.map').AdoraMap({
//         center: {
//             lat: 35.768057,
//             lng: 51.491390,
//             marker: true,
//             currentPosition: true
//         },
//         allowDragMarker : true,
//         zoom: 13,
//         zoomAnimateLevel: -5,
//         markers: [
//             {
//                 lat: 35.768057,
//                 lng: 51.491390,
//                 popup: {
//                     title: 'شماره 1',
//                     open : true
//                 }
//             },
//             {
//                 lat: 35.758057,
//                 lng: 51.281390,
//                 popup: {
//                     title: 'شماره 2',
//                     open: false
//                 }
//             }
//         ]
//     });
// });