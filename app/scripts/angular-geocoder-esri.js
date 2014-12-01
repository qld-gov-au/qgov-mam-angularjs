angular.module( 'esri-geocoder', [] )

// ESRI geocoder API
// https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm
.factory( 'geocoder', [ '$http', '$q',
function(                $http ,  $q ) {

	return ({
		// https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm
		'findAddressCandidates': function findAddressCandidates( params ) {
			angular.extend( params, {
				forStorage: false,
				f: 'json'
			});

			var defer = $q.defer();

			$http.get( '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates', {
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
		}
	});
}])
;
