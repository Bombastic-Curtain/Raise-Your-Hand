angular.module('queup.factory', [])

.factory('queupFactory', function($http, $rootScope){

  $rootScope.serverURL = 'http://localhost:8000'; // 'http://queup.io';

  var addNewClass = function(newClassName){
    console.log(newClassName)
    var token = window.localStorage.getItem('clientToken');
    console.log(token,"TOKEN");
    return $http({
      method: 'POST',
      url: $rootScope.serverURL + '/api/teachers/addClass',
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
      console.dir('add new class: success data below:');
      console.dir(data);
      return data;
    })
    .error(function(data){
      console.dir('error data below:');
      console.dir(data);
    })
  };

  return {
    addNewClass: addNewClass,
  }
})
