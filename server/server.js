var express     = require('express');
var mongoose    = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/raiseyourhand'); // connect to application DB

require('./config/middleware.js')(app, express);

module.exports = app;
