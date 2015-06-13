// Teachers Controller
// ---------------------
var Classes = require('../classes/classesModel.js');
var Teachers = require('./teachersModel.js');
var Students = require('../students/studentsModel.js');
var Q    = require('q');
var jwt  = require('jwt-simple');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = {
  //Add a class to the database
  addClass: function (req, res, next) {
      console.log("************** adding class to DBs *************");
      console.log("----------------> req", req.user);
      var create = Q.nbind(Classes.create, Classes);
      var teacherID = req.user.email;
      var teacherPic = req.user.fbPicture;
      console.log("-----------> user email " + teacherID);
      var makeid = function(){
          var text = "";
          var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
          for( var i=0; i < 4; i++ )
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
      }
      var classId = makeid();
      var newClass = {
        name: req.body.classTitle,
        teacher: teacherID,
        teacherPic: teacherPic,
        classID: classId
      };
      create(newClass)
      .then(function (classObj) {
        console.log("!!!!!!!!!!!! USER IS !!!!!!!!!!!!!!!" + classObj);
        res.status(201).json(classObj);
      })
      .fail(function (error) {
        console.log("******* ERROR ******  " + error);
      });
  },

  // Gets classes for a teacher from the database
  getClasses: function (req, res, next) {
    console.log('**********Inside Teachers Controller - get class')

    Classes.find({teacher : req.user.email }, function(err, dbData){
      if(!err){
        console.log("-------found teacher access token in class collection, dbData below---------");
        console.log(dbData)
        
        var classes = [];
        for(var i = 0; i < dbData.length; i++){
          classes.push(dbData[i])
        }

        res.json(classes);
      } else {
        throw err;
      }
    })
  },

  // Gets class name and id for a class by class name
  getClassInfo: function (req, res, next) {
    console.log('**********Inside Teachers Controller - Get Class Info')
    console.log("req.body.className: ", req.body.className)

    Classes.findOne({name : req.body.className }, function(err, dbData){
      if(!err){
        console.log("-------found className in classes collection, dbData below---------");
        console.log(dbData)

        var result = {
          className: dbData.name,
          classID: dbData.classID
        }

        res.json(result);
      } else {
        throw err;
      }
    })
  },

  getStudentList: function(req, res, next){
    console.log("**********Inside Teachers Controller - In Session - Student List - GET request")
    console.log("req.query: ", req.query);

    Classes.findOne({classID : req.query.classid }, function(err, dbData){
      if(dbData){
        console.log("-------found className in classes collection, dbData below---------");

        res.json({results: dbData.students});
      } else {
        throw err;
      }
    })
  },

  // Gets the name, email, picture and classes for the teacher
  getTeacherData: function(req,res,next) {
    console.log('***** getTeacherData controller ******');
    Teachers.findOne({email: req.user.email}, function(err, dbData) {
      if(!err) {

        Classes.find({teacher: req.user.email}, function(err, classes) {
          console.log('**** here are classes ****', classes)
          var classesList = classes;

        console.log('***** found teacher, '+ req.user.email +' returning data ****');
        var teacherData = {
          name: dbData.name,
          email: dbData.email,
          fbPicture: dbData.fbPicture,
          classes: classesList
        };
        res.json(teacherData);
          
        });
      } else {
        throw err;
      }
    });
  }
};
