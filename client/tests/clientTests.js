describe('Teacher Data Factory', function() {
  
  var tData, $httpBackend;

  beforeEach(module('queup'));
  // Tell urlRouteProvider not to try to go to default URL when $state is loaded in the app.js .run method,
  // so that $httpBackend.verifyNoOutstandingExpectation after each doesn't cause routing errors during tests
  beforeEach(module(function ($urlRouterProvider) {
      $urlRouterProvider.deferIntercept();
  }));
  beforeEach(inject(function ($injector) {
    tdata = $injector.get('teacherData');
    $httpBackend = $injector.get('$httpBackend');
    $rScope = $injector.get('$rootScope');

    $httpBackend.when('GET', $rScope.serverURL + '/api/teachers/getTeacherData')
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

    xit('should return copies of property values, not the values themselves', function() {
      var classObj = {name:'Math 53'};
      tdata.set('currentClass', classObj);
      expect(tdata.get('currentClass')).to.not.equal(classObj);
    });

    it('should fetch teacher data from a server and update local copy', function() {
      $httpBackend.expectGET($rScope.serverURL + '/api/teachers/getTeacherData');
      tdata.update().then(function() {
        expect(tdata.get('name')).to.equal('Mr. Teacher');
      });
      $httpBackend.flush();
    });

    it('should mark data as loading while waiting for request to finish', function() {
      $httpBackend.expectGET($rScope.serverURL + '/api/teachers/getTeacherData');
      tdata.update();
      expect(tdata.get('loading')).to.equal(true);
      $httpBackend.flush();
    });

    it('should mark data as loaded when request is finished', function() {
      $httpBackend.expectGET($rScope.serverURL + '/api/teachers/getTeacherData');
      tdata.update().then(function() {
        expect(tdata.get('loaded')).to.equal(true);
      });
      $httpBackend.flush();
    });
  });
});

describe('Queup Factory', function() {

  var queup, $httpBackend, response;

  beforeEach(module('queup'));
  beforeEach(inject(function($injector) {
    queup = $injector.get('queupFactory');
    $httpBackend = $injector.get('$httpBackend');
  }));

  describe('queupFactory functions', function() {
    it('should have a addNewClass function', function() {
      expect(queup.addNewClass).to.be.a('function');
    });

    // it('should add a class', function(){
    //   $httpBackend.expectPOST($rScope.serverURL + '/api/teachers/addClass', '{"classTitle":"class name"}').respond(201, 'OK')      
    //   queup.addNewClass('class name').then(function(data){
    //     expect(data.data).to.equal('OK');
    //   })
    //   $httpBackend.flush();
    // })
  });
});

// describe('Socket Factory', function() {

//   var socket;

//   beforeEach(module('queup'));
//   beforeEach(inject(function ($injector) {
//     socket = $injector.get('socket');
//   }));

//   describe('socket factory functionality', function() {


//     it("should emit and call its call back", function(){
//       // var callback = sinon.spy();
//       // var proxy = queup.addNewClass(callback);
//       // var className = "testing class";

//       // proxy.call()

//       // assert(callback.called);
//     });
//   })
// });



