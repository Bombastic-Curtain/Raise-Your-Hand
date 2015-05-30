describe('Teacher Data Factory', function() {
  
  var tData, $httpBackend;

  beforeEach(module('queup'));
  beforeEach(inject(function ($injector) {
    tdata = $injector.get('teacherData');
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.when('GET', 'http://localhost:8000/api/teachers/getTeacherData')
                .respond({name: 'Mr. Teacher',
                          email: 'teacher@class.edu',
                          classes: [{name: 'Math'},{name: 'English'}],
                        });
  }));

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
  });

  describe('teacherData functionality', function() {
    it('should have a get function', function() {
      expect(tdata.get).to.be.a('function');
    });

    it('should have a set function', function() {
      expect(tdata.set).to.be.a('function');
    });

    it('should have an update function', function() {
      expect(tdata.update).to.be.a('function');
    });

    it('should be able to modify and retrieve its properties', function() {
      tdata.set('currentClass', {name: 'Class Name'});
      expect(tdata.get('currentClass').name).to.equal('Class Name');
    });

    it('should return copies of property values, not the values themselves', function() {
      var classObj = {name:'Math 53'};
      tdata.set('currentClass', classObj);
      expect(tdata.get('currentClass')).to.not.equal(classObj);
    });

    it('should fetch teacher data from a server and update local copy', function() {
      $httpBackend.expectGET('http://localhost:8000/api/teachers/getTeacherData');
      tdata.update().then(function() {
        expect(tdata.get('name')).to.equal('Mr. Teacher');
      });
      $httpBackend.flush();
    });

    it('should mark data as loading while waiting for request to finish', function() {
      $httpBackend.expectGET('http://localhost:8000/api/teachers/getTeacherData');
      tdata.update();
      expect(tdata.get('loading')).to.equal(true);
      $httpBackend.flush();
    });

    it('should mark data as loaded when request is finished', function() {
      $httpBackend.expectGET('http://localhost:8000/api/teachers/getTeacherData');
      tdata.update().then(function() {
        expect(tdata.get('loaded')).to.equal(true);
      });
      $httpBackend.flush();
    });

  });
});