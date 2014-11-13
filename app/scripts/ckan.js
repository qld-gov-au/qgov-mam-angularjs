angular.module( 'ckanApi', [] )


// SQL request
// http://docs.ckan.org/en/latest/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search_sql
.factory( 'sqlRequest', [ '$http', '$q',
function(                  $http,   $q ) {

	return function( args ) {
		var params = {};
		var defer = $q.defer();
		var from = [];
		var where = [];

		// dataset UUID format check
		// http://stackoverflow.com/questions/19989481/how-to-determine-if-a-string-is-a-valid-v4-uuid
		if ( /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/.test( args.resourceId )) {
			from.push( args.resourceId );
		} else {
			defer.reject( 'Invalid resource ID: ' + args.resourceId );
			return defer.promise;
		}

		// where clause
		if ( where.length > 0 ) {
			where = where.join( ' AND ' );
		} else {
			where = '1=1';
		}

		angular.extend( params, {
			sql: 'SELECT * FROM "' + from.join( ',' ) + '" WHERE ' + where
		});
		// console.log( params.sql );

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