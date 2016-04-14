angular.module('cecamOp.controllers', [])

.controller('AppCtrl', function ($rootScope, $ionicLoading) {

  $rootScope.$watch('isLoading', function () {
    if ($rootScope.isLoading) {
      $ionicLoading.show();
    } else {
      $ionicLoading.hide();
    }
  });
});