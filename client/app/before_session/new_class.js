angular.module('queup.new_class', [])

.controller('New_classController', function($scope, $http, queupFactory){

  $scope.addNewClass = function(newClassName){

    queupFactory.addNewClass(newClassName).then(function(data){
      console.log("data returning back to new class.js: ");
      console.dir(data);
    })
  };

});

