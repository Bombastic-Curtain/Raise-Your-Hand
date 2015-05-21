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
		//we need to figure out how to determin if new user is a student or teacher, maybe we could pass in params
		//with the post request?
		var name = profile.displayName;
		var fbPicture = profile.photos[0].value;
		var email = profile.emails[0].value;

		console.log("----------------------------------------");
		console.log("----------------------------------------");
				console.log(req.headers.class_identification);

		console.log(email);
		console.log(req.headers.user_role);

		console.log("----------------------------------------");
		console.log("----------------------------------------");


		if(req.headers.user_role === "student"){
			console.log("-----------------------CREATING STUDENT ---------------------------");
			console.log(email);

			var findOne = Q.nbind(Student.findOne, Student);
	    findOne({email: email})
	      .then(function(user) {
	        if (user) {
	        	return user;
	        } else {
	        	// create a student
	        	console.log("---------------- NO USER FOUND, CREATING USER -------------");
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
	      		console.log("!!!!!!!!!!!! USER IS !!!!!!!!!!!!!!!" + user);

						return done(null, user);
	      })
	      .fail(function (error) {
	      	console.log("******* ERROR ******");
	      });
		}else if(req.headers.user_role === "teacher"){
			console.log("-----------------------CREATING STUDENT ---------------------------");
			console.log(email);			
			var findOne = Q.nbind(Teacher.findOne, Teacher);
	    findOne({email: email})
	      .then(function(user) {
	        if (user) {
	        	return user;
	        } else {
	        	// create a Teacher
	        	console.log("---------------- NO USER FOUND, CREATING USER -------------");
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
	      		console.log("!!!!!!!!!!!! USER IS !!!!!!!!!!!!!!!" + user);

						return done(null, user);
	      })
	      .fail(function (error) {
	      	console.log("******* ERROR ******");
	      });
		}



	



	}
	));
}