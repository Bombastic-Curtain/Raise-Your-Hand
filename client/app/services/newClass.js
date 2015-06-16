// New Class Factory
// --------------------
angular.module('queup.newClass', [])

.factory('queupFactory', function($http, $rootScope){

  // Change server URL when setting up for deployment
  $rootScope.serverURL = 'http://q-up.io'; //'http://localhost:8000'; // 

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
