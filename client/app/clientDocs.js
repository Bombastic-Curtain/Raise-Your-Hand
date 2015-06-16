// Routing and Configuration
// -------------------------
angular.module('queup', [
  'queup.newClass',
  'queup.teacher',
  'queup.auth',
  'socket.io',
  'queup.sinch',
  'queup.auth',
  'queup.before',
  'queup.class_list',
  'queup.new_class',
  'queup.in_session',
  'queup.queue_list',
  'queup.student_list',
  'ui.router'
])
.config(function($stateProvider, $urlRouterProvider){
  
  $stateProvider
    .state('signin', {
      url: '/signin',
      views: {
        'main': {
          templateUrl: 'auth/signin.html',
          controller: 'AuthController'
        }
      }
    })
    .state('q', {
      url:"/q",
      views: {
        'main': {
          templateUrl: "nav.html",
          controller: 'AuthController'
        }
      },
      resolve: {
        authenticate: function(auth) {
          console.log('calling auth.checkLoginState')
          return auth.checkLoginState();
        },
        dataLoaded: function(teacherData) {
          console.log('is this also promise?', teacherData.get('loading'));
          return teacherData.update('resolve');
        }
      }
    })
    .state('q.before_session', {
      url: '/before_session', 
      views: {
        'nav': {
          templateUrl: 'before_session/before_session.html',
          controller: 'Before_sessionController',
        }
      }
    })
    .state('q.before_session.class_info', {
      url: '/class_info',
      views: {
        'sub': {
          templateUrl: 'before_session/class_info.html',
          controller: 'Class_infoController',
        }
      }
    })
    .state('q.before_session.class_list', {
      url: '/class_list',
      views: {
        'sub': {
          templateUrl: 'before_session/class_list.html',
          controller: 'Class_listController'
        }
      }
    })
    .state('q.before_session.new_class', {
      url: '/new_class',
      views: {
        'sub': {
          templateUrl: 'before_session/new_class.html',
          controller: 'New_classController'
        }
      }
    })
    .state('q.in_session', {
      url: '/in_session',
      views: {
        'nav': {
          templateUrl: 'in_session/in_session.html',
          controller: 'In_sessionController'
        }
      }
    })
    .state('q.in_session.queue_list', {
      url: '/queue_list',
      views: {
        'sub': {
          templateUrl: 'in_session/queue_list.html',
          controller: 'Queue_listController'
        }
      }
    })
    .state('q.in_session.student_list', {
      url: '/student_list',
      views: {
        'sub': {
          templateUrl: 'in_session/student_list.html',
          controller: 'Student_listController'
        }
      }
    })
    .state('q.in_session.class_settings', {
      url: '/class_settings',
      views: {
        'sub': {
          templateUrl: 'in_session/class_settings.html',
          controller: 'Class_settingsController'
        }
      }
    })

  $urlRouterProvider.otherwise('/signin');
})
.run(function ($rootScope, $state) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    console.log('there has been error!', event, toState, toParams, fromState, fromParams, error)
    // Redirect to login page
    $state.go('signin');
  });

})


.run(function($rootScope, $window, teacherData, auth, $state) {

  // This is called with the results from FB.getLoginStatus().
  $window.statusChangeCallback = function (response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      //auth.testAPI();
      var access_token =   FB.getAuthResponse()['accessToken'];
      $window.localStorage.setItem( 'clientToken', access_token);

      if(teacherData.get('loaded')) {
        $state.go('q.before_session.class_list');
      } else {
        // Load teacher data into teacherData service, then go to Class List state
        teacherData.update('FB').then(function() {
          //$scope.dataLoaded = teacherData.get('loaded')
        }).then(function(){
          //auth.loggedIn = true;
          $state.go('q.before_session.class_list')
        });
      }
      

    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
    }
  }

  // This function is called when someone finishes with the Login Button.
  $window.checkLoginState = function checkLoginState() {

    FB.getLoginStatus(function(response) {
      $window.statusChangeCallback(response);
    });
  }

  $window.fbAsyncInit = function() {

    console.log('FB calling FB.getLoginStatus')
    FB.getLoginStatus(function(response) {
     $window.statusChangeCallback(response);
    });

  };
});
angular.module('queup.auth', [])
// Sign-in Controller
// __________________
     
// Provides login and logout interface for Facebook authorization
.controller('AuthController', function($scope, $state, teacherData, auth, $window){

  $scope.logout =  function(){
    FB.logout();
    $state.go('signin');
  }

  $scope.login = function() {
    FB.login(function(response) {
      $window.statusChangeCallback(response);
    });
  }

  $scope.teacherName = '';
  $scope.teacherPic = '';

  if(teacherData.get('loaded')) {
    $scope.teacherName = teacherData.get('name');
    $scope.teacherPic = teacherData.get('fbPicture');
  }

});
// Sign-in Factory
// --------------
angular.module('queup.auth', [])
.factory('auth', function($q) {
  var auth = {};
  auth.init = false;

  auth.checkLoginState = function () {
    var deferred = $q.defer();
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected') {
        console.log('facebook says you be logged in');
        deferred.resolve('Logged In');
      } else {
        console.log('facebook say you not logged in');
        deferred.reject(response.status)
      }
    });
    return deferred.promise;
  };

  return auth;
})
// New Class Factory
// --------------------
angular.module('queup.newClass', [])

