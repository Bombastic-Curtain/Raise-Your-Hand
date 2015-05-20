var bodyParser  = require('body-parser');
var passport = require('passport');



module.exports = function (app, express) {

  var studentRouter = express.Router();
  var teacherRouter = express.Router();
  var classesRouter = express.Router();


  app.use(passport.initialize());
  app.use(partials());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  /*========= Every request to the server will be authiticated ==== WILL REFACTOR TO JWT
  we are currently passing the fbToken back to the server, passport will hit facebook with the token and return a valid user ID and user token
  */

  app.use('/', passport.authenticate('facebook-token', {session:false}));



  app.use('/api/teachers', teacherRouter); 
  app.use('/api/students', studentRouter); 
  app.use('/api/classes', classesRouter); 

  require('../teachers/teachersRoutes.js')(teacherRouter);
  require('../students/studentsRoutes.js')(studentRouter);
  require('../classes/classesRoutes.js')(classesRouter);

};
