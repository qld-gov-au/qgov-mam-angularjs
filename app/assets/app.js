angular.module('app.homePages', [])

  .factory('welcomeMessage', function() {
    return function() {
      return 'Welcome Home...';
    };
  })

  .controller('HomeCtrl', function($scope, welcomeMessage) {
    $scope.welcome_message = welcomeMessage();
  });
;angular.module('qgovMam', ['ngRoute', 'app.homePages'])

  .constant('TPL_PATH', '/templates')

  .config(function($routeProvider, TPL_PATH) {
    $routeProvider.when('/',{
      controller : 'HomeCtrl',
      templateUrl : TPL_PATH + '/home.html'
    });
  });
