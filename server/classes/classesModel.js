'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

var ClassSchema = new Schema({
  name: String,
  classID: String, 
  teacher: String,
  students: Array
});

ClassSchema.plugin(findOrCreate);
module.exports = mongoose.model('Class', ClassSchema);
