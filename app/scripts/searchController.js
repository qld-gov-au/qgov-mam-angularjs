/*global $*/
angular.module( 'mam.searchView', [ 'ngRoute', 'qgovMam.config' ])


.config([ '$routeProvider', 'SOURCE',
function(  $routeProvider,   SOURCE ) {
// search results
	$routeProvider.when( '/', {
		// old MAM detail view URLs: ?title=<title>
		redirectTo: function() {
			// https://github.com/angular/angular.js/issues/7239
			if ( /title=[^&]/.test( window.location.search )) {
				return '/' + window.location.search.replace( /^.*[?&]title=([^&]+).*?$/, '$1' );

			} else if ( window.location.search.length > 0 ) {
				// put search params into fragment
				var search = window.location.search;
				window.location.href = window.location.href.replace( /\?[^#]*/, '' );
				return '/' + search;
			}
		},
		controller: 'SearchController',
		controllerAs: 'vm',
		templateUrl: 'search.html',
		resolve: {
			pageNumber: [ '$location', function( $location ) {
				return parseInt( $location.search().page, 10 ) || 1;
			}],
			json: [  'ckan', '$location',
			function( ckan,   $location ) {
				var search = $location.search();

				// reserved search params: fulltext, latlng, distance
				var fullText = search.query;

				// custom search params
				var filter = search;
				delete filter.query;

				return ckan.datastoreSearchSQL({
					resourceId: SOURCE.resourceId,
					fullText: fullText,
					filter: filter
				});
			}]
		}
	});
}])


.controller( 'SearchController', [ 'RESULTS_PER_PAGE', 'PAGES_AVAILABLE', 'qgovMapModel', 'pageNumber', 'json',
function(                           RESULTS_PER_PAGE,   PAGES_AVAILABLE,   qgovMapModel,   pageNumber,   json ) {

	// view model
	var vm = this;

	var total = json.result.records.length;
	var firstResultOnPage = ( pageNumber - 1 ) * RESULTS_PER_PAGE + 1;

	vm.searchResults = json.result.records.slice( firstResultOnPage - 1, firstResultOnPage + RESULTS_PER_PAGE );

	qgovMapModel.setMarkers(
		$.map( json.result.records, function( record ) {
			return {
				latlng: [ parseFloat( record.Latitude ), parseFloat( record.Longitude ) ],
				options: { title: record.Title || record.Name }
			};
		})
	);

	// result set description
	// http://www.qld.gov.au/web/cue/module5/checkpoints/checkpoint09/
	vm.description = {
		start: firstResultOnPage,
		end: Math.min( firstResultOnPage + RESULTS_PER_PAGE - 1, total ),
		total: total,
		keywords: ''
	};

	var lastPage = Math.ceil( total / RESULTS_PER_PAGE );
	var minPage = Math.max( 1, Math.min( pageNumber - Math.ceil( PAGES_AVAILABLE / 2 ), lastPage - PAGES_AVAILABLE ));
	var maxPage = Math.min( lastPage, minPage + PAGES_AVAILABLE );

	// pagination
	// http://www.qld.gov.au/web/cue/module5/checkpoints/checkpoint15/
	vm.pagination = {
		current: pageNumber,
		previous: pageNumber > 1 ? pageNumber - 1 : null,
		next: pageNumber < lastPage ? pageNumber + 1 : null,
		limit: RESULTS_PER_PAGE,
		pages: []
	};

	for ( var i = minPage; i <= maxPage; i++ ) {
		vm.pagination.pages.push( i );
	}

}])


// search form
.controller( 'SearchFormController', [ '$location',
function(                               $location ) {


	var form = this;

	// read initial params from URL
	form.search = $location.search();

	// apply filter to search results
	form.submit = function() {
		$location.search( form.search );
	};

	// console.log( form );

}]);
