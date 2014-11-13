/*global $*/
angular.module( 'qgovMam.config', [] )

// search results
.constant( 'RESULTS_PER_PAGE', 10 )
.constant( 'PAGES_AVAILABLE', 10 )

// CKAN URI format
// example: https://data.qld.gov.au/dataset/science-capability-directory/resource/8b9178e0-2995-42ad-8e55-37c15b4435a3
.constant( 'SOURCE', (function() {
	var sourceUri = $( 'meta[name="DCTERMS.source"]' ).attr( 'content' );
	var source = sourceUri.split( /\/+/ );
	return {
		resourceId: source[ source.length - 1],
		server: source[ 1 ],
		uri: sourceUri
	};
}()));
