/**
 * Created by eschmit on 9/22/2014.
 */
describe('my tests', function(){

  var scope, ctrl;

  beforeEach(module('bronzeApp'));

  beforeEach(inject(function(_$controller_, _$rootScope_){

    $rootScope = _$rootScope_;
    $controller = _$controller_;

    $scope = $rootScope.$new();

    ctrl = $controller('actionsCtrl', {
      $scope : $scope
    });
  }));

  it('should be true', function(){
    expect(true).toBe(true);
  });

  it('should have actions data', function(){
    expect($scope.data.length > 0);
    expect($scope.chain.length > 0);
    expect($scope.chain[0].value == '7');
  })
})
