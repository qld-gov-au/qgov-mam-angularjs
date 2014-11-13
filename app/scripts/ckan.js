angular.module( 'ckanApi', [] )


// generic request
.factory( 'sqlRequest', [ '$http', '$q',
function(                  $http,   $q ) {

	return function( args ) {
		var params = params || {};
		var defer = $q.defer();

		angular.extend( params, {
			sql: 'SELECT * FROM "' + args.dataset + '" WHERE 1=1'
		});

		$http.get( 'https://data.qld.gov.au/api/action/datastore_search_sql', {
			params: params,
			cache: true
		})
		.success(function( data ) {
			defer.resolve( data );
		})
		.error(function( data, status ) {
			defer.reject( status );
		});

		return defer.promise;
	};
}])


// CKAN API
.factory( 'ckan', [ 'sqlRequest',
function(            sqlRequest ) {

	return ({
		'sqlRequest': sqlRequest
	});
}])
;