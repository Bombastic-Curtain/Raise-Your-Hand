module.exports = function (app, socketio) {

  var studentsController = require('./studentsController.js')(socketio);
  app.get('/classList', studentsController.classList);
  // app === userRouter injected from middlware.js
  app.post('/joinClass', studentsController.joinClass);
  app.post('/raiseHand', studentsController.raiseHand);
};
