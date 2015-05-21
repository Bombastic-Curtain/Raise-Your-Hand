var Classes = require('../classes/classesModel.js');
var Q    = require('q');
var jwt  = require('jwt-simple');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = {
  raiseHand: function (req, res, next) {
      console.log("************** inside of get class *************");
      // var create = Q.nbind(Classes.find, Classes);
      // find({})

      // SiteModel.find({}, function(err, docs) {
      //     if (!err){ 
      //         console.log(docs);
      //         process.exit();
      //     } else {throw err;}
      // });    
  },

  joinClass: function (req, res, next) {
      console.log("************** inside of join class *************" + req.headers.class_identification);
      console.log("----------- " + req.user)


      Classes.findOne({classID : req.headers.class_identification}, function(err, data) {
          if (!err){ 
            console.log("********** FOUND THE CLASS////////////////////////////////")
              console.log(JSON.stringify(data.assignedStudents));
              data.assignedStudents = data.assignedStudents.concat(req.user.id);
              data.save(function (err) {
                  console.log("------------------------ SAVED -------------------------");
                   res.end();
                  if(err) {
                      console.error('ERROR!');

                  }
              });

             
          } else {throw err;}
      });  


      // var query = {'classID':req.headers.class_identification};
      // //req.newData.username = req.user.username;
      // Classes.findOneAndUpdate(query, req.newData, {upsert:true}, function(err, doc){
      //     if (err) return res.send(500, { error: err });
      //     return res.send("succesfully saved");
      // });


      var query = {'email':req.user.email};
      MyModel.findOneAndUpdate(query, req.newData, {upsert:true}, function(err, doc){
          if (err) return res.send(500, { error: err });
          return res.send("succesfully saved");
      });


    
  }
};
