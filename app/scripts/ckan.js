/*global $*/
angular.module( 'ckanApi', [] )


// SQL request
// http://docs.ckan.org/en/latest/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search_sql
.factory( 'datastoreSearchSQL', [ '$interpolate', '$http', '$q',
function(                          $interpolate ,  $http,   $q ) {

	return function( args ) {
		var params = {};
		var defer = $q.defer();
		var select = [ '*' ];
		var from = [];
		var where = [];
		var order = [];
		var distance;

		// dataset UUID format check
		// http://stackoverflow.com/questions/19989481/how-to-determine-if-a-string-is-a-valid-v4-uuid
		if ( /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i.test( args.resourceId )) {
			from.push( '"' + args.resourceId + '"' );
		} else {
			defer.reject( 'Invalid resource ID: ' + args.resourceId );
			return defer.promise;
		}

		// hardcode data.qld.gov.au (production) unless staging is specified
		if ( args.ckanServer !== 'staging.data.qld.gov.au' ) {
			args.ckanServer = 'data.qld.gov.au';
		}

		// full text searching
		if ( args.fullText ) {
			from.push( 'plainto_tsquery( \'english\', \'' + args.fullText + '\' ) query' );
			where.push( '_full_text @@ query' );
		}

		// geo searching
		if ( args.latitude && args.longitude ) {
			distance = $interpolate( '(3959*acos(cos(radians({{ latitude }}))*cos(radians("Latitude"))*cos(radians("Longitude")-radians({{ longitude }}))+sin(radians({{ latitude }}))*sin(radians("Latitude"))))' )( args );
			select.push( distance + ' AS "Distance"' );
			where.push( distance + ' <= ' + args.distance );
			order.push( '"Distance"' );
		}

		// filtering by column values
		if ( args.filter ) {
			var filter = $.map( args.filter, function( value, key ) {
				return value === '' ? null : $interpolate( 'upper("{{ key }}") LIKE upper(\'%{{ value }}%\')' )({
					key: key,
					value: value
				});
			});
			if ( filter.length ) {
				where = where.concat( filter );
			}
		}

		// where clause
		if ( where.length === 0 ) {
			where = [ '1=1' ];
		}

		angular.extend( params, {
			sql: $interpolate( 'SELECT {{ select }} FROM {{ from }} WHERE {{ where }}{{order}}' )({
				select: select.join( ',' ),
				from: from.join( ',' ),
				where: where.join( ' AND ' ),
				order: order.length ? ' ORDER BY ' + order.join( ',' ) : ''
			}),
			callback: 'JSON_CALLBACK'
		});

		$http.jsonp( 'https://' + args.ckanServer + '/api/action/datastore_search_sql', {
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