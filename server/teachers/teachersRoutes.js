var teacherController = require('./teachersController.js');
module.exports = function (app) {
  // app === userRouter injected from middlware.js
  app.post('/addClass', teacherController.addClass);
  app.post('/removeClass', teacherController.removeClass);
};
