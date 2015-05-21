var Classes = require('../classes/classesModel.js');
var Q    = require('q');
var jwt  = require('jwt-simple');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = {
  addClass: function (req, res, next) {
      console.log("************** adding class to DBs *************");
      console.log(req.body.classTitle);
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
    
  }
};
