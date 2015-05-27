var Classes = require('../classes/classesModel.js');
var Students = require('./studentsModel.js');
var Q    = require('q');
var jwt  = require('jwt-simple');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function (socketio) {
  var module = {};
  // note: .find({_id:new ObjectId("id here")})

  module.raiseHand = function (req, res, next) {
    console.log("Hand Raised.");
  };

  module.classList = function(req, res, next) {
    Students.findOne({email: req.user.email}, function(err, data) {
      if(data) {
        Classes.find({classID: { $in: data.classIDs}}, function(err, data) {
          res.status(200).send(data);
        });
      }
    });
  };

  module.joinClass =function (req, res, next) {
      // Create object to hold data for this student
      var studentData = {};
      // Get Student Data to put in Students array for this class
      Students.findOne({email: req.body.email}, function(err, data) {
        if(!err) {
          if(data) {
            studentData = {name: data.name ,email: data.email ,fbPicture: data.fbPicture};
          } else {
            console.log('*** Did not find student when trying to join class');
          }
        } else {
          console.log('*** error in database trying to find Student to join class');
        }
      });

      console.log("---------- inside of join class --> class id = " + req.body.classID);
      Classes.findOne({classID : req.body.classID}, function(err, data) {
        console.log("classes.findOne data: ", data);
        if(err) {
          console.log('** error finding class **', err)
          return;
        } 
        if (data){ 
          console.log("****** the class the student is trying to join , is found in DB *****")

          // Save user email to this class students list
          data.students.push(studentData);
          data.save(function(err) {
            if(err) {
              console.log('** error updating student **');
            } else {
              console.log('** successfully updated student **');
            }
          });

          // Now add class to this student's list of classes
          Students.findOne({email: req.user.email}, function(err, data) {
            if(err) {
              console.log('** error finding student email **', err)
              return;
            } 
            if (data){ 
              data.classIDs.push(req.body.classID);
              data.save(function(err) {
                if(err) {
                  console.log('** error updating student class IDs **');
                } else {
                  console.log('** successfully updated student class IDs **');
                  res.status(201).send();
                }
              })
            } else {
              console.log('*** Invalid student / Student email not found');
              res.status(500).send('invalidEMAIL');
            }
          })

        } else {
          console.log('*** Invalid Class ID from student / Class ID not found');
          res.status(500).send('invalidID');
        }
      });      
  }
  return module;
};
