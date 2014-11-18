angular.module( 'mam.errorView', [ 'ngRoute' ])


.config([ '$routeProvider',
function(  $routeProvider ) {
	$routeProvider.when( '/error', {
		templateUrl: 'error.html'
	});
}]);
