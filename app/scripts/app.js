/*global $*/
angular.module( 'qgovMam', [ 'ui.router', 'qgov', 'ckanApi', 'qgov.map', 'hc.marked', 'mam.searchView', 'mam.detailView' ])

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


.config([ '$locationProvider', '$urlRouterProvider', '$stateProvider',
function(  $locationProvider ,  $urlRouterProvider ,  $stateProvider ) {
	// no hashbangs
	$locationProvider.html5Mode( true );

	// URL handling

	// redirect /index.html to /
	$urlRouterProvider.when( '/index.html', '/' );

	// ignore hash changes (default browser/SWE behaviour)
	$urlRouterProvider.rule(function( $injector, $location ) {
		if ( $location.hash() ) {
			return true;
		}
	});

	// main routing
	$stateProvider
	.state( 'mam', {
		abstract: true,
		url: '/',
		template: '<ui-view/>'
	});
}])


// URL/route/state changes
.run([   '$rootScope', '$state', '$location', '$anchorScroll',
function( $rootScope ,  $state ,  $location ,  $anchorScroll ) {
	$rootScope.$on( '$stateChangeStart', function( event, toState, toParams, fromState ) {
		// check for greedy search start
		if ( toState.name === 'mam.search' && $location.search().title ) {
			// detail state, not search
			event.preventDefault();
			if ( fromState.name !== 'mam.detail' ) {
				// view state please
				$state.go( 'mam.detail', $location.search() );
			}
		}
	});

	$rootScope.$on( '$stateChangeSuccess', function() {
		// $rootScope.isLoading = false;
		// $rootScope.loadingPercent = 100;
		$( '#article' ).trigger( 'x-height-change' );
		$anchorScroll( 0 );
	});

	$rootScope.$on( '$stateNotFound', function() {
		console.log( '$stateNotFound' );
	});
	$rootScope.$on( '$stateChangeError', function( event, toState, toParams, fromState, fromParams, error ) {
		console.log( '$stateChangeError', error );
	});
}]);
