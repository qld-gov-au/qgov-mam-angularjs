angular.module('qgovMam', [ 'ngRoute', 'hc.marked', 'qgov', 'searchView' ])
// angular.module('qgovMam', [ 'ngRoute', 'qgov', 'searchView' ])

.constant( 'TPL_PATH', '/templates' )


// markdown config
.config([ 'markedProvider', function( markedProvider ) {
	markedProvider.setOptions({ gfm: true });
}])


.config(function( $routeProvider, TPL_PATH ) {
	$routeProvider
	.when( '/', {
		controller: 'SearchController',
		controllerAs: 'vm',
		templateUrl : TPL_PATH + '/search.html'
	})
	.otherwise({ redirectTo : '/' });
});
