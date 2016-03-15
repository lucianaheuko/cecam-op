angular.module('cecamOp.controllers')


.controller('SeparacaoDataCtrl', function($scope, Distribuicao) {

  Distribuicao.groupByDate({
      status: {
        $ne: 'retirado'
      }
    })
    .then(function (distAggregates) {
      $scope.datas = distAggregates;
    });

  $scope.computeDistribuicaoAggregateStatus = Distribuicao.computeDistribuicaoAggregateStatus;
})

.controller('SeparacaoDistribuicoesCtrl', function($scope, $stateParams, Distribuicao) {

  Distribuicao.groupByReceptor({
    dataDeRetirada: new Date($stateParams.dataDate),
    status: {
      $ne: 'retirado'
    }
  })
  .then(function (distAggregates) {
    $scope.distAggregates = distAggregates;
  });

  $scope.computeDistribuicaoAggregateStatus = Distribuicao.computeDistribuicaoAggregateStatus;

  $scope.dataDate = $stateParams.dataDate;
})

.controller('SeparacaoDetailCtrl', function($scope, $stateParams, $state, Distribuicao, $ionicHistory, $q) {
  $scope.receptorName = $stateParams.receptorName;

  $scope.receptorId = $stateParams.receptorId;
  $scope.dataDeRetirada = $stateParams.dataDeRetirada;


  Distribuicao.list({
    'receptor._id': $stateParams.receptorId,
    dataDeRetirada: $stateParams.dataDeRetirada,
    status: {
      $ne: 'retirado'
    }
  })
  .then(function (distribuicoes) {
    $scope.distribuicoes = distribuicoes;
  });

  $scope.cancel = function () {
    $ionicHistory.goBack();
  };

  $scope.save = function () {

    $q.all($scope.distribuicoes.map(function (dist) {
      return Distribuicao.update(dist._id, dist);
    }))
    .then(function () {
      $ionicHistory.goBack();
    }, function (err) {
      alert(err);
    });
  }
});