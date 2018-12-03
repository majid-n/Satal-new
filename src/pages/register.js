import '../sass/register_page.scss'
import '../js/vendors/niceselect'
import '../js/uploader'
import '../js/global'
import '../js/map'

var Autocomplete = require('../js/autocomplete');
var RangeSlider = require('../js/range');
var wNumb = require('../js/vendors/wNumb');
var Form = require('../js/form/form');
var Config = require('../js/config');

$(function () {
    'use strict';

    Autocomplete({
        valueProperty: 'ID',
        searchIn: ["Title", "EnTitle"],
        textProperty: '{Title}',
        data: `${Config.apiServer.baseUrl}Province?provinceID=${1}`,
        selector: '[data-name="CityID"]',
        onSelect: (value) => {
            $('[data-name="NeighborhoodID"]').flexdatalist('data', `${Config.apiServer.baseUrl}Province?CityID=${parseInt(value)}`);
        }
    });
    
    Autocomplete({
        data: '',
        valueProperty: 'ID',
        chainedRelatives: true,
        relatives: '[data-name="CityID"]',
        selector: '[data-name="NeighborhoodID"]'
    });

    $('.map').customMap({
        center: {
            lat: 35.705262263265745,
            lng: 51.406402587890625,
            marker: true,
            currentPosition: true
        },
        allowDragMarker : true,
        zoom: 14,
        zoomAnimateLevel: -5,
    });

    $('#fileUpload').Uploader({
        uploadMultiple: true,
        url: '/img',
        maxFiles: 5
    });

    RangeSlider({
        selector: '.year-slider',
        start: 1390,
        step: 1,
        range: {
            'min': 1360,
            'max': 1398
        },
        tooltips: [wNumb({decimals: 0})]
    });

    $('select:not(.ignore)').niceSelect();
    // $('.optiscroll, .nice-select .list').optiscroll({
    //     maxTrackSize: 20,
    //     forceScrollbars: true
    // });
});

Form.init();

// $('.btn-submit').on('click', (e)=> {
//     e.preventDefault();
//     var aa = Form.deepSerialize({
//         target: '#registerEstate'
//     });
//     var bb = Form.validateForm({
//         target: '#registerEstate'
//     })
//     console.log(aa, bb);
// })