.factory('queupFactory', function($http, $rootScope){

  // Change server URL when setting up for deployment
  $rootScope.serverURL = 'http://localhost:8000'; // 'http://queup.io';

  var addNewClass = function(newClassName){
    console.log(newClassName)
    var token = window.localStorage.getItem('clientToken');
    console.log(token,"TOKEN");
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
      console.dir('add new class: success data below:');
      console.dir(data);
      return data;
    })
    .error(function(data){
      console.dir('error data below:');
      console.dir(data);
    })
  };

  return {
    addNewClass: addNewClass,
  }
})
angular.module('queup.factory', [])

.factory('queupFactory', function($http, $rootScope){

  $rootScope.serverURL = 'http://localhost:8000'; // 'http://queup.io';

  var addNewClass = function(newClassName){
    console.log(newClassName)
    var token = window.localStorage.getItem('clientToken');
    console.log(token,"TOKEN");
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
      console.dir('add new class: success data below:');
      console.dir(data);
      return data;
    })
    .error(function(data){
      console.dir('error data below:');
      console.dir(data);
    })
  };

  return {
    addNewClass: addNewClass,
  }
})

// Sinch WebRTC Factory
// ---------------------
angular.module('queup.sinch', ['queup.newClass'])

.factory('sinch', function(teacherData){

  var sinchClient = new SinchClient({
    applicationKey: 'ccdeeb0b-5733-4bcb-9f44-4b2a7a70dbfe',
    capabilities: {calling: true},
    // This is required if application is to receive calls / instant messages.
    startActiveConnection: true,
    // For additional loging, please uncomment the three rows below
    onLogMessage: function(message) {
      console.log(message);
    },
  });

  var signUpObj = {
    username: teacherData.get('email'),
    password: teacherData.get('email')
  }

  // Sign in with the professor's email, and
  // if the professor doesn't have a Sinch WebRTC account, create one for the professor.
  sinchClient.newUser(signUpObj).then(function(ticket){
    sinchClient.start(ticket);
    console.log('******sinch client ticket started******')
  }).fail(function(error){
    console.log('******* user may already exist, logging in with existing email *******');
  
    sinchClient.start(signUpObj)
      .then(function(){
        console.log('********** sinchClient signed up and logged in ********');
      })
      .fail(function(error){
        console.log('********** sinch failed to log in: *******', error)
      })
  });


  return {
    call: function(userID) {
      var callListeners = {
        onCallEstablished: function(currentCall) {
          $('audio').attr('src', currentCall.incomingStreamURL);
          currentCall.mute();
          console.log("******call established*******");
        }
      };
      
      var callClient = sinchClient.getCallClient();
      var newCall = callClient.callUser(userID);
      newCall.addEventListener(callListeners);
    }
  }  

})
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
// Teacher Data Factory
// ------------------------
angular.module('queup.teacher', [])

.factory('teacherData', function($http, queupFactory, $rootScope, $q) {
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
        if(Array.isArray(_data[key]) || typeof _data[key] === 'object') {
          dataCopy = angular.copy(_data[key]);
        } else {
          dataCopy = _data[key];
        }
      } else {
        dataCopy = angular.copy(_data);
      }

      return dataCopy;
    },
    
    update: function(caller) {
      var token = window.localStorage.getItem('clientToken');

      var deferred = $q.defer();

      if(_data.loading === false) {
        _data.loading = deferred.promise;
        console.log('making get request thanks to:', caller)
        return $http({
          method: 'GET',
          url: $rootScope.serverURL + '/api/teachers/getTeacherData',
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
          deferred.resolve('loaded teacher data');
          _data.loading = false;
          console.log('successfully loaded teacherData', _data);
        })
        .error(function(data, status) {
          console.log('error in teacherData.update function');
          _data.loading.reject('failure to load teacher data');
          _data.loading = false;
        })
      } else {
        return _data.loading;
      }
    }
  }
})
angular.module('queup.before', [])

.controller('Before_sessionController', function(){


});
angular.module('queup.class_list', [])

// Class List Controller
// ---------------------

