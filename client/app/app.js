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
