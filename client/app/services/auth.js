angular.module('queup.auth', [])

.factory('auth', function($q) {
  var auth = {};
  auth.init = false;

  // if(!auth.init) {
  //   FB.init({
  //    appId      : '718396624937121', // '1425134197808858' localhost
  //    cookie     : true,  // enable cookies to allow the server to access the session
  //    xfbml      : true,  // parse social plugins on this page
  //    version    : 'v2.3' // use version 2.2
  //   });
  //   auth.init = true;
  // }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
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

  auth.apiCall = function() {
    FB.api('/me', function(response) {
        console.log(JSON.stringify(response));
    });
  };

  return auth;
})