// Provides a list of all classes this professor is teaching
.controller('Class_listController', function($scope, queupFactory, $state, teacherData){
  $scope.classes = teacherData.get('classes');
  $scope.numberOfClasses = $scope.classes.length;
  $scope.numberOfParticipants = 0;

  for(var i = 0; i < $scope.classes.length; i++) {
    $scope.numberOfParticipants += $scope.classes[i].students.length;
  } 

  // If teacher has no classes, set variables to show No Classes div
  $scope.hasClasses = ($scope.classes.length>0) ? true : false ;
  $scope.noClasses = !$scope.hasClasses;

  $scope.handleClick = function(classObj){
    teacherData.set('currentClass', classObj);
    $state.go('q.in_session.student_list')
  }

});
angular.module('queup.new_class', [])

// Create Class Controller
// -----------------------

// Allows professor to create a new class
.controller('New_classController', function($scope, $http, queupFactory, $state, teacherData){

  // Adds the newly created class to the teacher database
  $scope.addNewClass = function(newClassName){
    queupFactory.addNewClass(newClassName)
                .then(function(data){
                  console.log("data returning back to new class.js: ");
                  console.dir(data);
                  teacherData.update().then(function() {
                    $state.go('q.before_session.class_list');
                  })
    })
  };

});

angular.module('queup.in_session', [])

// In-Session Class Info Controller
.controller('In_sessionController', function($scope, teacherData){
  $scope.currentClassname = teacherData.get('currentClass').name;
  $scope.classes = teacherData.get('classes');
  $scope.numberOfClasses = $scope.classes.length;
  $scope.studentsInClass = 0;
  for(var i = 0; i < $scope.classes.length; i++) {
    if($scope.classes[i].name === $scope.currentClassname) {
      $scope.studentsInClass += $scope.classes[i].students.length;
    }
  }
});
angular.module('queup.queue_list', [])

// Queue List Controller
// ---------------------

// Monitors current queue state, and manages socket interaction between teacher and server
.controller('Queue_listController', function($state, $scope, socket, teacherData, sinch){

  var currentClass = teacherData.get('currentClass');
  // If there is no current class, redirect to class list 
  // so things don't break due to undefined currentClass
  if( currentClass.id === null) { $state.go('q.before_session.class_list'); return; }

  // Emit event to register class id with socket id on server (for routing socket messages from students to teacher)
  socket.emit('classReady', {classID: currentClass.classID});

  // Get current class info to display, and for sending on server reqs
  $scope.currentClass = {id: currentClass.classID, name: currentClass.name};

  $scope.queue = [];
  $scope.hasQuestions = true;
  $scope.noQuestions = false;

  $scope.modal = {
    name: "",
    fbPicture: "",
    email: "",
    timer: 0
  };
  
  // Call on student, send id and index in the queue so it can be returned/confirmed as received
  $scope.handleClick = function(student, index) {
    $scope.modal = {
      name: student.name,
      fbPicture: student.fbPicture,
      email: student.email,
      timer: student.timer
    };
    
    clearInterval(student.timerID);
    socket.emit('callOnStudent', {email: student.email, index: index, classID: currentClass.classID});

    $('#aModal').modal('show');
    sinch.call(student.email)
  };

  var removeFromQueue = function(student) {
    $scope.queue.splice(student.index,1);

    $('.questions').html($scope.queue.length);

    if($scope.queue.length === 0) {
      $scope.hasQuestions = false;
      $scope.noQuestions = true;
    }
    $('#aModal').modal('hide');
  };


  var addStudentToList = function(data) {
    data.timer = 0;
    data.timerID = setInterval(function ($scope) {
      var self = this
      $scope.$apply(function () {
        self.timer++;
      });
    }.bind(data, $scope), 60000);

    $scope.queue.push(data);
    
    $('.questions').html($scope.queue.length);
    
    // send confirmation to student that they were added to list
    socket.emit('studentAddedToQueue', data)
    $scope.hasQuestions = true;
    $scope.noQuestions = false;
  };

  // Listen for queue updates from server
  socket.on('studentRaisedHand', addStudentToList);

  // If server confims student receieved call, remove from queue
  socket.on('studentConfirmation', removeFromQueue);

  // Ask for queue of current class from server when view gets instantiated
  socket.emit('queueRequest', {classID: $scope.currentClass.classID, data: 'give me the queue'});

  // Remove listeners to avoid memory leak when user leaves view and comes back
  $scope.$on('$destroy', function() {
    socket.off('studentRaisedHand', addStudentToList);
    socket.off('studentReceivedCall', removeFromQueue);
  });

});
angular.module('queup.student_list', [])

// Student List Controller
// -----------------------

// Shows all students enrolled in the current class
.controller('Student_listController', function($scope, queupFactory, $state, teacherData){
  $scope.students = [];
  $scope.noStudents = true;
  $scope.hasStudents = false;

  var currentClass = teacherData.get('currentClass');
  var classes = teacherData.get('classes');
  $scope.className = currentClass.name;

  classes.forEach(function(thisClass) {
    if(thisClass.classID === currentClass.classID) {
      if(currentClass.students.length > 0) {
        $scope.students = currentClass.students;
        $scope.noStudents = false;
        $scope.hasStudents = true;
      }
    }
  });
});
