'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema({
  name: String,
  fbID: String, 
  fbToken: String,
  email: { type: String, lowercase: true },
  fbPicture : String,
  classes: []
});

};

module.exports = mongoose.model('Student', UserSchema);
