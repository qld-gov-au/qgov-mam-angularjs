/*global $*/
angular.module( 'qgovMam', [ 'ngRoute', 'qgov', 'ckanApi', 'leaflet-directive', 'map', 'hc.marked', 'mam.searchView', 'mam.detailView' ])

// search results
.constant( 'RESULTS_PER_PAGE', 10 )
.constant( 'PAGES_AVAILABLE', 10 )

// CKAN URI format
// example: https://data.qld.gov.au/dataset/science-capability-directory/resource/8b9178e0-2995-42ad-8e55-37c15b4435a3
.constant( 'SOURCE', (function() {
	var sourceUri = $( 'meta[name="DCTERMS.source"]' ).attr( 'content' );
	var source = sourceUri.split( /\/+/ );
	return {
		dataset: source[ source.length - 1],
		server: source[ 1 ],
		uri: sourceUri
	};
}()))


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
.config([ '$routeProvider', 'SOURCE',
function(  $routeProvider,   SOURCE ) {
	$routeProvider

	// route error
	.when( '/error', {
		templateUrl: 'error.html'
	})

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
		templateUrl: 'search.html',
		resolve: {
			pageNumber: [ '$location', function( $location ) {
				return parseInt( $location.search().page, 10 ) || 1;
			}],
			json: [ 'ckan', function( ckan ) {
				return ckan.sqlRequest({ dataset: SOURCE.dataset });
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
		templateUrl: 'detail.html',
		resolve: {
			title: [ '$route', function( $route ) {
				return $route.current.params.title;
			}],
			json: [ 'ckan', function( ckan ) {
				return ckan.sqlRequest({ dataset: SOURCE.dataset });
			}]
		}
	})
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
		$location.path( '/error' );
	});
}]);
