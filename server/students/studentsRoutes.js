module.exports = function (app, socketio) {

  var studentsController = require('./studentsController.js')(socketio);
  // starting the socketIO listener
  studentsController.startHandRaiseSocketListener();
  // app === userRouter injected from middlware.js
  app.get('/joinClass', studentsController.joinClass);
  app.post('/raiseHand', studentsController.raiseHand);
};
