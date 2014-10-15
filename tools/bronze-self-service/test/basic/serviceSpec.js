/**
 * Created by eschmit on 10/15/2014.
 */
describe('testing services', function(){

  var fontService;

  beforeEach(module('bronzeApp'));

  beforeEach(inject(function(_fontService_){

    fontService = _fontService_;
  }));

  it('first expected font', function(){

    expect(fontService.get().length > 0);
  });

  it('first expected font is <arial>', function(){

    expect(fontService.get()[0].value).toBe('Arial');
  });

  it('last expected font is <brush script>', function(){

    var data = {};
    var count = 0;

    data = fontService.get();
    count = data.length;

    expect(data[count-1].value).toBe('Brush Script MT');
  });
});
