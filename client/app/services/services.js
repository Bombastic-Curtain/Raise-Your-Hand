angular.module('queup.factory', [])

.factory('queupFactory', function($http, $rootScope){

  $rootScope.serverURL = 'http://localhost:8000' ; // 'http://queup.io'

  var addNewClass = function(newClassName){
    console.log(newClassName)
    var token = window.localStorage.getItem('clientToken');

    return $http({
      method: 'POST',
      url: $rootScope.serverURL + '/api/teachers/addClass',
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
        url: $rootScope.serverURL + '/api/teachers/getClassList',
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
      url: $rootScope.serverURL + '/api/teachers/getStudentList?classid='+ class_ID,
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
})

.factory('teacherData', function($http, queupFactory) {
  // private data for teacher information (name, email, classes, etc.)
  var _data = {
    name: null,
    email: null,
    fbPicture: null,
    classes: [],
    currentClass: {id: null, name: null},
    loaded: false,
    loading: false
  };

  return {

    set: function(key, value) {
      _data[key] = value;
    },

    get: function(key) {
      var dataCopy;
      // if a key is supplied, return that value
      // if no argument supplied, just return a deep copy of all teacher data
      if(key) {
        // if value is an array, make a deep copy, otherwise make simple copy
        if(Array.isArray(_data[key])) {
          dataCopy = angular.copy(_data[key]);
        } else {
          dataCopy = _data[key];
        }
      } else {
        dataCopy = angular.copy(_data);
      }

      return dataCopy;
    },

    update: function() {
      var token = window.localStorage.getItem('clientToken');
      _data.loading = true;
      
      return $http({
        method: 'GET',
        url: 'http://localhost:8000/api/teachers/getTeacherData',
        headers: {
          user_role: 'teacher',
          access_token: token
        }
      })
      .success(function(data) {
        _data.name = data.name;
        _data.email = data.email;
        _data.fbPicture = data.fbPicture;
        _data.classes = data.classes;
        _data.loaded = true;
        _data.loading = false;
        console.log('successfully loaded teacherData', _data);
      })
      .error(function(data, status) {
        console.log('error in teacherData.update function')
        _data.loading = false;
      })
    }
  }
})

.factory('queueList', function(socket) {
  socket.on('studentRaisedHand', function(data) {
    console.log('received student hand raise', data);
  })
});

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

