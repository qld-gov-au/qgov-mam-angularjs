angular.module('qgovMam', [ 'ngRoute', 'qgov', 'searchView' ])

.constant( 'TPL_PATH', '/templates' )

.config(function( $routeProvider, TPL_PATH ) {
	$routeProvider
	.when( '/', {
		controller: 'SearchController',
		controllerAs: 'vm',
		templateUrl : TPL_PATH + '/search.html'
	})
	.otherwise({ redirectTo : '/' });
});
