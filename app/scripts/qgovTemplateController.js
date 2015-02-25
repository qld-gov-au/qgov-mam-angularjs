angular.module( 'qgov', [] )

.controller( 'QgovTemplateController', function( $scope ) {
	// view model
	var swe = {};

	swe.pageTitle = 'Hello world';
	swe.franchiseName = 'Transport and motoring';
	swe.franchisePath = 'transport';

	$scope.swe = swe;
})

.directive( 'qgovList', function() {
	return {
		restrict: 'A',
		scope: { value: '=' },
		template: '<ul ng-if="list.length"><li ng-repeat="item in list">{{ item }}</li></ul><span ng-if="!list.length">{{ value }}</span>',
		link: function( scope ) {
			scope.list = scope.value.split( /;\s*/ );
		}
	};
});
