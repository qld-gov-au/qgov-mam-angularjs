angular.module('qgov', [])

  .controller('TemplateCtrl', function( $scope ) {
    // view model
    var swe = {};

    swe.pageTitle = 'Hello world';
    swe.franchiseName = 'Transport and motoring';
    swe.franchisePath = 'transport';

    $scope.swe = swe;
  });
;angular.module('app.homePages', [])

  .controller('HomeCtrl', function() {
    // view model
    var vm = this;

    vm.pageTitle = 'Hello home page';
  });
;angular.module('qgovMam', ['ngRoute', 'qgov', 'app.homePages'])

  .constant('TPL_PATH', '/templates')

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/',{
      controller : 'HomeCtrl',
      controllerAs: 'vm',
      templateUrl : TPL_PATH + '/home.html'
    });
  });
