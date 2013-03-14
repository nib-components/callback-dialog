describe('Callback Form', function(){
  var Form = require('callback-dialog').Form;

  beforeEach(function(){
    this.view = new Form({
      el: $('<div/>')
    });
  });

  it('should validate phone numbers correctly', function(){
    var isPhone = this.view.validates.PhoneNumber;
    expect(isPhone('1')).to.equal(false);
    expect(isPhone('1234567')).to.equal(false);
    expect(isPhone('12345678')).to.equal(false);
    expect(isPhone('123456789')).to.equal(false);
    expect(isPhone('12 3456 7890')).to.equal(false);
    expect(isPhone('0422 222 222')).to.equal(true);
  });

});