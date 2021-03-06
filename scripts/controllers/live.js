angular
  .module('khe')
  .config(['$routeProvider', function ($router) {
    $router.when('/live', {
      templateUrl: '/views/live.html',
      controller: 'LiveCtrl'
    });
  }])
  .controller('LiveCtrl', ['User', 'Message', 'Socket', function (User, Message, Socket) {

    var self = this;
    var user = new User();
    var message = new Message();

    self.me = user.getMe();
    self.messages = [];

    // Get an initial list of messages
    function get() {
      message.list().
      success(function (data) {
        self.messages = data.messages;
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error has occurred'];
      });
    }
    get();

    // Create a new message
    self.new = {};
    self.create = function () {
      message.create(self.new.text).
      success(function (data) {
        self.new = {};
      }).
      error(function (data) {
        self.errors = data.errors || ['An internal error had occurred'];
      });
    };

    // Delete a message
    self.delete = function (m) {
      message.delete(m._id).
      error(function (data) {
        self.errors = data.errors || ['An internal error has occurred'];
      });
    };

    // Watch for new messages
    Socket.on('POST /messages', function (message) {
      self.messages.push(message);
    });

    // Watch for message deletions
    Socket.on('DELETE /messages/:id', function (id) {
      for (var i = 0; i < self.messages.length; i++) {
        if (self.messages[i]._id == id) {
          self.messages.splice(i, 1);
          break;
        }
      }
    });

  }]);
