// Socket Factory
// --------------
angular.module('socket.io', [])
.factory('socket', function($rootScope, teacherData) {

  // Create connection with server that is within the
  // factory (maintains connection across different views)
  // and send teacher email to associate with socketID on server
  var socketio = io.connect( $rootScope.serverURL );

  // Wrapped socket.IO methods (on, emit, removeListener(s))
  // so that they can be handled correctly within view scopes
  return {
    on: function(event, cb) {
      socketio.on(event, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          cb.apply(socketio,args);
        })
      });
    },

    emit: function(event, data, cb) {
      if(typeof cb === 'function') {
        socketio.emit(event, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            cb.apply(socketio, args);
          })
        })
      } else {
        socketio.emit(event, data);
      }
    },

    off: function(event, cb) {
      if(typeof cb === 'function') {
        socketio.removeListener(event, cb);
      } else {
        socketio.removeAllListeners(event);
      }
    }
  }
});