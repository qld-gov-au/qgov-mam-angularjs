angular.module( 'qgovMam', [ 'ngRoute', 'qgov', 'ckanApi', 'leaflet-directive', 'map', 'hc.marked', 'mam.searchView', 'mam.detailView' ])

.constant( 'TPL_PATH', '/templates' )
// search results
.constant( 'RESULTS_PER_PAGE', 10 )
.constant( 'PAGES_AVAILABLE', 10 )


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


.config([ '$routeProvider', 'TPL_PATH',
function(  $routeProvider,   TPL_PATH ) {
	$routeProvider
	// search results
	.when( '/', {
		// old MAM detail view URLs: ?title=<title>
		redirectTo: function() {
			// https://github.com/angular/angular.js/issues/7239
			if ( /title=[^&]/.test( window.location.search )) {
				return '/' + window.location.search.replace( /^.*[?&]title=([^&]+).*?$/, '$1' );
			}
		},
		controller: 'SearchController',
		controllerAs: 'vm',
		templateUrl: TPL_PATH + '/search.html',
		resolve: {
			pageNumber: [ '$location', function( $location ) {
				return parseInt( $location.search().page, 10 ) || 1;
			}],
			json: [ 'ckan', function( ckan ) {
				return ckan.sqlRequest();
			}]
		}
	})
	// details view
	.when( '/:title', {
		// tidy up old MAM URLs
		redirectTo: function() {
			window.location.href = window.location.href.replace( /\?[^#]*/, '' );
		},
		controller: 'DetailController',
		controllerAs: 'vm',
		templateUrl: TPL_PATH + '/detail.html',
		resolve: {
			title: [ '$route', function( $route ) {
				return $route.current.params.title;
			}],
			json: [ 'ckan', function( ckan ) {
				return ckan.sqlRequest();
			}]
		}
	})
	.otherwise({ redirectTo : '/' });
}]);
