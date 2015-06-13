angular.module('queup.sinch', ['queup.factory'])

.factory('sinch', function(teacherData){

  var sinchClient = new SinchClient({
    applicationKey: 'ccdeeb0b-5733-4bcb-9f44-4b2a7a70dbfe',
    capabilities: {calling: true},
    startActiveConnection: true, /* NOTE: This is required if application is to receive calls / instant messages. */ 
    //Note: For additional loging, please uncomment the three rows below
    onLogMessage: function(message) {
      console.log(message);
    },
  });

  var signUpObj = {
    username: teacherData.get('email'),
    password: teacherData.get('email')
  }

  sinchClient.newUser(signUpObj).then(function(ticket){
    sinchClient.start(ticket);
    console.log('******sinch client ticket started******')
  }).fail(function(error){
    console.log('******* user may already exist, logging in with existing email *******');
  
    sinchClient.start(signUpObj)
      .then(function(){
        console.log('********** sinchClient started ********');
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
