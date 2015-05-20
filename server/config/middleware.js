var bodyParser  = require('body-parser'),


module.exports = function (app, express) {

  var studentRouter = express.Router();
  var teacherRouter = express.Router();
  var classesRouter = express.Router();


  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));


  app.use('/api/teachers', teacherRouter); 
  app.use('/api/students', studentRouter); 
  app.use('/api/classes', classesRouter); 

  require('../teachers/teachersRoutes.js')(teacherRouter);
  require('../students/studentsRoutes.js')(studentRouter);
  require('../classes/classesRoutes.js')(classesRouter);

};
