angular.module('queup.student_list', [])

.controller('Student_listController', function($scope, queupFactory, $state, teacherData){
  console.log('******* In student list controller *****')
  
  var currentClass = teacherData.get('currentClass');
  var classes = teacherData.get('classes');
  $scope.students = [];

  classes.forEach(function(thisClass) {
    if(thisClass.classID === currentClass.classID) {
      $scope.students = thisClass.assignedStudentsName;
    }
  });

  $scope.handleClick = function(student){

  }


});