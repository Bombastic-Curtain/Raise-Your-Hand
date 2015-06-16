// Students Routes
// ---------------
module.exports = function (app, socketio) {

  var studentsController = require('./studentsController.js')(socketio);
  // app === userRouter injected from middlware.js
  app.get('/classList', studentsController.classList);
  app.post('/joinClass', studentsController.joinClass);
  app.post('/raiseHand', studentsController.raiseHand);
};
