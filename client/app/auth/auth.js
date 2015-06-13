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
