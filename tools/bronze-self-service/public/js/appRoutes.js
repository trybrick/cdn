var app = angular.module('bronzeApp');

app.config(function($routeProvider, $locationProvider){

	$routeProvider

    .when('/', {
      templateUrl: 'footer/footer.html',
      controller: 'footerCtrl'
    })
    .when('/look', {
      templateUrl: 'looknfeel/look-n-feel.html',
      controller: 'looknfeelCtrl'
    })
    .when('/footer', {
      templateUrl: 'footer/footer.html',
      controller: 'footerCtrl'
    })
    .when('/navigation', {
      templateUrl: 'navigation/navigation2.html',
      controller: 'navigationCtrl'
    })
    .when('/actions', {
      templateUrl: 'actions/actions.html',
      controller: 'actionsCtrl'
    });

	$locationProvider.html5Mode(true);
});