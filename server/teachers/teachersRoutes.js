var teacherController = require('./teachersController.js');
module.exports = function (app) {
  // app === userRouter injected from middlware.js
  app.get('/getClassList', teacherController.getClass);
  app.get('/getStudentList/:classid?', teacherController.getStudentList);
  app.get('/getTeacherData', teacherController.getTeacherData);
  
  app.post('/getClassInfo', teacherController.getClassInfo);
  app.post('/addClass', teacherController.addClass);
  app.post('/removeClass', teacherController.removeClass);
};
