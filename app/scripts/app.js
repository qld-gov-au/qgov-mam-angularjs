/*global $*/
angular.module( 'qgovMam', [ 'ngRoute', 'qgov', 'ckanApi', 'leaflet-directive', 'qgov.map', 'hc.marked', 'mam.errorView', 'mam.searchView', 'mam.detailView' ])

// markdown config
.config([ 'markedProvider',
function(  markedProvider ) {
	// https://github.com/chjj/marked#options-1
	markedProvider.setOptions({
		gfm: true,
		tables: true,
		sanitize: true, // no HTML
	});
}])


// routing
.config([ '$routeProvider',
function(  $routeProvider ) {
	// default routes
	$routeProvider
	.otherwise({ redirectTo : '/' });
}])


.run([   '$rootScope', '$location',
function( $rootScope,   $location ) {
	// $rootScope.$on( '$routeChangeStart', function() {
	// 	$rootScope.isLoading = true;
	// 	$rootScope.loadingPercent = 10;
	// });

	$rootScope.$on( '$routeChangeSuccess', function() {
		// $rootScope.isLoading = false;
		// $rootScope.loadingPercent = 100;
		$( '#article' ).trigger( 'x-height-change' );
	});

	$rootScope.$on( '$routeChangeError', function() {
		// console.log( '$routeChangeError' );
		$location.path( '/error' );
	});
}]);
