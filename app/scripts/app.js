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


// no hashbangs
.config([ '$locationProvider', function( $locationProvider ) {
	$locationProvider.html5Mode( true );
}])


// global MAM routing
.config([ '$stateProvider',
function(  $stateProvider ) {
	// search results
	$stateProvider.state( 'mam', {
		abstract: true,
		url: '/',
		template: '<ui-view/>'
	});
}])


// URL/route/state changes
.run([   '$rootScope', '$state', '$location', '$anchorScroll',
function( $rootScope ,  $state ,  $location ,  $anchorScroll ) {
	// $rootScope.$on( '$stateChangeStart', function() {
	// });

	$rootScope.$on( '$stateChangeSuccess', function() {
		// $rootScope.isLoading = false;
		// $rootScope.loadingPercent = 100;
		$( '#article' ).trigger( 'x-height-change' );
		$anchorScroll( 0 );
	});

	$rootScope.$on( '$stateNotFound', function() {
		console.log( '$stateNotFound' );
		// $( document ).status( 'show', {
		// 	lightbox: true,
		// 	status: 'fail',
		// 	title: 'Not found',
		// 	content: '<p>State not found.</p>'
		// });
	});
	$rootScope.$on( '$stateChangeError', function() {
		console.log( '$stateChangeError' );
		// $( document ).status( 'show', {
		// 	lightbox: true,
		// 	status: 'fail',
		// 	title: 'Routing error',
		// 	content: '<p>Routing error.</p>'
		// });
	});

	// initial state
	$state.go( $location.search().title ? 'mam.detail' : 'mam.search', $location.search() );
}]);
