'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate')


var StudentSchema = new Schema({
  name: String,
  fbID: String, 
  fbToken: String,
  email: String,
  fbPicture : String,
  classes: []
});

StudentSchema.plugin(findOrCreate);

module.exports = mongoose.model('Student', StudentSchema);
