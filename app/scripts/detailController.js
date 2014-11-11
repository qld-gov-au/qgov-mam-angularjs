angular.module( 'mam.detailView', [] )

.controller( 'DetailController', [ 'title', 'mapModel', 'json',
function(                           title,   mapModel,   json ) {

	// view model
	var vm = this;

	var item = json.result.records.filter(function( item ) {
		return title === item.Title;
	});

	if ( item.length > 0 ) {
		vm.item = item[ 0 ];
	} else {
		// error, no match
	}

	mapModel.setMarkers([{
		title: vm.item.Title,
		lat: parseFloat( vm.item.Latitude ),
		lng: parseFloat( vm.item.Longitude )
	}]);

}]);
