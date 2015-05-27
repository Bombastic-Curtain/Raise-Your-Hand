var FacebookTokenStrategy = require('passport-facebook-token');
var authConfig = require('./authkeys.js');
//=== bring in teacher and Teacher dbs === 
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
		/*
			USER ROLE IS PASSED IN FROM THE FRONTEND INSIDE THE HEADER
			req.headers.user_role = 'teacher' or 'student'
			-------
			we grabe basic user information from their facebook profile, which is passed in 
			in the passport callback 
		*/
		var name = profile.displayName;
		var fbPicture = profile.photos[0].value;
		var email = profile.emails[0].value;

		console.log("----------- USER DATA : -----------------");
		console.log('USER EMAIL ' + email);
		console.log('USER ROLE ' + req.headers.user_role);
		console.log('USER NAME ' + name);
		console.log("----------------------------------------");

		if(req.headers.user_role === "student"){
			/*
				will refactor to not use Q 
			*/
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
	        	// create a Teacher
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