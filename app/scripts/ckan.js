angular.module( 'ckanApi', [] )


// generic request
.factory( 'sqlRequest', [ '$http', '$q',
function(                  $http,   $q ) {

	return function() {
		var params = params || {};
		var defer = $q.defer();

		// hardcode user and format
		angular.extend( params, {
			sql: 'SELECT * FROM "ba4d6094-0c11-4dba-be3c-a08fe7d62f93" WHERE 1=1'
		});

		$http.get( 'https://data.qld.gov.au/api/action/datastore_search_sql', {
			params: params,
			cache: true
		})
		.success(function( data ) {
			defer.resolve( data );
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