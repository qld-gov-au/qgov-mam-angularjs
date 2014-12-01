/*global $ */
angular.module( 'qgov.map', [] )

// map details
.constant( 'CENTER', [ -23, 143 ])
.constant( 'MAX_ZOOM', $( '#app-viewport' ).hasClass( 'obscure' ) ? 12 : 17 )


.factory( 'qgovMapModel', [ '$window',
function(                    $window ) {
	var markers = [];
	var areaOfInterest = null;
	var bounds;

	return {
		areaOfInterest: function() {
			return areaOfInterest;
		},
		markers: function() {
			return markers;
		},
		bounds: function() {
			return bounds;
		},
		setMarkers: function( markerData ) {
			markers = markerData;
			areaOfInterest = null;
		},
		highlight: function( latlng ) {
			areaOfInterest = latlng;
		},

		// center on a given latlong, and zoom to show at least n Markers
		// setBounds() : include all markers
		// setBounds( latlong, radius, int ) : show a subset of markers near a given location
		// assumes markers are sorted by distance from latlong
		setView: function( latlong, radius, nMarkers ) {
			nMarkers = nMarkers ? markers.slice( 0, nMarkers ) : markers;
			nMarkers = $.map( nMarkers, function( data ) {
				return $window.L.marker( data.latlng, data.options );
			});
			var newBounds = new $window.L.featureGroup( nMarkers );

			if ( latlong ) {
				radius = radius * 1000 || 7500; // km to m (leaflet)
				newBounds.addLayer( $window.L.circle( latlong, radius ));
			}

			// update model
			// bounds = newBounds.getBounds();
			bounds = newBounds.getBounds();
		}
	};
}])


.controller( 'qgovMapController', [ 'qgovMapModel', '$window', '$scope', '$location', 'CENTER', 'MAX_ZOOM',
function(                            qgovMapModel ,  $window ,  $scope ,  $location ,  CENTER ,  MAX_ZOOM ) {

	// leaflet config
	$window.L.Icon.Default.imagePath = $window.qg.swe.paths.assets + 'images/skin/map-marker';

	// setup the DIV container
	$( '#map_canvas' ).height( 270 );

	// init leaflet
	var map = $window.L.map( 'map_canvas', {
		center: CENTER,
		zoom: 4,
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


	// Replacing default values for button accessibility
	$( '.leaflet-control-zoom-fullscreen' ).html( 'Fullscreen' );
	$( '.leaflet-control-zoom-out' ).html( 'Zoom out' );
	$( '.leaflet-control-zoom-in' ).html( 'Zoom in' );

	// Let's make leaflet map js more accessible :) - putting "for" on labels for input buttons within the layers selection area.
	$( '.leaflet-control-layers-base label' ).each(function() {
		//for each span within leaflet layer label wrapper find span content and strip spaces
		var spanText = $.trim( $( 'span', this ).text().replace( /\s+/g, '' ));
		// check if this name is an id already with $(~~~).generateId(spanText);
		//set label for attribute and input id
		var input = $( 'input', this ).generateId( spanText );
		$( this ).attr( 'for', input.attr( 'id' ));
	});


	// highlight area of interest
	var circle = $window.L.circle( CENTER, 100, {
		color: '#f00',
		opacity: 0.8,
		weight: 3,
		fill: false,
		clickable: false
	});


	// marker click
	function markerClicked( title ) {
		// get back in scope
		// https://groups.google.com/forum/#!topic/angular/nFbtADyEHg8
		$scope.$apply( function() {
			// navigate to result
			$location.path( '/' + title );
		});
	}


	// update markers
	$scope.$watch( qgovMapModel.markers, function( newMarkers ) {

		// turn them into markers
		var markers = $.map( newMarkers, function( data ) {
			var marker = $window.L.marker( data.latlng, data.options );
			// FYI: leaflet doesn't implement event delegation
			// and we want the associated data anyway (leaflet only provides latlng)
			marker.on( 'click', function() {
				markerClicked( data.options.title );
			});
			return marker;
		});

		// clear old
		cluster.clearLayers();
		map.removeLayer( cluster );

		// add new
		if ( markers.length ) {
			cluster.addLayers( markers );
			map.addLayer( cluster );
		}
	});


	// display map bounds
	$scope.$watch( qgovMapModel.bounds, function( newBounds ) {
		if ( newBounds ) {
			map.fitBounds( newBounds );
		}
	});


	// update circle highlight around area of interest
	$scope.$watch( qgovMapModel.areaOfInterest, function( newLatlng ) {
		if ( newLatlng ) {
			circle.setLatLng( newLatlng );
			map.addLayer( circle );
			map.setView( newLatlng, MAX_ZOOM );
		} else {
			map.removeLayer( circle );
		}
	});

}]);
