angular.module('queup.new_class', [])

// Create Class Controller
// -----------------------

// Allows professor to create a new class
.controller('New_classController', function($scope, $http, queupFactory, $state, teacherData){

  // Adds the newly created class to the teacher database
  $scope.addNewClass = function(newClassName){
    queupFactory.addNewClass(newClassName)
                .then(function(data){
                  console.log("data returning back to new class.js: ");
                  console.dir(data);
                  teacherData.update().then(function() {
                    $state.go('q.before_session.class_list');
                  })
    })
  };

});

