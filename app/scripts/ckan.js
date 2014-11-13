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
			from.push( '"' + args.resourceId + '"' );
		} else {
			defer.reject( 'Invalid resource ID: ' + args.resourceId );
			return defer.promise;
		}

		// full text searching
		// https://data.qld.gov.au/api/action/datastore_search_sql?sql=SELECT+%22Latitude%22%2C%22Longitude%22%2C%22Name%22%2C%22Description%22%2C%22Capabilities%22%2C%22Facilities%22%2C%22Weblink%22%2C%22Sector%22+from+%228b9178e0-2995-42ad-8e55-37c15b4435a3%22%2C+plainto_tsquery(+%27english%27%2C+%27innovation%27+)+query+WHERE+1+%3D+1+AND+_full_text+%40%40+query
		// https://data.qld.gov.au/api/action/datastore_search_sql?sql=SELECT+*+from+%228b9178e0-2995-42ad-8e55-37c15b4435a3%22%2C+plainto_tsquery(+%27english%27%2C+%27innovation%27+)+query+WHERE+1+%3D+1+AND+_full_text+%40%40+query
		// https://data.qld.gov.au/api/action/datastore_search_sql?sql=SELECT+*+FROM+%2281d78d4f-0cad-4145-9fe6-43526036cabf,plainto_tsquery(+%27english%27,+%27Brisbane%27+)+query%22+WHERE+1=1+AND+_full_text+@@+query
		if ( args.fullText ) {
			from.push( 'plainto_tsquery( \'english\', \'' + args.fullText + '\' ) query' );
			where.push( '_full_text @@ query' );
		}

		// where clause
		if ( where.length > 0 ) {
			where = where.join( ' AND ' );
		} else {
			where = '1=1';
		}

		angular.extend( params, {
			sql: 'SELECT * FROM ' + from.join( ',' ) + ' WHERE ' + where
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