/*global $*/
angular.module( 'mam.searchView', [] )

.controller( 'SearchController', [ 'RESULTS_PER_PAGE', 'PAGES_AVAILABLE', 'mapModel', 'pageNumber', 'json',
function(                           RESULTS_PER_PAGE,   PAGES_AVAILABLE,   mapModel,   pageNumber,   json ) {

	// view model
	var vm = this;

	var total = json.result.records.length;
	var firstResultOnPage = ( pageNumber - 1 ) * RESULTS_PER_PAGE + 1;

	vm.searchResults = json.result.records.slice( firstResultOnPage - 1, firstResultOnPage + RESULTS_PER_PAGE );

	mapModel.setMarkers(
		$.map( json.result.records, function( record ) {
			return {
				title: record.Title,
				lat: parseFloat( record.Latitude ),
				lng: parseFloat( record.Longitude )
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

}]);
