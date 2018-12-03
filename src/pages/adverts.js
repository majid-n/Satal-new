import '../sass/adverts_page.scss'
import '../js/vendors/niceselect'
import '../js/updateDom'
// import '../js/global'

var AjaxCall = require('../js/form/ajaxCall');
var Autocomplete = require('../js/autocomplete');
var RangeSlider = require('../js/range');
var wNumb = require('../js/vendors/wNumb');
var Form = require('../js/form/form');
var Global = require('../js/global');
var Config = require('../js/config');

var breadcrumbs = [];
var catIDs = [];
var parts = [];
var neighbours;
var catParent = 0;

var advertParams = {
    CityID: 1,
    Haspic: false,
    IsImmediate: false,
    Title: null,
    NeighborhoodIDs: null,
    ShowNeighbor: false,
    page: 2
};

var catLevels = {
    CategoryL1ID: 0,
    CategoryL2ID: 0,
    CategoryL3ID: 0,
    CategoryL4ID: 0
}

var filters = {
    list: [],
    init: () => {
        $('.filter-container').updateDom(filters.list, { animate: true });
        $('.filter-container').on('click', '[data-dismiss]', (e) => {
            e.preventDefault();
            let parent = $(e.target).parent('span');
            filters.remove(parent.attr('data-field'));
            parent.fadeOut(() => parent.remove());
        })
    },
    add: (name, field, update) => {
        let exist = filters.list.filter(item => item.field === field);
        if (!exist.length) {
            filters.list.push({ name: name, field:  field });
            $('.filter-container').updateDom(filters.list);
            getAdverts();
        } else {
            if (update) {
                if(field === 'neighbours') {
                    let item = filters.list.filter(item => item.field === 'neighbours')[0];
                    item.name = name;
                }
                $('.filter-container').updateDom(filters.list);
                getAdverts();
            }
        }
    },
    remove: filter => {
        let _filter = typeof filter === 'string' ? filter : filter.field;
        filters.list = filters.list.filter(item => item.field !== _filter);
        switch (filter) {
            case 'Haspic':
            case 'IsImmediate':
                $(`[name=${filter}]`).prop("checked", false);
                advertParams[filter] = false;
                break;
            case 'category':
                $('.cats-container .active').trigger('click');
                $('.cats-container').parents('.collapse').collapse('show');
                setFilters(0);
                break;
            case 'neighbours':
                $('.main-search [name="NeighborhoodIDs"]').val([]);
                advertParams.NeighborhoodIDs = [];
                break;
        }
        $('.filter-container').updateDom(filters.list);
        getAdverts();
    }
}

$(function () {
    'use strict';

    Global.vars.win.on('load', function () {
        Global.vars.win.resize();
    })
    
    Global.vars.win.on('resize', function(event) {
        if (Global.vars.ww < 768) $('.panel').not('.search-panel').find('.panel-collapse.in').collapse('hide');
        else $('.panel').not('.inside').children('.panel-collapse').collapse('show');
    });

    $('.cats-container').on('click', '.list-group-item', (e) => {
        e.preventDefault();
        let parent = $('.cats-container');

        if ($(e.target).is('.active')) {
            breadcrumbs.splice(1);
            catParent = 0;
            catIDs.length = 0;
            parent.updateDom(breadcrumbs[0]);
            parent.find('.backbtn').remove();
            getAdverts();
            return;
        }

        let id = Number($(event.target).attr('data-id')),
            backbtn = $('<button class="backbtn" />'),
            _item = breadcrumbs[breadcrumbs.length - 1].filter(item => item.ID === id)[0];

        catIDs.push(id);

        if (_item && _item.sub && _item.sub.length) {
            breadcrumbs.push(_item.sub);
            parent.updateDom(_item.sub);
        } else {
            breadcrumbs.push(_item);
            parent.updateDom([_item]);
            // parent.parents('.collapse').collapse('hide');
            filters.add(`دسته : ${_item.Title}`, 'category');
            setFilters();
        }

        if (breadcrumbs.length && catParent === 0) {
            catParent = id;
        }

        if (breadcrumbs.length > 1) {
            if(!parent.find('.backbtn').length) {
                parent.prepend(backbtn);
                backbtn.on('click', (e) => {
                    if(breadcrumbs.length > 1) {
                        breadcrumbs.splice(-1,1);
                        catIDs.splice(-1,1);
                        let last = breadcrumbs[breadcrumbs.length - 1];
                        parent.updateDom(last);
                    }
                    if(breadcrumbs.length == 1) {
                        backbtn.off('click');
                        parent.find('.backbtn').remove();
                        catParent = 0;
                        catIDs.length = 0;
                        filters.remove('category');
                        setFilters(0);
                    }
                })
            }
        }
    })

    $('.main-search [name="ShowNeighbor"]').on('change', (e) => {
        advertParams.ShowNeighbor = e.target.checked;
    })

    $('select:not(.ignore)').niceSelect();
    filters.init();

    $('.aaa').on('click', (e) => {
        e.preventDefault();
        getAdverts();
    })
});

