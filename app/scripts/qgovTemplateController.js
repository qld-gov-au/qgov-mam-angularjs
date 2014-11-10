angular.module( 'qgov', [] )

.controller( 'QgovTemplateController', function( $scope ) {
	// view model
	var swe = {};

	swe.pageTitle = 'Hello world';
	swe.franchiseName = 'Transport and motoring';
	swe.franchisePath = 'transport';

	$scope.swe = swe;
});
