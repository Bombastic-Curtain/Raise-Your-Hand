// Passport Authentication
// -------------
var FacebookTokenStrategy = require('passport-facebook-token');
var authConfig = require('./authkeys.js');
var Student = require('../students/studentsModel.js');
var Teacher = require('../teachers/teachersModel.js');
var Q    = require('q');

module.exports = function(passport) {
	console.log("**** INSIDE OF PASSPORT ***")

	passport.use(new FacebookTokenStrategy({
		clientID : process.env.ClientID || authConfig.facebookAuth.clientID,
		clientSecret : process.env.ClientSecret || authConfig.facebookAuth.clientSecret,
		passReqToCallback: true
	}, function(req, accessToken, refereshToken, profile, done) {
			
		// User role is passed in from the front end inside the header
		// We grab basic user information from their Facebook profile which is passed in the passport callback.
		var name = profile.displayName;
		var fbPicture = profile.photos[0].value;
		var email = profile.emails[0].value;

		console.log("----------- USER DATA : -----------------");
		console.log('USER EMAIL ' + email);
		console.log('USER ROLE ' + req.headers.user_role);
		console.log('USER NAME ' + name);
		console.log("----------------------------------------");

		if(req.headers.user_role === "student"){
			console.log("-----------------------CREATING STUDENT ---------------------------");
			var findOne = Q.nbind(Student.findOne, Student);
	    findOne({email: email})
	      .then(function(user) {
	        if (user) {
	        	return user;
	        } else {
	        	console.log("---------------- NO STUDENT FOUND, CREATING STUDENT -------------");
	          var create = Q.nbind(Student.create, Student);
	          var newStudent = {
						  name: name,
						  fbToken: accessToken,
						  email: email,
						  fbPicture : fbPicture
	          };
	          return create(newStudent);
	        }
	      })
	      .then(function (user) {
	      		console.log("----- CREATED NEW STUDENT , THE STUDENT IS" + user);
						return done(null, user);
	      })
	      .fail(function (error) {
	      	console.log("******* ERROR ******");
	      });
		}else if(req.headers.user_role === "teacher"){
			console.log("-----------------------CREATING TEACHER ---------------------------");
			console.log(email);			
			var findOne = Q.nbind(Teacher.findOne, Teacher);
	    findOne({email: email})
	      .then(function(user) {
	        if (user) {
	        	return user;
	        } else {
	        	console.log("---------------- NO TEACHER FOUND, CREATING TEACHER -------------");
	          var create = Q.nbind(Teacher.create, Teacher);
	          var newTeacher = {
						  name: name,
						  fbToken: accessToken,
						  email: email,
						  fbPicture : fbPicture
	          };
	          return create(newTeacher);
	        }
	      })
	      .then(function (user) {
	      		console.log("----- CREATED NEW TEACHER , THE TEACHER IS" + user);
						return done(null, user);
	      })
	      .fail(function (error) {
	      	console.log("******* ERROR ******");
	      });
		}
	}
	));
}
