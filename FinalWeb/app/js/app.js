'use strict';

/**
 * De module van de website, Dit is de "root" van alles ondergaande
 * Hier worden uitgaande libraries geinclude en zo kan de rest van de website de functionaliteiten gebruiken
 * De routes naar de verschillende pagina's worden hier gedecladeerd.
 */
angular.module('myApp',
      ['myApp.config', 'myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'firebase', 'ngRoute', 'waitForAuth']
   )

   .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/order', {
         templateUrl: 'partials/order.html',
         controller: 'OrderCtrl'
      });

      $routeProvider.when('/club', {
          authRequired: true,
          templateUrl: 'partials/club.html',
         controller: 'ClubCtrl'
      });

      $routeProvider.when('/menu', {
         authRequired: true,
         templateUrl: 'partials/menu.html',
         controller: 'MenuCtrl'
      });

      $routeProvider.when('/login', {
         templateUrl: 'partials/login.html',
         controller: 'LoginCtrl'
      });
        $routeProvider.when('/logout',{
            $routeProvider :'/login',
            templateUrl:'partials/login.html',
            controller:'LoginCtrl'
        });

      $routeProvider.otherwise({redirectTo: '/login'});
   }])


   // establish authentication
   .run(['loginService', '$rootScope', 'FBURL', function(loginService, $rootScope, FBURL) {
      if( FBURL === 'https://INSTANCE.firebaseio.com' ) {
         // double-check that the app has been configured
         angular.element(document.body).html('<h1>Please configure app/js/config.js before running!</h1>');
         setTimeout(function() {
            angular.element(document.body).removeClass('hide');
         }, 250);
      }
      else {
         $rootScope.auth = loginService.init('/login');
         $rootScope.FBURL = FBURL;
      }
   }]);