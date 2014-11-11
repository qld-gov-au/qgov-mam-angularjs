/*global $, L, qg*/
angular.module( 'map', [] )

// map details
.constant( 'MAX_ZOOM', $( '#app-viewport' ).hasClass( 'obscure' ) ? 12 : 17 )


.factory( 'mapModel', [ '$rootScope', 'MAX_ZOOM',
function(                $rootScope,   MAX_ZOOM ) {
	// leaflet config
	L.Icon.Default.imagePath = qg.swe.paths.assets + 'images/skin/map-marker';

	var model = {
		center: {
			lat: -23,
			lng: 143,
			zoom: 4
		},
		layers: {
			baselayers: {
				street: {
					name: 'Street map',
					url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
					type: 'xyz',
					options: { attribution: 'Tiles &copy; Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2013' }
				},
				satellite: {
					name: 'Satellite',
					url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
					type: 'xyz',
					options: { attribution: 'Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community' }
				}
				// , {
				// 	url: '//server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
				// 	options: { attribution: '© 2013 Esri, DeLorme, NAVTEQ, TomTom' }
				// }, {
				// 	url: '//server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
				// 	options: { attribution: '© 2013 Esri, DeLorme, NAVTEQ, TomTom' }
				// }]
			}
		},
		markers: {}
	};

	return {
		center: function() {
			return model.center;
		},
		layers: function() {
			return model.layers;
		},
		markers: function() {
			return model.markers;
		},
		setMarkers: function( dataset ) {
			// http://tombatossals.github.io/angular-leaflet-directive/#!/examples/marker
			model.markers = $.map( dataset, function( marker ) {
				marker.focus = true;
				marker.draggable = false;
				marker.group = 'cluster';
				return marker;
			});

			// TODO if markers.length > 1, fit to bounds
			if ( model.markers.length === 1 ) {
				// only one marker, zoom in on it
				model.center.lat = model.markers[ 0 ].lat;
				model.center.lng = model.markers[ 0 ].lng;
				model.center.zoom = MAX_ZOOM;
			}

			$rootScope.$broadcast( 'changeMapMarkers' );
		}
	};
}])


.controller( 'MapController', [ 'mapModel', '$scope', '$location',
function(                        mapModel,   $scope,   $location ) {

	// view model
	var map = this;

	// map UI
	// http://tombatossals.github.io/angular-leaflet-directive/#!/examples/simple-map
	map.config = { scrollWheelZoom: true };

	// http://leaflet-extras.github.io/leaflet-providers/preview/
	map.layers = mapModel.layers();

	function updateMap() {
		map.center = mapModel.center();
		map.markers = mapModel.markers();
	}

	// when markers change
	$scope.$on( 'changeMapMarkers', updateMap );

	// onload
	updateMap();

	// marker click
	$scope.$on( 'leafletDirectiveMarker.click', function( event, args ) {
		var marker = map.markers[ args.markerName ];
		$location.path( '/' + marker.title );
	});

}]);
