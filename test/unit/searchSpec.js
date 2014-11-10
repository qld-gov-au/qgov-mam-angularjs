describe( 'Controller: search', function() {

	beforeEach( module( 'searchView' ));

	it( 'should test the homePages controller', inject(function( $controller, $rootScope ) {
		var ctrl = $controller( 'SearchController', {
			$scope: $rootScope
		});
		expect( ctrl.vm.pageTitle.length ).toBeGreaterThan( 0 );
	}));

	// it('should properly provide a welcome message', inject(function(welcomeMessage) {
	//   expect(welcomeMessage()).toMatch(/welcome/i);
	// }));

});
