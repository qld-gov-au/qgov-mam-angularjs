angular.module('qgovMam', ['ngRoute', 'app.homePages'])

  .constant('TPL_PATH', '/templates')

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/',{
      controller : 'HomeCtrl',
      controllerAs: 'vm',
      templateUrl : TPL_PATH + '/home.html'
    });
  });
