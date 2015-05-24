angular.module('queup.class_list', [])

.controller('Class_listController', function($rootScope, $scope, queupFactory, $state){
  queupFactory.teacherGetClassList().success(function(data) { 
    console.log(data);
    
    $rootScope.classes = [];

    data.forEach(function(value){
      $rootScope.classes.push(
        {
          className: value.name,
          classID: value.classID
        }
      );
    });
    
    $scope.classList = data;
  });

  $scope.handleClick = function(classObj){
    console.log('classObj: ', classObj);

    $rootScope.currentClass = classObj;

    $state.go('before_session.class_info')
  }

});
