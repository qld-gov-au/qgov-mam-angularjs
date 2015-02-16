/*global $*/
angular.module( 'mam.searchView', [ 'esri-geocoder', 'qgovMam.config' ])


.config([ '$stateProvider',
function(  $stateProvider ) {
	// search results
	$stateProvider.state( 'mam.search', {
		url: '?query&location&distance&page&title', // need &title to trigger route changes in history
		controller: 'SearchController',
		controllerAs: 'vm',
		templateUrl: 'search.html',
		resolve: {
			pageNumber: [ '$stateParams', function( $stateParams ) {
				return parseInt( $stateParams.page, 10 ) || 1;
			}],
			results: [ 'geocoder', 'ckan', 'SOURCE', 'DEFAULT_GEO_RADIUS', '$q', '$stateParams', '$location',
			function(   geocoder ,  ckan ,  SOURCE ,  DEFAULT_GEO_RADIUS ,  $q ,  $stateParams ,  $location ) {
				var search = $location.search();
				var ckanResponse, geocodeResponse;

				// reserved search params: fulltext, location, distance
				var filter = angular.copy( search );
				// remove stateParams from custom filters
				$.each( $stateParams, function( key ) {
					delete filter[ key ];
				});

				// geo search
				if ( search.location ) {
					geocodeResponse = geocoder.findAddressCandidates({
						singleLine: $stateParams.location,
						countryCode: 'AU',
						maxLocations: 1
					});

					ckanResponse = geocodeResponse.then(function( geoResponse ) {
						return ckan.datastoreSearchSQL({
							ckanServer: SOURCE.server,
							resourceId: SOURCE.resourceId,
							fullText: $stateParams.query,
							latitude: geoResponse.candidates[ 0 ].location.y,
							longitude: geoResponse.candidates[ 0 ].location.x,
							distance: $stateParams.distance || DEFAULT_GEO_RADIUS,
							filter: filter
						});
					});

					return $q.all([ geocodeResponse, ckanResponse ]).then(function( results ) {
						return {
							geocode: results[ 0 ],
							search: results[ 1 ],
						};
					});
				}

				ckanResponse = ckan.datastoreSearchSQL({
					ckanServer: SOURCE.server,
					resourceId: SOURCE.resourceId,
					fullText: $stateParams.query,
					filter: filter
				});
				return $q.all([ ckanResponse ]).then(function( results ) {
					return {
						search: results[ 0 ]
					};
				});
			}]
		}
	});
}])


.controller( 'SearchController', [ 'RESULTS_PER_PAGE', 'PAGES_AVAILABLE', 'qgovMapModel', '$location', '$state', '$stateParams', 'pageNumber', 'results',
function(                           RESULTS_PER_PAGE ,  PAGES_AVAILABLE ,  qgovMapModel ,  $location ,  $state ,  $stateParams ,  pageNumber ,  results ) {

	// view model
	var vm = this;

	var total = results.search.result.records.length;
	var firstResultOnPage = ( pageNumber - 1 ) * RESULTS_PER_PAGE + 1;

	vm.searchResults = results.search.result.records.slice( firstResultOnPage - 1, firstResultOnPage + RESULTS_PER_PAGE );

	qgovMapModel.setMarkers(
		$.map( results.search.result.records, function( record ) {
			return record.Latitude && record.Longitude ? {
				latlng: [ parseFloat( record.Latitude ), parseFloat( record.Longitude ) ],
				options: { title: record.Title || record.Name }
			} : null;
		})
	);

	if ( results.geocode ) {
		qgovMapModel.setView({
			lat: results.geocode.candidates[ 0 ].location.y,
			lng: results.geocode.candidates[ 0 ].location.x
		}, 7.5, 2 );
	} else {
		qgovMapModel.setView();
	}

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
		limit: RESULTS_PER_PAGE,
		previous: pageNumber > 1 ? pageNumber - 1 : null,
		next: pageNumber < lastPage ? pageNumber + 1 : null,
		pages: [],
		pageUrl: function( n ) {
			// merge state, query string (custom params) and new page number
			var query = angular.extend( {}, $stateParams, $location.search(), { page: n } );
			// remove undefined values
			query = $.each( query, function( key, value ) {
				if ( ! angular.isDefined( value )) {
					delete query[ key ];
				}
			});
			return '?' + $.param( query );
		}
	};

	for ( var i = minPage; i <= maxPage; i++ ) {
		vm.pagination.pages.push( i );
	}

}])


// search form
.controller( 'SearchFormController', [ 'geocoder', '$location', '$state',
function(                               geocoder ,  $location ,  $state ) {

	var form = this;

	// read initial params from URL
	form.search = $location.search();
	// remove page number
	delete form.search.page;

	// apply filter to search results
	form.submit = function() {
		$state.go( 'mam.search', form.search, { reload: true, inherit: false });
	};

}]);
