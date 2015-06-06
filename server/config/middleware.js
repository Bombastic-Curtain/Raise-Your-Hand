var bodyParser  = require('body-parser');
var passport = require('passport');
var cors = require('cors');
var prettyjson = require('prettyjson');

module.exports = function (app, express) {
  /*
    to get socket.io to work , i used app.listen fron index.js to here
  */
  var port = process.env.PORT || 3003;
  var server = app.listen(port);
  var socketio = require('socket.io').listen(server);

  var studentRouter = express.Router();
  var teacherRouter = express.Router();
  var classesRouter = express.Router();

  app.use(passport.initialize());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  //add CORS HEADERS
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  /*
    THIS NEED TO BE CHANGED TO /../../client TO SERVE UP THE ANGULAR FRONTEND
  */
  app.use(express.static(__dirname + '/../../client'));
  app.use(cors());
  require('./passport.js')(passport);
  // ----- excluding the socket.io traffic from auth, socket io auth will be added 
  var unless = function(path, middleware) {
    return function(req, res, next) {
      console.log("----> req path " + req.path);
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
  };
  /*========= Every request to the server will be authiticated ==== WILL REFACTOR TO JWT
  we are currently passing the fbToken back to the server, passport will hit facebook with the token and return a valid user ID and user token
  */
  //======= this does auth, than check if the user is a teacher or student

  app.use(unless('/socket.io/', passport.authenticate('facebook-token', {session:false})),
    function (req, res, next) {
      console.log("******* GOING TO NEXT ---------------- ");
      console.log(req.user);
      next();
    }
  );

  // socket middleware to extract identification data from the initial socket connection
  socketio.use(function(socket, next) {
    var handshakeData = socket.request;
    console.log('handshakeData', handshakeData._query);
    // make sure the handshake data looks good as before
    // if error do this:
      // next(new Error('not authorized');
    // else just call next
    next();
  });

  app.use('/api/teachers', teacherRouter); 
  app.use('/api/students', studentRouter); 
  app.use('/api/classes', classesRouter); 

  require('../teachers/teachersRoutes.js')(teacherRouter);
  require('../students/studentsRoutes.js')(studentRouter, socketio);

  require('../sockets.js')(socketio);
  //require('../classes/classesRoutes.js')(classesRouter);

};
