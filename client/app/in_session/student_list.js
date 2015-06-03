angular.module('queup.student_list', [])

.controller('Student_listController', function($scope, queupFactory, $state, teacherData){
  console.log('******* In student list controller *****')
  $scope.students = [];
  $scope.noStudents = true;
  $scope.hasStudents = false;

  var currentClass = teacherData.get('currentClass');
  var classes = teacherData.get('classes');
  $scope.className = currentClass.name;

  classes.forEach(function(thisClass) {
    if(thisClass.classID === currentClass.classID) {
      if(currentClass.students.length > 0) {
        $scope.students = currentClass.students;
        $scope.noStudents = false;
        $scope.hasStudents = true;
      }
    }
  });

  $scope.handleClick = function(student){

  }


});