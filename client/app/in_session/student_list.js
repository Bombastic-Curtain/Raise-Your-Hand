angular.module('queup.student_list', [])

.controller('Student_listController', function($scope, queupFactory, $state, teacherData){
  console.log('******* In student list controller *****')
  $scope.students = [];
  teacherData.update().then(function() {
    var currentClass = teacherData.get('currentClass');
    var classes = teacherData.get('classes');

    classes.forEach(function(thisClass) {
      if(thisClass.classID === currentClass.classID) {
        $scope.students = currentClass.students;
      }
    });


  })

  $scope.handleClick = function(student){

  }


});