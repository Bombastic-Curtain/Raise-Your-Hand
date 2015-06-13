angular.module('queup.student_list', [])

// Student List Controller
// -----------------------

// Shows all students enrolled in the current class
.controller('Student_listController', function($scope, queupFactory, $state, teacherData){
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

});


