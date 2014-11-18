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
				return ckan.datastoreSearchSQL({ resourceId: SOURCE.resourceId });
			}]
		}
	});
}])


.controller( 'DetailController', [ 'title', 'qgovMapModel', 'json',
function(                           title,   qgovMapModel,   json ) {

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

	qgovMapModel.setMarkers([{
		latlng: [ parseFloat( vm.item.Latitude ), parseFloat( vm.item.Longitude ) ],
		options: { title: vm.item.Title || vm.item.Name }
	}]);

}]);
