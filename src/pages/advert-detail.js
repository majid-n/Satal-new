import '../sass/advert-detail_page.scss'
import '../js/vendors/slick'
import '../js/updateDom'

var AjaxCall = require('../js/form/ajaxCall');

var advertID = 'k99exeFj1';

$(function () {
    'use strict';
    console.log('advert-detail');

    $('.slider-nav').slick({
        slidesToShow: 1,
        arrows: false,
        // fade: true,
        rtl: true,
        asNavFor: '.slider-thumb'
    });
    $('.slider-thumb').slick({
        rtl: true,
        slidesToShow: 3,
        centerMode: true,
        swipeToSlide: true,
        focusOnSelect: true,
        asNavFor: '.slider-nav',
        responsive: [
            { breakpoint: 991,settings: {slidesToShow: 2, slidesToScroll: 2} },
            { breakpoint: 600,settings: {slidesToShow: 1, slidesToScroll: 1} },
        ]
    });

    $('.getContactNum').on('click', () => {
        AjaxCall.ContactNumber(advertID).done(contact => {
            if (contact) $('.data-contact').updateDom([contact]);
        })
    })
});

AjaxCall.AdvertDetail(advertID).done(advert => {
    if (advert) {
        $('.data-breadcrumb').updateDom(advert.breadcrumb);
        $('.data-header').updateDom([advert.header]);
        $('.data-list_data').updateDom(advert.list_data);
        $('.data-links').updateDom(advert.links);
        $('.data-share').updateDom([advert.share]);
        $('.data-description').text(advert.description);
    }
})