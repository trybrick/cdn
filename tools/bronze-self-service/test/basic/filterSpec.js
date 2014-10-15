/**
 * Created by eschmit on 10/15/2014.
 */
//this is just me learning to unit test angular
//http://angular-tips.com/blog/2014/04/introduction-to-unit-test-filters/

describe('filter: upper', function(){

  var upperFilter;

  beforeEach(module('bronzeApp'));  //load the app module

  beforeEach(inject(function(_upperFilter_){  //this naming is convention <name-of-filter>Filter
    upperFilter = _upperFilter_;
  }));

  it('should uppercase output', function(){
    expect(upperFilter('hello')).toBe('HELLO');
    expect(upperFilter('hello world')).toBe('HELLO WORLD');
  });

  it('can uppercase just the first x characters of an input', function() {
    expect(upperFilter('hello', 4)).toBe('HELLo');
    expect(upperFilter('hello world', 5)).toBe('HELLO world');
  });

  it('can uppercase the last x characters of an input', function() {
    expect(upperFilter('hello', -2)).toBe('helLO');
    expect(upperFilter('hello world', -5)).toBe('hello WORLD');
  });
});