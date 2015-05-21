var defaultNav = { templateUrl: 'navbar.html',
                   controller: function() {},
                   controllerAs: 'navBar'};


  angular.module('queup', [
  'queup.factory',
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
    .state('signup', {
      url: '/signup',
      views: {
        'nav': defaultNav,
        'body': {
          templateUrl: 'app/auth/signup.html',
          controller: 'AuthController'}
      }
      
    })
    .state('signin', {
      url: '/signin',
      views: {
        'nav': defaultNav,
        'body': {
          templateUrl: 'app/auth/signin.html',
          controller: 'AuthController'
        }
      }
    })
    .state('before_session', {
      url: '/before_session',
      views: {
        'nav': defaultNav,
        'body': {
          templateUrl: 'app/before_session/before_session.html',
          controller: 'Before_sessionController'
        }
      },
    })
    .state('before_session.class_info', {
      url: '/class_info',
      views: {
        'nav': defaultNav,
        'body': {
          templateUrl: 'app/before_session/class_info.html',
          controller: 'Class_infoController'
        }
      },
    })
    .state('before_session.class_list', {
      url: '/class_list',
      views: {
        'nav': defaultNav,
        'body': {
          templateUrl: 'app/before_session/class_list.html',
          controller: 'Class_listController'
        }
      }, 
    })
    .state('before_session.new_class', {
      url: '/new_class',
      views: {
        'nav': defaultNav,
        'body': {
          templateUrl: 'app/before_session/new_class.html',
          controller: 'New_classController'
        }
      },
    })
    .state('in_session', {
      url: '/in_session',
      views: {
        'nav': defaultNav,
        'body': {
          templateUrl: 'app/in_session/in_session.html',
          controller: 'In_sessionController'
        }
      },
    })
    .state('in_session.queue_list', {
      url: '/queue_list',
      views: {
        'nav': defaultNav,
        'body': {
          templateUrl: 'app/in_session/queue_list.html',
          controller: 'Queue_listController'
        }
      },
    })
    .state('in_session.student_list', {
      url: '/student_list',
      views: {
        'nav': defaultNav,
        'body': {
          templateUrl: 'app/in_session/student_list.html',
          controller: 'Student_listController'
        }
      },
    })
    .state('in_session.class_settings', {
      url: '/class_settings',
      views: {
        'nav': defaultNav,
        'body': {
          templateUrl: 'app/in_session/class_settings.html',
          controller: 'Class_settingsController'
        }
      },
    })

  $urlRouterProvider.otherwise('/signin');
})
