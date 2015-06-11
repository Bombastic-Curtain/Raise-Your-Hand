angular.module('queup.auth', [])

.controller('AuthController', function($scope, $state, teacherData, auth){

  $scope.logout =  function(){
    FB.logout();
    auth.loggedIn = false;
    $state.go('signin')
  }

  $scope.login = function() {
    FB.login(function(response) {
      statusChangeCallback(response);
    })
  }

  $scope.teacherName = teacherData.get('name');
  $scope.teacherPic = teacherData.get('fbPicture');

  $scope.dataLoaded = false;

    // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {

    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      //testAPI();
      var access_token =   FB.getAuthResponse()['accessToken'];
      window.localStorage.setItem( 'clientToken', access_token);

      // Load teacher data into teacherData service, then go to Class List state
      teacherData.update().then(function() {
        $scope.dataLoaded = teacherData.get('loaded')
      }).then(function(){
        auth.loggedIn = true;
        $state.go('q.before_session.class_list')
      });

    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  window.checkLoginState = function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

 window.fbAsyncInit = function() {
  FB.init({
    appId      : '718396624937121', //1425134197808858'
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.3' // use version 2.2
  });


  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src="https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {


      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }

});