Form.init({
    url: Config.apiServer.baseUrl + Config.apiServer.allAdverts + '/' + 0
});

AjaxCall.GetProvinces({ cityID: 1 }).done(cities => {
    neighbours = cities;
    Autocomplete({
        data: cities,
        multiple: true,
        valueProperty: ["ID", "Title"],
        onSelect: (value) => {
            advertParams.NeighborhoodIDs = value.map(item => item.ID);
            let names = value.map(item => item.Title).toString();
            filters.add(`محله : ${names}`, 'neighbours', true);
        },
        onRemove: (value) => {
            let names = value.map(item => item.Title).toString();
            if (!value.length) filters.remove('neighbours', names);
            else {
                filters.add(`محله : ${names}`, 'neighbours', true);
            }
        }
    });
});

AjaxCall.GetCategories({}, '.cats-container').done(categories => {
    breadcrumbs.push(categories);
    setCategories();
    $('.cats-container').updateDom(categories, { animate: true });
});

AjaxCall.GetParts({}).done(part => {
    parts = part;
});

getAdverts();

function getAdverts(parent) {
    let _params;
    let _parent = parent || catParent;
    if (_parent !== 0) {
        setCategories();
        let formData = Form.deepSerialize({ target: $('.filters') });
        _params = $.extend(advertParams, catLevels, formData);
    } else {
        _params = advertParams;
    }

    AjaxCall.ShowAllAdverts(_params, _parent, '.cards-holder').done(adverts => {
        if (adverts) {
            adverts.forEach(advert => advert['href'] = `/advert-detail.html?advertID=${advert.ID}`);
            $('.cards-holder').updateDom(adverts, {animate: true});
        }
    });
}

function setCategories() {
    if (catIDs.length) {
        for (let i = 0; i < catIDs.length; i++) {
            catLevels[`CategoryL${i+1}ID`] = catIDs[i];
        }
    }
}

function setFilters(parent) {
    let _parent = parent || catParent,
        templates = $('.templates'),
        items = templates.find(`[data-parent="${_parent}"]`).get(0);
    
        $('.filters').find('.panel').not('.catpanel').remove();

        if (_parent === 0) return;
        if (items) $('.filters').append(items.innerHTML);

    switch (_parent) {
        case 1:
            $('.filters select:not(.ignore)').niceSelect();
            RangeSlider({
                selector: '.price-slider',
                start: [ 0, 5000000 ],
                step: 10000,
                format: wNumb({
                    decimals: 0,
                    thousand: ',',
                    suffix: ' تومان'
                })
            });
            RangeSlider({
                selector: '.year-slider',
                start: [ 1360, 1397 ],
                format: wNumb({
                    decimals: 0,
                    prefix: 'سال '
                })
            });
            RangeSlider({
                selector: '.area-slider',
                start: [ 10, 5000 ],
                format: wNumb({
                    decimals: 0,
                    suffix: ' متر مربع'
                })
            });
            break;
        case 2:
            $('.filters select:not(.ignore)').niceSelect();
            RangeSlider({
                selector: '.price-slider',
                start: [ 0, 5000000 ],
                step: 10000,
                format: wNumb({
                    decimals: 0,
                    thousand: ',',
                    suffix: ' تومان'
                })
            });
            RangeSlider({
                selector: '.year-slider',
                start: [ 1360, 1397 ],
                format: wNumb({
                    decimals: 0,
                    prefix: 'سال '
                })
            });
            RangeSlider({
                selector: '.milage-slider',
                start: [ 0, 2000 ],
                format: wNumb({
                    decimals: 0,
                    prefix: 'کیلومتر '
                })
            });
            Autocomplete({
                data: parts.searchRequire.Vehicle.VBrand,
                selector: '[data-name="VBrandID"]'
            });
            Autocomplete({
                data: parts.searchRequire.Vehicle.VModel,
                selector: '[data-name="VModelID"]'
            });
        case 6:
            RangeSlider({
                selector: '.price-slider',
                start: [ 0, 5000000 ],
                step: 10000,
                format: wNumb({
                    decimals: 0,
                    thousand: ',',
                    suffix: ' تومان'
                })
            });
            break;
        default:
            break;
    }
}

window.toggleItem = (name, field) => {
    advertParams[field] = !advertParams[field];
    advertParams[field] ? filters.add(name, field) : filters.remove(field);
}