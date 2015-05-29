angular.module('queup.in_session', [])

.controller('In_sessionController', function($scope, teacherData){
  $scope.currentClassname = teacherData.get('currentClass').name;

});
