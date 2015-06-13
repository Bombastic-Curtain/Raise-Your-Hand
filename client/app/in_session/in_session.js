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
