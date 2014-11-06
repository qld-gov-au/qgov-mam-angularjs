angular.module('qgovMam', [ 'ngRoute', 'hc.marked', 'qgov', 'searchView' ])
// angular.module('qgovMam', [ 'ngRoute', 'qgov', 'searchView' ])

.constant( 'TPL_PATH', '/templates' )
// search results
.constant( 'RESULTS_PER_PAGE', 10 )
.constant( 'PAGES_AVAILABLE', 10 )


// markdown config
.config([ 'markedProvider',
function(  markedProvider ) {
	markedProvider.setOptions({ gfm: true });
}])


.config([ '$routeProvider', 'TPL_PATH',
function(  $routeProvider,   TPL_PATH ) {
	$routeProvider
	.when( '/', {
		controller: 'SearchController',
		controllerAs: 'vm',
		templateUrl : TPL_PATH + '/search.html'
	})
	.otherwise({ redirectTo : '/' });
}]);
