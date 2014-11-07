/*global $*/
angular.module( 'map', [] )


.factory( 'mapModel', [ '$rootScope',
function(                $rootScope ) {
	var model = {
		center: {
			lat: -23,
			lng: 143,
			zoom: 4
		},
		markers: {}
	};

	return {
		center: function() {
			return model.center;
		},
		markers: function() {
			return model.markers;
		},
		setMarkers: function( dataset ) {
			// http://tombatossals.github.io/angular-leaflet-directive/#!/examples/marker
			model.markers = $.map( dataset, function( marker ) {
				marker.focus = true;
				marker.draggable = false;
				return marker;
			});
			$rootScope.$broadcast( 'changeMapMarkers' );
		}
	};
}])


.controller( 'MapController', [ 'mapModel', '$scope',
function(                        mapModel,   $scope ) {

	// view model
	var map = this;

	// http://leaflet-extras.github.io/leaflet-providers/preview/
	var Esri_NatGeoWorldMap = {
		url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
		options: {
			attribution: 'Tiles &copy; Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2013',
		}
	};

	// map UI
	// http://tombatossals.github.io/angular-leaflet-directive/#!/examples/simple-map
	map.config = { scrollWheelZoom: true };
	map.tiles = Esri_NatGeoWorldMap;
	map.center = mapModel.center();

	map.markers = mapModel.markers();

	// update markers
	$scope.$on( 'changeMapMarkers', function() {
		map.markers = mapModel.markers();
	});

}]);
