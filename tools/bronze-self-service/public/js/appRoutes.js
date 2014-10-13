var app = angular.module('bronzeApp');

app.config(function($routeProvider, $locationProvider){

	$routeProvider

    .when('/', {
      templateUrl: 'views/look-n-feel.html',
      controller: 'looknfeelCtrl'
    })
    .when('/look', {
      templateUrl: 'views/look-n-feel.html',
      controller: 'looknfeelCtrl'
    })
    .when('/footer', {
      templateUrl: 'views/footer.html',
      controller: 'footerCtrl'
    })
    .when('/navigation', {
      templateUrl: 'views/navigation.html',
      controller: 'navigationCtrl'
    })
    .when('/actions', {
      templateUrl: 'views/actions.html',
      controller: 'actionsCtrl'
    });

	$locationProvider.html5Mode(true);
});