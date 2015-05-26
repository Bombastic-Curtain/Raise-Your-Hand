var classesController = require('./classesController.js');
module.exports = function (app) {

  app.get("/getStudents", classesController.getStudents);

};