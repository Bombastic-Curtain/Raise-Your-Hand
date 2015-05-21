'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate')


var TeacherSchema = new Schema({
  name: String,
  fbID: String, 
  fbToken: String,
  email: String,
  fbPicture : String,
  classes: []
});


TeacherSchema.plugin(findOrCreate);



module.exports = mongoose.model('Teacher', TeacherSchema);
