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
      var joinedClasses = [];
      // Get Student Data to put in Students array for this class
      Students.findOne({email: req.user.email}, function(err, data) {
        if(!err) {
          if(data) {
            console.log('student joining class data:', data)
            studentData = {name: data.name ,email: data.email ,fbPicture: data.fbPicture};
            joinedClasses = data.classIDs;

            // Check if student already joined class
            console.log('checking if student already joined class:', joinedClasses, 'indexof:', joinedClasses.indexOf(req.body.classID), 'classID:', req.body.classID);
            if(joinedClasses.indexOf(req.body.classID) > -1) {
              res.status(500).send('alreadyJoinedClass');
              return;
            } else {
              // Student hasn't already joined class, so we can go ahead and add them

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
          } else {
            console.log('*** Did not find student when trying to join class');
            res.status(500).send('noStudentFound');
          }
        } else {
          console.log('*** error in database trying to find Student to join class');
          res.status(500).send('studentDatabaseError');
        }
      });


            
  }
  return module;
};
