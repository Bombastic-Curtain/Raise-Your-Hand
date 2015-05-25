var Classes = require('../classes/classesModel.js');
var Q    = require('q');
var jwt  = require('jwt-simple');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = {
  addClass: function (req, res, next) {
      console.log("************** adding class to DBs *************");
      console.log(req.body.classTitle);
      console.log('req in addClass is:', req)
      //var ObjectId = mongoose.Types.ObjectId;
      //var myObjectId = ObjectId.fromString(req.body.classTitle);
      console.log("----------------> req", req.user);
      var create = Q.nbind(Classes.create, Classes);
      var teacherID = req.user.email;
      console.log("-----------> user email " + teacherID);
      //--------------------------------- THIS WILL BE REFACTORED -------------------------------
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
        classID: classId
      };
      create(newClass)
      .then(function (classObj) {
        console.log("!!!!!!!!!!!! USER IS !!!!!!!!!!!!!!!" + classObj);
        //next();
        res.json(classObj);
      })
      .fail(function (error) {
        console.log("******* ERROR ******  " + error);
      });

    
  },

  removeClass: function (req, res, next) {
    
  },

  getClass: function (req, res, next) {
    console.log('**********Inside Teachers Controller - get class')
    console.log("req.user: ", req.user)
    console.log("req.user.email: ", req.user.email)

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
      if(!err){
        console.log("-------found className in classes collection, dbData below---------");

        res.json(dbData.assignedStudentsName);
      } else {
        throw err;
      }
    })
  }
};

