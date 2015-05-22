angular.module('queup.factory', [])

.factory('queupFactory', function($http){

  var addNewClass = function(newClassName){
    console.log(newClassName)
    var token = window.localStorage.getItem('clientToken');

    return $http({
      method: 'POST',
      url: 'http://localhost:8000/api/teachers/addClass',
      headers: {
        user_role: 'teacher',
        access_token: token
      },
      dataType: 'JSON',
      data:{
        classTitle: newClassName
      }
    })
    .success(function(data){
      console.dir('success data below:');
      console.dir(data);
    })
    .error(function(data){
      console.dir('error data below:');
      console.dir(data);
    })
  }

  return {
    addNewClass: addNewClass
  }
});

