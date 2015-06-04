angular.module('queup', [
  'queup.factory',
  'socket.io',
  'queup.sinch',
  'queup.auth',
  'queup.before',
  'queup.class_info',
  'queup.class_list',
  'queup.new_class',
  'queup.in_session',
  'queup.queue_list',
  'queup.student_list',
  'queup.class_settings',
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
      }
    })
    .state('q.before_session', {
      url: '/before_session', 
      views: {
        'nav': {
          templateUrl: 'before_session/before_session.html',
          controller: 'Before_sessionController',
        }
      },
    })
    .state('q.before_session.class_info', {
      url: '/class_info',
      views: {
        'sub': {
          templateUrl: 'before_session/class_info.html',
          controller: 'Class_infoController',
        }
      },
    })
    .state('q.before_session.class_list', {
      url: '/class_list',
      views: {
        'sub': {
          templateUrl: 'before_session/class_list.html',
          controller: 'Class_listController'
        }
      }, 
    })
    .state('q.before_session.new_class', {
      url: '/new_class',
      views: {
        'sub': {
          templateUrl: 'before_session/new_class.html',
          controller: 'New_classController'
        }
      },
    })
    .state('q.in_session', {
      url: '/in_session',
      views: {
        'nav': {
          templateUrl: 'in_session/in_session.html',
          controller: 'In_sessionController'
        }
      },
    })
    .state('q.in_session.queue_list', {
      url: '/queue_list',
      views: {
        'sub': {
          templateUrl: 'in_session/queue_list.html',
          controller: 'Queue_listController'
        }
      },
    })
    .state('q.in_session.student_list', {
      url: '/student_list',
      views: {
        'sub': {
          templateUrl: 'in_session/student_list.html',
          controller: 'Student_listController'
        }
      },
    })
    .state('q.in_session.class_settings', {
      url: '/class_settings',
      views: {
        'sub': {
          templateUrl: 'in_session/class_settings.html',
          controller: 'Class_settingsController'
        }
      },
    })

  $urlRouterProvider.otherwise('/signin');
})
