var should = require('should');
var mongoose = require('mongoose');
var Classes = require('../classes/classesModel.js');
var http = require('http');
mongoose.connect('mongodb://localhost/raiseyourhand');
var teachersController = require('../teachers/teachersController.js')
describe('teachersController.js\n', function () {
  describe('Function addClass', function () {
    it('Should have a function called addClass', function () {
      teachersController.should.have.property('addClass');
    });
    it('Should respond with 201', function (done) {
      mongoose.connection.collections['classes'].drop(function(err) {});
      var options = {
        hostname: 'localhost',
        port: 8000,
        method: 'POST',
        path: '/api/teachers/addclass',
        headers: {
          'Content-Type': 'application/json',
          // replace with tester's own FB access token (look in browser console when logging in)
          'access_token': 'CAAKNYLZBjIKEBAJH4D4TVqXZAZBQtqOvqy4tO0hlKvuoiwtWajPScXxdbF5cas5jD1TuA6vuZBCcjWuhLyP5qzANfBSvKVgO7yZA74M3qxp4w9N5TXQ1hrx3N7FzjUJXoUHDke9tnEI7aQU5rlvtqw10mDbWSoIfw0n62lFEb5X2GZBKxMbyNpZBkiuxQcSAaRLMSNpEUK7rhhNU8kNNgS5jNgpDG4mLUsZD',
          'user_role': 'teacher'
        }
      }; 
      var postData = {
        classTitle: "testClass"
      };
      var request = http.request(options, function (res) {
        res.statusCode.should.equal(201);
        done();
      });
      request.write(JSON.stringify(postData));
      request.end();
    });
    it('Should have added a class to the database', function (done) {
      Classes.findOne({name: 'testClass'}, function (err, item) {
        done(should.exist(item));
      });
    });
    it('Database entry should have a 4-digit class ID', function (done) {
      Classes.findOne({name: 'testClass'}, function (err, item) {
        done(should.equal(item.classID.length, 4));
      });
    });
    it('Database entry should have a teacher id.', function (done) {
      Classes.findOne({name: 'testClass'}, function (err, item) {
        done(should.exist(item.teacher));
      });
    });
  });

  describe('Function removeClass', function () {
    it('Should have a function called removeClass', function () {
      teachersController.should.have.property('removeClass');
    });
    it('Should respond with 201 status code', function (done) {
      var options = {
        hostname: 'localhost',
        port: 8000,
        method: 'POST',
        path: '/api/teachers/removeClass',
        headers: {
          'Content-Type': 'application/json',
          'access_token': 'CAAUQJumeHtoBAMTNjcDLgPuu3ftoZCDWmybLzQ0rtTarUrDKY1QVmHW5ovmkaMU4uqJ10c08Q4gZA3WakjNdn475McTfOE0hwkCjQIwlGyK8tpJqCiiLqtQEZBUgXofFfLdXEhEKQ6NO5JjV3HXosQsWPzNDxcL3CZB0XnSPbvAvNKQ4fKs7xrbk2K2V8BLfIYyLVIZAY3FGBHCZBlqUIFXFucCu1Sqm8ZD',
          'user_role': 'teacher'
        }
      };
      var postData = {
        classTitle: "testClass"
      };
      var request = http.request(options, function (res) {
        done(res.statusCode.should.equal(201));
      });
      request.write(JSON.stringify(postData));
      request.end();
    });
    it('Should have removed the class from the database.', function (done) {
      Classes.findOne({name: 'testClass'}, function (err, item) {
        (!!item).should.equal(false);
        done();
      });
    });
  });

  describe('Function getClass', function () {
    var statusCode;
    var classes;
    before(function (done) {
      // Drop table and add new one
      mongoose.connection.collections['classes'].drop(function(err) {});
      var options = {
        hostname: 'localhost',
        port: 8000,
        method: 'POST',
        path: '/api/teachers/addclass',
        headers: {
          'Content-Type': 'application/json',
          'access_token': 'CAAUQJumeHtoBAMTNjcDLgPuu3ftoZCDWmybLzQ0rtTarUrDKY1QVmHW5ovmkaMU4uqJ10c08Q4gZA3WakjNdn475McTfOE0hwkCjQIwlGyK8tpJqCiiLqtQEZBUgXofFfLdXEhEKQ6NO5JjV3HXosQsWPzNDxcL3CZB0XnSPbvAvNKQ4fKs7xrbk2K2V8BLfIYyLVIZAY3FGBHCZBlqUIFXFucCu1Sqm8ZD',
          'user_role': 'teacher'
        }
      }; 
      var postData = {
        classTitle: "testClass"
      };
      var request = http.request(options, function (res) {});
      request.write(JSON.stringify(postData));
      request.end();
      // Get class list
      var options = {
        hostname: 'localhost',
        port: 8000,
        method: 'GET',
        path: '/api/teachers/getClassList',
        headers: {
          'access_token': 'CAAUQJumeHtoBAMTNjcDLgPuu3ftoZCDWmybLzQ0rtTarUrDKY1QVmHW5ovmkaMU4uqJ10c08Q4gZA3WakjNdn475McTfOE0hwkCjQIwlGyK8tpJqCiiLqtQEZBUgXofFfLdXEhEKQ6NO5JjV3HXosQsWPzNDxcL3CZB0XnSPbvAvNKQ4fKs7xrbk2K2V8BLfIYyLVIZAY3FGBHCZBlqUIFXFucCu1Sqm8ZD',
          'user_role': 'teacher'
        }
      };
      var request = http.request(options, function (res) {
        var data = "";
        statusCode = res.statusCode;
        res.on('data', function (chunk) {
          data += chunk.toString();
          console.log('before data: ',data)
          classes = JSON.parse(data); 
          done();
        });
      });
      request.end();
    });
    it('Should have a function called getClasses', function () {
      teachersController.should.have.property('getClasses');
    });
    it('Should respond with 200 status code', function () {
      statusCode.should.equal(200);
    });
    it('Should send back an Array', function () {
      classes.should.be.an.Array;
    });
    it('Array should contain an object', function () {
      classes[0].should.be.an.Object
    });
    it('Object should have a name, teacher and classID property', function (done) {
        should.exist(classes[0].name);
        should.exist(classes[0].classID);
        should.exist(classes[0].teacher);
        done();
    });
  });

  describe('Function getTeacherData', function () {
    var statusCode;
    var teacher;
    before(function (done) {
      // Drop table and add new one
      mongoose.connection.collections['teachers'].drop(function(err) {
        var options = {
          hostname: 'localhost',
          port: 8000,
          method: 'GET',
          path: '/api/teachers/getTeacherData',
          headers: {
            'Content-Type': 'application/json',
            'access_token': 'CAAKNYLZBjIKEBAJH4D4TVqXZAZBQtqOvqy4tO0hlKvuoiwtWajPScXxdbF5cas5jD1TuA6vuZBCcjWuhLyP5qzANfBSvKVgO7yZA74M3qxp4w9N5TXQ1hrx3N7FzjUJXoUHDke9tnEI7aQU5rlvtqw10mDbWSoIfw0n62lFEb5X2GZBKxMbyNpZBkiuxQcSAaRLMSNpEUK7rhhNU8kNNgS5jNgpDG4mLUsZD',
            'user_role': 'teacher'
          }
        };
        var request = http.request(options, function (res) {
          var data = "";
          statusCode = res.statusCode;
          res.on('data', function (chunk) {
            data += chunk.toString();
            teacher = JSON.parse(data); 
            done();
          });
        });
        request.end(); 
      });
    });
    it('Should have a function called getTeacherData', function () {
      teachersController.should.have.property('getTeacherData');
    });
    it('Should respond with 200 status code', function () {
      statusCode.should.equal(200);
    });
    it('Should send back an Array', function () {
      teacher.should.be.an.Object;
    });
    it('Object should have a name, email, picture and classes property', function (done) {
      should.exist(teacher.name);
      should.exist(teacher.email);
      should.exist(teacher.fbPicture);
      should.exist(teacher.classes);
      done();
    });
  });
});