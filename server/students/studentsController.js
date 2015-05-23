var Classes = require('../classes/classesModel.js');
var Q    = require('q');
var jwt  = require('jwt-simple');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function (socketio) {
  var module = {};
  // note: .find({_id:new ObjectId("id here")})
  module.startHandRaiseSocketListener = function (req, res, next) {
      /*---------- WILL BE SWITCHED OUT BEFORE PRODUCTION -----------------------
      ---------- myabe serialize a user into session , so socketIO does not need to deal with 
      token based auth -----------------------------------------------------------
      */
    socketio.on('connection', function (socket) {
        console.log('connected');
        socket.on('handraise', function(data) {
            console.log("--------------- SOCKET IO HAND_RAISED EVENT ----------------------");
            console.log("clas id" + data.classID);
            Classes.findOne({classID : data.classID}, function(err, dbData) {
                if (!err){ 
                  console.log("------ class found in DB, for going to add student ID into the table to indicate a student has their hand raised -------")
                  console.log(JSON.stringify(dbData.handRaised));

                  if(JSON.stringify(dbData.handRaised).toString().indexOf(data.studentID.toString()) < 0){
                    console.log("adding the student id to hand raised" + JSON.stringify(dbData.handRaised).indexOf(dbData.handRaised));
                    dbData.handRaised = dbData.handRaised.concat(data.studentID);
                  }

                  dbData.save(function (err) {
                    if(err) {
                        console.error('ERROR!');
                    }else{
                      console.log("socketIO sending changed event---------------");
                      /*
                        THIS EMITS A HAND RAISED EVENT TO THE FRONTEND
                      */
                      socket.emit('newhandraised', { classObj: dbData});
                    }
                  });
                } else {throw err;}
            }); 
          });
      });
  };

  module.raiseHand = function (req, res, next) {
    console.log("Hand Raised.");
  };

  module.joinClass =function (req, res, next) {
      console.log("---------- inside of join class --> class id = " + req.headers.class_identification);
      Classes.findOne({classID : req.headers.class_identification}, function(err, data) {
          if (!err){ 
            console.log("****** the class the student is trying to join , is found in DB *****")
              console.log(JSON.stringify(data.assignedStudents));
              data.assignedStudents = data.assignedStudents.concat(req.user.id);
              data.save(function (err) {
                  console.log("---------- student ID added to the class ---------------------");
                  /* 
                    broadcasts out a event to the clients , anytime a student joins a class
                  */ 
                  socketio.emit('newstudentjoined', { classObj: data});
                  res.end();
                  if(err) {
                      console.error('ERROR!');
                  }
              });
          } else {throw err;}
      });      
  }
  return module;
};
