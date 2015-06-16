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
