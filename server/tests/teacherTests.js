var should = require('should');
var mongoose = require('mongoose');
var Classes = require('../classes/classesModel.js');
var http = require('http');
mongoose.connect('mongodb://localhost/raiseyourhand');
var teachersController = require('../teachers/teachersController.js')
describe('teachersController', function () {

  beforeEach(function (done) {
    mongoose.connection.collections['classes'].drop( function(err) {
      console.log('Classes dropped.');
      done();
    });
  });

  it('Should have a function called addClass', function () {
    teachersController.should.have.property('addClass');
  });
  it('addClass should add a class to the database.', function () {
    var options = {
      hostname: 'localhost:3003'
    }
  });

});