// Teacher Data Factory
// ------------------------
angular.module('queup.teacher', [])

.factory('teacherData', function($http, queupFactory, $rootScope, $q) {
  // private data for teacher information (name, email, classes, etc.)
  var _data = {
    name: null,
    email: null,
    fbPicture: null,
    classes: [],
    currentClass: {id: null, name: null},
    loaded: false,
    loading: false
  };

  return {

    set: function(key, value) {
      _data[key] = value;
    },

    get: function(key) {
      var dataCopy;
      // if a key is supplied, return that value
      // if no argument supplied, just return a deep copy of all teacher data
      if(key) {
        // if value is an array, make a deep copy, otherwise make simple copy
        if(Array.isArray(_data[key]) || typeof _data[key] === 'object') {
          dataCopy = angular.copy(_data[key]);
        } else {
          dataCopy = _data[key];
        }
      } else {
        dataCopy = angular.copy(_data);
      }

      return dataCopy;
    },
    
    update: function(caller) {
      var token = window.localStorage.getItem('clientToken');

      var deferred = $q.defer();

      if(_data.loading === false) {
        _data.loading = deferred.promise;
        console.log('making get request thanks to:', caller)
        return $http({
          method: 'GET',
          url: $rootScope.serverURL + '/api/teachers/getTeacherData',
          headers: {
            user_role: 'teacher',
            access_token: token
          }
        })
        .success(function(data) {
          _data.name = data.name;
          _data.email = data.email;
          _data.fbPicture = data.fbPicture;
          _data.classes = data.classes;
          _data.loaded = true;
          deferred.resolve('loaded teacher data');
          _data.loading = false;
          console.log('successfully loaded teacherData', _data);
        })
        .error(function(data, status) {
          console.log('error in teacherData.update function');
          _data.loading.reject('failure to load teacher data');
          _data.loading = false;
        })
      } else {
        return _data.loading;
      }
    }
  }
})
