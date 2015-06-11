angular.module('queup.in_session', [])

.controller('In_sessionController', function($rootScope, $scope, teacherData){
  $scope.currentClassname = teacherData.get('currentClass').name;

  $scope.classes = teacherData.get('classes');

  if($rootScope.queue !== undefined) {
    $scope.numberOfQuestions = $rootScope.queue.length
  } else {
    $scope.numberOfQuestions = 0;
  }

  $scope.numberOfClasses = $scope.classes.length;

  console.log($scope.classes)

  $scope.studentsInClass = 0

  for(var i = 0; i < $scope.classes.length; i++) {
    if($scope.classes[i].name === $scope.currentClassname) {
      $scope.studentsInClass += $scope.classes[i].students.length
    }
  } 

});
