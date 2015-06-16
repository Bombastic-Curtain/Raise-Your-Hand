// Sinch WebRTC Factory
// ---------------------
angular.module('queup.sinch', ['queup.newClass'])

.factory('sinch', function(teacherData){

  var sinchClient = new SinchClient({
    applicationKey: 'ccdeeb0b-5733-4bcb-9f44-4b2a7a70dbfe',
    capabilities: {calling: true},
    // This is required if application is to receive calls / instant messages.
    startActiveConnection: true,
    // For additional loging, please uncomment the three rows below
    onLogMessage: function(message) {
      console.log(message);
    },
  });

  var signUpObj = {
    username: teacherData.get('email'),
    password: teacherData.get('email')
  }

  // Sign in with the professor's email, and
  // if the professor doesn't have a Sinch WebRTC account, create one for the professor.
  sinchClient.newUser(signUpObj).then(function(ticket){
    sinchClient.start(ticket);
    console.log('******sinch client ticket started******')
  }).fail(function(error){
    console.log('******* user may already exist, logging in with existing email *******');
  
    sinchClient.start(signUpObj)
      .then(function(){
        console.log('********** sinchClient signed up and logged in ********');
      })
      .fail(function(error){
        console.log('********** sinch failed to log in: *******', error)
      })
  });


  return {
    call: function(userID) {
      var callListeners = {
        onCallEstablished: function(currentCall) {
          $('audio').attr('src', currentCall.incomingStreamURL);
          currentCall.mute();
          console.log("******call established*******");
        }
      };
      
      var callClient = sinchClient.getCallClient();
      var newCall = callClient.callUser(userID);
      newCall.addEventListener(callListeners);
    }
  }  

})
