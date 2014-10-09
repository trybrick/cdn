/**
 * Created by eschmit on 9/22/2014.
 */
describe('my tests', function(){

  beforeEach(module('bronzeApp'));

  it('should be true', function(){
    expect(true).toBe(true);
  });

  var scope, ctrl;

  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    ctrl = $controller('actionsCtrl', {
      $scope : scope
    });
  }));
})
