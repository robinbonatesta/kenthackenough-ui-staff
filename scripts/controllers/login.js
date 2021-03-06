angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/login', {
      templateUrl: '/views/login.html',
      controller: 'StaffLoginCtrl'
    });
  }])
  .controller('StaffLoginCtrl', ['User', '$location', function (User, $location) {

    var self = this;
    var user = new User();

    self.login = function () {
      user.login({
        email: self.user.email,
        password: self.user.password
      }).
      success(function (data) {
        user.setMe(data);
        $location.path('/');
      }).
      error(function (data) {
        if (data) {
          self.errors = data.errors || ['An internal error has occurred'];
        }
      });
    };

  }]);
