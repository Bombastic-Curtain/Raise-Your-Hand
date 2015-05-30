angular.module('queup.class_list', [])

.controller('Class_listController', function($scope, queupFactory, $state, teacherData){
  $scope.classes = teacherData.get('classes');
  console.log('*** classes data **', $scope.classes)

  // If teacher has no classes, set variables to show No Classes div
  $scope.hasClasses = ($scope.classes.length>0) ? true : false ;
  $scope.noClasses = !$scope.hasClasses;

  $scope.handleClick = function(classObj){
    console.log('classObj: ', classObj);
    teacherData.set('currentClass', classObj);

    $state.go('q.in_session.student_list')
  }

});
