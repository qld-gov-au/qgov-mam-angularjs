/*global $*/
angular.module( 'mam.detailView', [ 'ngRoute', 'qgovMam.config' ] )


.config([ '$routeProvider', 'SOURCE',
function(  $routeProvider,   SOURCE ) {
	$routeProvider.when( '/:title', {
		// tidy up old MAM URLs
		redirectTo: function() {
			window.location.href = window.location.href.replace( /\?[^#]*/, '' );
		},
		controller: 'DetailController',
		controllerAs: 'vm',
		templateUrl: 'detail.html',
		resolve: {
			title: [ '$route', function( $route ) {
				return $route.current.params.title;
			}],
			json: [ 'ckan', function( ckan ) {
				return ckan.sqlRequest({ resourceId: SOURCE.resourceId });
			}]
		}
	});
}])


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
