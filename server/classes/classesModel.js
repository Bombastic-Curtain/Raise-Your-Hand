'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassSchema = new Schema({
  name: String,
  classID: String, 
  teacher: String,
});

};

module.exports = mongoose.model('Class', UserSchema);
