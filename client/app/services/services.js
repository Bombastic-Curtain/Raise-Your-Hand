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
  };

  var teacherGetClassList = function(){
    var token = window.localStorage.getItem('clientToken');
    // return new Promise(function(resolve, reject) {
      return $http({
        method: 'GET',
        url: 'http://localhost:8000/api/teachers/getClassList',
        headers: {
          user_role: 'teacher',
          access_token: token
        }
      })
  };

  var teacherGetStudentList = function(class_ID){
    console.log("class_ID value inside services: ", class_ID);

    var token = window.localStorage.getItem('clientToken');

    return $http({
      method: 'GET',
      url: 'http://localhost:8000/api/teachers/getStudentList?classid='+ class_ID,
      headers: {
        user_role: 'teacher',
        access_token: token
      }
    })
  };

  return {
    addNewClass: addNewClass,
    teacherGetClassList: teacherGetClassList,
    teacherGetStudentList: teacherGetStudentList
  }
});

