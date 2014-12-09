/*global $*/
angular.module( 'mam.detailView', [ 'qgovMam.config' ] )


.config([ '$stateProvider', 'SOURCE',
function(  $stateProvider,   SOURCE ) {
	$stateProvider.state( 'mam.detail', {
		url: '?title',
		controller: 'DetailController',
		controllerAs: 'vm',
		templateUrl: 'detail.html',
		resolve: {
			title: [ '$stateParams', function( $stateParams ) {
				return $stateParams.title;
			}],
			json: [ 'ckan', function( ckan ) {
				return ckan.datastoreSearchSQL({ resourceId: SOURCE.resourceId });
			}]
		}
	});
}])


.controller( 'DetailController', [ 'title', 'qgovMapModel', 'json',
function(                           title,   qgovMapModel,   json ) {

	// view model
	var vm = this;

	var latlng;
	var item = json.result.records.filter(function( item ) {
		return title === $.trim( item.Title ) || title === $.trim( item.Name );
	});

	if ( item.length > 0 ) {
		vm.item = item[ 0 ];
	// } else {
		// error, no match
	}


	if ( vm.item.Latitude && vm.item.Longitude ) {
		latlng = [ parseFloat( vm.item.Latitude ), parseFloat( vm.item.Longitude ) ];

		qgovMapModel.setMarkers([{
			latlng: latlng,
			options: { title: vm.item.Title || vm.item.Name }
		}]);

		qgovMapModel.highlight( latlng );

	} else {
		qgovMapModel.setMarkers( [] );
		qgovMapModel.highlightState();
	}

}]);
