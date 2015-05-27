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

      console.log("---------- inside of join class --> class id = " + req.body.classID);
      Classes.findOne({classID : req.body.classID}, function(err, data) {
        console.log("classes.findOne data: ", data);
        if(err) {
          console.log('** error finding class **', err)
          return;
        } 
        if (data){ 
          console.log("****** the class the student is trying to join , is found in DB *****")

          // Save user email to class students list
          data.students.push(req.user.email);
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
