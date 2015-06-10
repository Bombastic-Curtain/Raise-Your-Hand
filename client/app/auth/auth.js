angular.module('queup.auth', [])

.controller('AuthController', function($scope, $state, teacherData, auth, $window){

  $scope.logout =  function(){
    FB.logout();
    auth.loggedIn = false;
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
