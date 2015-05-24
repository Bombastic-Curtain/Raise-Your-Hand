angular.module('queup.student_list', [])

.controller('Student_listController', function($rootScope, $scope, queupFactory, $state){
  console.log('******* In student list controller, rootscope current class: ', $rootScope.currentClass)
  
  queupFactory.teacherGetStudentList($rootScope.currentClass.classID)
  .success(function(data) { 
    console.log(data);

    var students = [];

    data.forEach(function(value){
      students.push(value);
    });
    
    $scope.studentList = students;
  })
  .error(function(err){
    console.log('error', err)
  });

  $scope.handleClick = function(student){

  }


});