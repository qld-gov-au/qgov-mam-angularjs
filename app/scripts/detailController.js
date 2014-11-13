/*global $*/
angular.module( 'mam.detailView', [] )

.controller( 'DetailController', [ 'title', 'mapModel', 'json',
function(                           title,   mapModel,   json ) {

	// view model
	var vm = this;

	var item = json.result.records.filter(function( item ) {
		return title === $.trim( item.Title ) || title === $.trim( item.Name );
	});

	if ( item.length > 0 ) {
		vm.item = item[ 0 ];
	} else {
		// error, no match
	}

	mapModel.setMarkers([{
		title: vm.item.Title || vm.item.Name,
		lat: parseFloat( vm.item.Latitude ),
		lng: parseFloat( vm.item.Longitude )
	}]);

}]);
