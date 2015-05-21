var bodyParser  = require('body-parser');
var passport = require('passport');
var cors = require('cors');
var prettyjson = require('prettyjson');




module.exports = function (app, express) {

  var studentRouter = express.Router();
  var teacherRouter = express.Router();
  var classesRouter = express.Router();


  app.use(passport.initialize());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../test_client'));

  app.use(cors());

  require('./passport.js')(passport);




  /*========= Every request to the server will be authiticated ==== WILL REFACTOR TO JWT
  we are currently passing the fbToken back to the server, passport will hit facebook with the token and return a valid user ID and user token
  */
  //======= this does auth, than check if the user is a teacher or student
  app.use('/', passport.authenticate('facebook-token', {session:false}),
    function (req, res, next) {
      console.log("******* GOING TO NEXT ---------------- ");




      // console.log(prettyjson.render(req.user, {
      //   keysColor: 'rainbow',
      //   dashColor: 'magenta',
      //   stringColor: 'white'
      // }));
    console.log(req.user);
    next();
    }
  );

  app.post('/test', function (req, res) {
    console.log("========================= PASSED ================");
  });

  //app.use('/', passport.authenticate('facebook-token', {session:false}));



  app.use('/api/teachers', teacherRouter); 
  app.use('/api/students', studentRouter); 
  app.use('/api/classes', classesRouter); 

  require('../teachers/teachersRoutes.js')(teacherRouter);
  require('../students/studentsRoutes.js')(studentRouter);
  //require('../classes/classesRoutes.js')(classesRouter);

};
