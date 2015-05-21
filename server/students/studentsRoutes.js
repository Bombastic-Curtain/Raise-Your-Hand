var studentsController = require('./studentsController.js');


module.exports = function (app) {
  // app === userRouter injected from middlware.js

  app.get('/joinClass', studentsController.joinClass);
  app.get('/raiseHand', studentsController.raiseHand);
};
