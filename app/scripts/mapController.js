/*global $ */
angular.module( 'qgov.map', [] )

// map details
.constant( 'MAX_ZOOM', $( '#app-viewport' ).hasClass( 'obscure' ) ? 12 : 17 )


.factory( 'qgovMapModel', function() {
	var markers = [];

	return {
		markers: function() {
			return markers;
		},
		setMarkers: function( markerData ) {
			markers = markerData;
			// $.map( dataset, function( record ) {
			// 	return $.window.L.marker([ record.lat, record.lng ], {
			// 		title: record.title,
			// 		clickable: true,
			// 		keyboard: true,
			// 		draggable: false
			// 	});
			// });
		}
	};
})


.controller( 'qgovMapController', [ 'qgovMapModel', '$window', '$scope', '$location', 'MAX_ZOOM',
function(                            qgovMapModel ,  $window ,  $scope ,  $location ,  MAX_ZOOM ) {

	// leaflet config
	$window.L.Icon.Default.imagePath = $window.qg.swe.paths.assets + 'images/skin/map-marker';

	// setup the DIV container
	$( '#map_canvas' ).height( 270 );

	// init leaflet
	var map = $window.L.map( 'map_canvas', {
		center: [ -23, 143 ],
		zoom: 5,
		maxZoom: MAX_ZOOM,
		fullscreenControl: true,
		fullscreenControlOptions: { // optional
			title:'Fullscreen'
		}
	});

	// tile layers
	var basemaps = {
		'Street map': $window.L.tileLayer( '//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2013'
		}),
		Satellite: $window.L.layerGroup([
			$window.L.tileLayer( '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
				attribution: 'Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
			}),
			$window.L.tileLayer( '//server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
				attribution: '© 2013 Esri, DeLorme, NAVTEQ, TomTom'
			}),
			$window.L.tileLayer( '//server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
				attribution: '© 2013 Esri, DeLorme, NAVTEQ, TomTom'
			})
		])
	};

	basemaps[ 'Street map' ].addTo( map );
	$window.L.control.layers( basemaps, {} ).addTo( map );

	// cluster layer
	var cluster = new $window.L.MarkerClusterGroup({
		iconCreateFunction: function( cluster ) {
			return $window.L.divIcon({
				iconAnchor: [ 10, 25 ],
				html: '<img src="' + $window.L.Icon.Default.imagePath + '/cluster-marker-icon.png" alt="" />' + '<span class="count">' + cluster.getChildCount() + '</span>',
				className: 'cluster-icon'
			});
		}
	});

	// update markers
	$scope.$watch( qgovMapModel.markers, function( newMarkers ) {

		// turn them into markers
		var markers = $.map( newMarkers, function( data ) {
			return $window.L.marker( data.latlng, data.options );
		});

		// clear old
		cluster.clearLayers();
		map.removeLayer( cluster );

		// add new
		if ( markers.length ) {
			cluster.addLayers( markers );
			map.addLayer( cluster );
			// fit to map
			map.fitBounds( new $window.L.featureGroup( markers ).getBounds() );
		}
	});

	// center on Qld
	// center: {
	// 	lat: -23,
	// 	lng: 143,
	// 	zoom: 4
	// },


}]);
