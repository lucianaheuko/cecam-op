// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'cecamOp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'cecamOp.services' is found in services.js
// 'cecamOp.controllers' is found in controllers.js
angular.module('cecamOp', [
  'ionic',
  'cecamOp.controllers',
  'cecamOp.services',
  'cecamOp.filters',
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.entradas', {
    url: '/entradas',
    views: {
      'tab-entradas': {
        templateUrl: 'templates/entradas.html',
        controller: 'EntradasCtrl'
      }
    }
  })

  .state('tab.entrada-detalhamento', {
    url: '/entradas/:entradaId',
    views: {
      'tab-entradas': {
        templateUrl: 'templates/entrada-detalhamento.html',
        controller: 'EntradaDetalhamentoCtrl',
      }
    }
  })

  .state('tab.separacao', {
    url: '/separacao',
    views: {
      'tab-separacao': {
        templateUrl: 'templates/tab-separacao.html',
        controller: 'SeparacaoDataCtrl'
      }
    }
  })

  .state('tab.separacao-distribuicoes', {
    url: '/separacao/:dataDate',
    views: {
      'tab-separacao': {
        templateUrl: 'templates/separacao-distribuicoes.html',
        controller: 'SeparacaoDistribuicoesCtrl'
      }
    }
  })

  .state('tab.separacao-detalhamento', {
    url: '/separacao/:dataDeRetirada/:receptorId/:receptorName',
    views: {
      'tab-separacao': {
        templateUrl: 'templates/separacao-detalhamento.html',
        controller: 'SeparacaoDetailCtrl'
      }
    }
  })

  .state('tab.saida', {
    url: '/saida',
    views: {
      'tab-saida': {
        templateUrl: 'templates/tab-saida.html',
        controller: 'SaidaCtrl'
      }
    }
  })

  .state('tab.saida-detalhamento', {
    url: '/saida/:dataDeRetirada/:receptorId/:receptorName',
    views: {
      'tab-saida': {
        templateUrl: 'templates/saida-detalhamento.html',
        controller: 'SaidaDetailCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/entradas');

})

// http interceptor that shows loading indicator on ajax request
.config(['$httpProvider', function($httpProvider) {

  // alternatively, register the interceptor via an anonymous factory
  $httpProvider.interceptors.push(function($q, $rootScope) {
    return {
      request: function(config) {

        $rootScope.isLoading = true;

        return config;
      },

      // optional method
      requestError: function(rejection) {
        // do something on error
        
        $rootScope.isLoading = false;

        return $q.reject(rejection);
      },

      response: function(response) {

        $rootScope.isLoading = false;

        // same as above
        return response;
      },

      // optional method
      responseError: function(rejection) {
        // do something on error
        $rootScope.isLoading = false;

        return $q.reject(rejection);
      }
    };
  });
}]);

