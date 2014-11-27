/*global $*/
angular.module( 'ckanApi', [] )


// SQL request
// http://docs.ckan.org/en/latest/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search_sql
.factory( 'datastoreSearchSQL', [ '$http', '$q',
function(                          $http,   $q ) {

	return function( args ) {
		var params = {};
		var defer = $q.defer();
		var select = [ '*' ];
		var from = [];
		var where = [];
		var distance;

		// dataset UUID format check
		// http://stackoverflow.com/questions/19989481/how-to-determine-if-a-string-is-a-valid-v4-uuid
		if ( /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/.test( args.resourceId )) {
			from.push( '"' + args.resourceId + '"' );
		} else {
			defer.reject( 'Invalid resource ID: ' + args.resourceId );
			return defer.promise;
		}

		// full text searching
		if ( args.fullText ) {
			from.push( 'plainto_tsquery( \'english\', \'' + args.fullText + '\' ) query' );
			where.push( '_full_text @@ query' );
		}

		// geo searching
		if ( args.latitude && args.longitude ) {
			distance = '(3959*acos(cos(radians(' + args.latitude + '))*cos(radians("Latitude"))*cos(radians("Longitude")-radians(' + args.longitude + '))+sin(radians(' + args.latitude + '))*sin(radians("Latitude"))))';
			select.push( distance + ' AS "Distance"' );
			where.push( distance + ' <= ' + args.distance );
		}

		// filtering by column values
		if ( args.filter ) {
			var filter = $.map( args.filter, function( value, key ) {
				return value === '' ? null : 'upper("' + key + '") LIKE upper(\'%' + value + '%\')';
			});
			if ( filter.length ) {
				where.push( filter );
			}
		}

		// where clause
		if ( where.length > 0 ) {
			where = where.join( ' AND ' );
		} else {
			where = '1=1';
		}

		angular.extend( params, {
			sql: 'SELECT ' + select.join( ',' ) + ' FROM ' + from.join( ',' ) + ' WHERE ' + where,
			callback: 'JSON_CALLBACK'
		});
		// console.log( params.sql );

		$http.jsonp( 'https://data.qld.gov.au/api/action/datastore_search_sql', {
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
.factory( 'ckan', [ 'datastoreSearchSQL',
function(            datastoreSearchSQL ) {

	return ({
		'datastoreSearchSQL': datastoreSearchSQL
	});
}])
;