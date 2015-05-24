angular.module('queup.factory', [])

.factory('queupFactory', function($http){

  var addNewClass = function(newClassName){
    console.log(newClassName)
    var token = window.localStorage.getItem('clientToken');
    
    return $http({
      method: 'POST',
      url: 'http://localhost:8000/api/teachers/addClass',
      headers: {
        user_role: 'teacher',
        access_token: token
      },
      dataType: 'JSON',
      data:{
        classTitle: newClassName
      }
    })
    .success(function(data){
      console.dir('success data below:');
      console.dir(data);
    })
    .error(function(data){
      console.dir('error data below:');
      console.dir(data);
    })
  };

  var teacherGetClassList = function(){
    var token = window.localStorage.getItem('clientToken');
    // return new Promise(function(resolve, reject) {
      return $http({
        method: 'GET',
        url: 'http://localhost:8000/api/teachers/getClassList',
        headers: {
          user_role: 'teacher',
          access_token: token
        }
      })
  };

  var teacherGetStudentList = function(class_ID){
    console.log("class_ID value inside services: ", class_ID);

    var token = window.localStorage.getItem('clientToken');

    return $http({
      method: 'GET',
      url: 'http://localhost:8000/api/teachers/getStudentList?classid='+ class_ID,
      headers: {
        user_role: 'teacher',
        access_token: token
      }
    })
  };

  return {
    addNewClass: addNewClass,
    teacherGetClassList: teacherGetClassList,
    teacherGetStudentList: teacherGetStudentList
  }
});

// Socket Factory
// --------------
angular.module('socket.io', [])
.factory('socket', function($rootScope) {

  // Create connection with server that is within the
  // factory (maintains connection across different views)
  var socketio = io.connect('http://localhost:8000');

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

