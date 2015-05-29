describe('Teacher Data Factory', function() {
  var tData;
  beforeEach(module('queup'));
  beforeEach(inject(function (_teacherData_) {
    tdata = _teacherData_;
  }));

  describe('methods', function() {
    it('should have a get function', function() {
      expect(tdata.get).to.be.a('function');
    });

    it('should have a set function', function() {
      expect(tdata.set).to.be.a('function');
    })

    it('should be able to modify currentClass property', function() {
      tdata.set('currentClass', {name: 'Class Name'});
      expect(tdata.get('currentClass').name).to.equal('Class Name');
    })
  });
});