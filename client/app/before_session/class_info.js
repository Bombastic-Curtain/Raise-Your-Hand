angular.module('queup.class_info', [])

.controller('Class_infoController', function($rootScope, $scope, $state,$stateParams){
  console.dir($stateParams, "::stateParams")

  console.log('rootscope.current class: ', $rootScope.currentClass)
  $scope.className = $rootScope.currentClass.name;
  $scope.classID = $rootScope.currentClass.classID;
});

// todo: add remove class functionality
