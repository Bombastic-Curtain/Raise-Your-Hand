// Sign-in Factory
// --------------
angular.module('queup.auth', [])
.factory('auth', function($q) {
  var auth = {};
  auth.init = false;

  auth.checkLoginState = function () {
    var deferred = $q.defer();
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected') {
        console.log('facebook says you be logged in');
        deferred.resolve('Logged In');
      } else {
        console.log('facebook say you not logged in');
        deferred.reject(response.status)
      }
    });
    return deferred.promise;
  };

  return auth;
})
