import '../js/vendors/leaflet'

$.fn.customMap = function (config) {
    'use strict'
    var VERSION = '1.0.0';
    var settings = {
        center:
        {
            lat: null,
            lng: null,
            icon: '',
            marker: false,
            currentPosition: false,
            options: {},
            popup: {
                title: '',
                open: false
            },
            tooltip: {
                title: '',
                open: false
            }
        },
        zoom: 13,
        maxZoom: 18,
        markers: [],
        defaultLayer: 'mapbox.streets',
        allowDragMarker: false,
        zoomAnimateLevel: 0,
        token: 'sk.eyJ1IjoibWFqaWQtbiIsImEiOiJjam15bW13YTgwM3U3M3dsM2lxdDMyOWt3In0.82MdYyN7NdAR_yZI8aGaEw',
        attribution: '&copy; <a href="http://satal.com">Satal</a>',
        onInit: function () { }
    };
    settings = $.extend(settings, config);

    var Leaflet = L;
    var $This = $(this);
    var thisHtmlElement = $This.get(0);
    var $Map = {};
    var markersGroup = new Array();
    var $CenterMarker = null;
    var markerPositionsHistory = new Array();
    var mapCoordinte = {};
    var currentPosition = {};
    var user_changed_marker_position = false;

    function _init(config) {
        var mapSettings = _getMapSettings(config);

        _initMap(mapSettings, function () {

            Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: settings.attribution,
                accessToken: settings.token,
                id: settings.defaultLayer
            }).addTo($Map);

            if (config.center && config.center.marker) {
                var currentCenter = $This.getCenter();
                var centerMarker = _addMarker(
                    {
                        markers: [{ lat: currentCenter.lat, lng: currentCenter.lng }],
                        addToGroup: true,
                        draggable: config.allowDragMarker,
                        autoPan: true
                    });
                if (centerMarker && centerMarker.length) {
                    $CenterMarker = centerMarker[0];
                    _setMapCoordinate($CenterMarker);
                    if (config.allowDragMarker) {
                        markerPositionsHistory.push($CenterMarker.getLatLng());
                        $CenterMarker.on('dragend', function (e) {
                            user_changed_marker_position = true;
                            _setMarkerPosition($CenterMarker);
                            _setMapCoordinate($CenterMarker);

                        });
                    }

                }
            }

            // adding all markers to map
            if (config.markers && config.markers.length) {
                _addMarker({ markers: config.markers, addToGroup: true, draggable: false });
                _setBoundary();
            }

            if (settings.allowDragMarker && $CenterMarker) {
                $Map.doubleClickZoom.disable();
                $Map.on('dblclick', function (event) {
                    _setMarkerPosition({
                        marker: $CenterMarker,
                        lat: event.latlng.lat,
                        lng: event.latlng.lng
                    });
                    markerPositionsHistory.push($CenterMarker.getLatLng());
                    _setMapCoordinate($CenterMarker);
                    user_changed_marker_position = true;
                    return false;
                });
            }

            window.setTimeout(function () {
                if (settings.zoomAnimateLevel != 0) {
                    $Map.flyTo($This.getCenter(), settings.zoom);
                }
            }, 800);


            if (settings.onInit && typeof settings.onInit === 'function') {
                settings.onInit($This);
            }

        })
    }

    function _initMap(options, callback) {
        if (options.center) {
            $Map = Leaflet.map(thisHtmlElement, options);
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
        else {
            function success(e) {
                currentPosition = {
                    lat: e.coords.latitude,
                    lng: e.coords.longitude,
                    accuracy: e.coords.accuracy
                };
                options.center = [e.coords.latitude, e.coords.longitude];
                $Map = Leaflet.map(thisHtmlElement, options);

                if (callback && typeof callback === 'function') {
                    callback();
                }
            }

            function error(e) {
                options.center = [35.768057, 51.491390];
                $Map = Leaflet.map(thisHtmlElement, options);
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }

            Adora.getCurrentPosition(success, error, { timeout: 5000 });
        }

    }

    function _getMapSettings(config) {
        var result = $.extend({}, config);

        if (config.center) {
            if (config.center.lat && config.center.lng) {
                result.center = [config.center.lat, config.center.lng];
            }
            else {
                result.center = null;
            }
        }
        if (config.zoom && config.zoomAnimateLevel != 0) {
            result.zoom = (config.zoom + config.zoomAnimateLevel);
        }

        return result;
    }

    function _addArea(config) {

        var _defaultSettings = {
            type: 'marker',
            position: [],
            options: {},
            popup: '',
            openPopup: false,
            tooltip: '',
            openTooltip: false
        };

        _defaultSettings = $.extend(_defaultSettings, config);

        if (_defaultSettings.position && _defaultSettings.type.toLowerCase()) {
            var area;
            switch (_defaultSettings.type) {
                case 'circle':
                    area = Leaflet.circle(_defaultSettings.position, _defaultSettings.options).addTo($Map);
                    break;
                case 'polygon':
                    area = Leaflet.polygon(_defaultSettings.position, _defaultSettings.options).addTo($Map);
                    break;
                case 'rectangle':
                    area = Leaflet.rectangle(_defaultSettings.position, _defaultSettings.options).addTo($Map);
                    break;
                case 'marker':
                    area = Leaflet.marker(_defaultSettings.position, _defaultSettings.options).addTo($Map);
                    break;
            }

            if (_defaultSettings.popup) {
                var _pop = area.bindPopup(_defaultSettings.popup);
                if (_defaultSettings.openPopup) _pop.openPopup();
            }
            if (_defaultSettings.tooltip) {
                var _tip = area.bindTooltip(_defaultSettings.tooltip);
                if (_defaultSettings.openTooltip) _tip.openTooltip();
            }
        }
        return area;
    }

    function _addMarker(config) {
        var _defaultSettings = {
            markers: [],
            addToGroup: true,
            draggable: false
        };

        _defaultSettings = $.extend(_defaultSettings, config);
        

        var result = new Array();

        if (typeof _defaultSettings.markers === 'Object' && !_defaultSettings.markers instanceof Array) {
            var markersArray = new Array();
            markersArray.push(_defaultSettings.markers);
            _defaultSettings.markers = markersArray;
        }

        if (_defaultSettings.markers && _defaultSettings.markers.length) {
            $.each(_defaultSettings.markers, function (index, marker) {
                var markerOptions = $.extend({
                    autoPan: true
                }, marker.options || {});

                markerOptions.draggable = _defaultSettings.draggable;
                markerOptions.autoPan = true;

                var addAreaOption = {
                    type: 'marker',
                    position: [marker.lat, marker.lng],
                    options: markerOptions,
                    popup: marker.popup ? marker.popup.title : '',
                    openPopup: marker.popup ? marker.popup.open : false,
                    tooltip: marker.tooltip ? marker.tooltip.title : '',
                    openTooltip: marker.tooltip ? marker.tooltip.open : false
                };
                
                var area = _addArea(addAreaOption);


                //if (_defaultSettings.draggable) {
                //    markerPositionsHistory.push(area.getLatLng());
                //    area.on('dragend', function (e) {
                //        user_changed_marker_position = true;
                //        _setMarkerPosition(area);
                //        _setMapCoordinate($CenterMarker);

                //    });
                //}

                if (_defaultSettings.addToGroup) {
                    markersGroup.push(area);
                }

                result.push(area);
            });
        }

        return result;
    }

    function _addCircle(config) {
        var _defaultSettings = {
            markers: [],
            addToGroup: true,
            draggable: false
        };

        _defaultSettings = $.extend(_defaultSettings, config);

        var result = new Array();

        // if (is.object(_defaultSettings.markers) && is.not.array(_defaultSettings.markers)) {
            var markersArray = new Array();
            markersArray.push(_defaultSettings.markers);
            _defaultSettings.markers = markersArray;
        // }

        if (_defaultSettings.markers && _defaultSettings.markers.length) {
            $.each(_defaultSettings.markers, function (index, marker) {

                var markerOptions = $.extend({
                    color: '#4fc3f7',
                    fillColor: '#2196f3',
                    fillOpacity: 0.3,
                    radius: 500

                }, marker.options || {});

                markerOptions.draggable = _defaultSettings.draggable;
                markerOptions.autoPan = true;

                var addAreaOption = {
                    type: 'circle',
                    position: [marker.lat, marker.lng],
                    options: markerOptions,
                    popup: marker.popup ? marker.popup.title : '',
                    openPopup: marker.popup ? marker.popup.open : false,
                    tooltip: marker.tooltip ? marker.tooltip.title : '',
                    openTooltip: marker.tooltip ? marker.tooltip.open : false
                };
                var area = _addArea(addAreaOption);


                if (_defaultSettings.draggable) {
                    markerPositionsHistory.push(area.getLatLng());
                    area.on('dragend', function (e) {
                        markerPositionsHistory.push(area.getLatLng());
                        _setMapCoordinate(area);
                    });
                }

                if (_defaultSettings.addToGroup) {
                    markersGroup.push(area);
                }

                result.push(area);
            });
        }

        return result;
    }

    function _setBoundary() {
        if (!markersGroup || !markersGroup.length) return;
        var group = new Leaflet.featureGroup(markersGroup);
        $Map.flyToBounds(group.getBounds());
        $Map.once('moveend', function () {
            $Map.setMaxBounds(group);
        });
    }

    function _setMapCoordinate(area) {
        var latLng = area.getLatLng();
        mapCoordinte.lat = latLng.lat;
        mapCoordinte.lng = latLng.lng;
        mapCoordinte.zoom = $Map.getZoom();
    }

    function _setCenter(options) {
        var _defaultSettings = {
            lat: null,
            lng: null,
            zoom: $Map.getZoom()
        };

        _defaultSettings = $.extend(_defaultSettings, options);

        if (_defaultSettings && _defaultSettings.lat && _defaultSettings.lng) {
            $Map.flyTo([_defaultSettings.lat, _defaultSettings.lng], _defaultSettings.zoom);
        }

    }

    function _addMarkerToCurrentPosition(config) {

        var _defaultSettings = {
            addToGroup: true,
            draggable: false,
            isCenterMarker: false
        };

        _defaultSettings = $.extend(_defaultSettings, config);

        $This.flyToCurrentPosition({
            onLocationFound: function (e) {
                var radius = e.accuracy / 2;
                _addMarker(
                    {
                        markers: [
                            {
                                lat: e.latlng.lat,
                                lng: e.latlng.lng
                            }
                        ],
                        addToGroup: true,
                        draggable: _defaultSettings.allowDragMarker
                    }
                );
                //Leaflet.circle(e.latlng, radius).addTo($Map);
            }
        });
    }

    function _setMarkerPosition(options) {
        if (options && options.marker && options.lat && options.lng) {
            var zoom = options.zoom ? options.zoom : $Map.getZoom();
            options.marker.setLatLng([options.lat, options.lng], { zoom: zoom });
        }

    }

    $This.addMarker = function (config) {
        return _addMarker(config);
    }

    $This.setCenter = function (config) {
        _setCenter(config);
    }

    $This.getValue = function (config) {
        return {
            lat: mapCoordinte.lat,
            lng: mapCoordinte.lng,
            zoom: $Map.getZoom(),
            history: markerPositionsHistory
        }
    }

    $This.getCenter = function () {
        return $Map.getCenter();
    }

    $This.setMarkerPosition = function (marker, changePosition) {
        var m = marker == null ? $CenterMarker : marker;
        if (m) {
            _setMarkerPosition({
                marker: m,
                lat: changePosition.lat,
                lng: changePosition.lng
            });
        }
    }

    $This.setMapCenterMarkerValue = function (options) {
        _setCenter({
            lat: options.lat,
            lng: options.lng,
            zoom: options.zoom
        });
        $This.setMarkerPosition($CenterMarker, {
            lat: options.lat,
            lng: options.lng,
            zoom: options.zoom
        });
        _setMapCoordinate($CenterMarker);
    }

    $This.userChangedMarkerPosition = function () {
        return user_changed_marker_position;
    }

    $This.map = function () {
        return $Map;
    }

    _init(settings);

    $This.data('adora-map', $This);

    return $This;
}