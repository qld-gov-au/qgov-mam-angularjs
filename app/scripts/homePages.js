angular.module('app.homePages', [])

  .factory('welcomeMessage', function() {
    return function() {
      return 'Welcome Home...';
    };
  })

  .controller('HomeCtrl', function() {
    // $scope.welcome_message = welcomeMessage();

    // view model
    var vm = this;

    vm.pageTitle = 'Hello world';
    vm.franchiseName = 'Transport and motoring';
    vm.franchisePath = 'transport';
  });
