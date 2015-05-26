angular.module('queup.student_list', [])

.controller('Student_listController', function($rootScope, $scope, queupFactory, $state, teacherData){
  console.log('******* In student list controller, rootscope current class: ', $rootScope.currentClass)
  
  var currentClass = teacherData.get('currentClass');
  var classes = teacherData.get('classes');
  $scope.students = [];
  
  classes.forEach(function(class) {
    if(class.classID === currentClass.classID) {
      $scope.students = class.assignedStudentsName;
    }
  });

  $scope.handleClick = function(student){

  }


});