angular.module('queup.class_info', [])

.controller('Class_infoController', function($rootScope, $scope, $state,$stateParams, teacherData){
  //console.dir($stateParams, "::stateParams")

  //console.log('rootscope.current class: ', $rootScope.currentClass)
  var currentClass = teacherData.get('currentClass');
  $scope.className = currentClass.name;
  $scope.classID = currentClass.classID;
  console.log('currentClass:', currentClass)
});

// todo: add remove class functionality
