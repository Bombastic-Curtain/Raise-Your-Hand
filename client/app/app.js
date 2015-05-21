  angular.module('handsy', [
  'handsy.auth',
  'handsy.before',
  'handsy.class_info',
  'handsy.class_list',
  'handsy.new_class',
  'handsy.in_session',
  'handsy.queue_list',
  'handsy.student_list',
  'handsy.class_settings',
  'ui.router'
])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .state('before_session', {
      url: '/before_session',
      templateUrl: 'app/before_session/before_session.html',
      controller: 'Before_sessionController'
    })
    .state('before_session.class_info', {
      url: '/class_info',
      templateUrl: 'app/before_session/class_info.html',
      controller: 'Class_infoController'
    })
    .state('before_session.class_list', {
      url: '/class_list',
      templateUrl: 'app/before_session/class_list.html',
      controller: 'Class_listController'
    })
    .state('before_session.new_class', {
      url: '/new_class',
      templateUrl: 'app/before_session/new_class.html',
      controller: 'New_classController'
    })
    .state('in_session', {
      url: '/in_session',
      templateUrl: 'app/in_session/in_session.html',
      controller: 'In_sessionController'
    })
    .state('in_session.queue_list', {
      url: '/queue_list',
      templateUrl: 'app/in_session/queue_list.html',
      controller: 'Queue_listController'
    })
    .state('in_session.student_list', {
      url: '/student_list',
      templateUrl: 'app/in_session/student_list.html',
      controller: 'Student_listController'
    })
    .state('in_session.class_settings', {
      url: '/class_settings',
      templateUrl: 'app/in_session/class_settings.html',
      controller: 'Class_settingsController'
    })

  $urlRouterProvider.otherwise('/signin');
})
