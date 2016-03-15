angular.module('cecamOp.controllers')

.controller('SaidaCtrl', function($scope, Distribuicao) {
  Distribuicao.groupByDateAndReceptor({
    status: 'separado'
  })
  .then(function (distAggregates) {
    $scope.saidas = distAggregates;
  });
})

.controller('SaidaDetailCtrl', function($scope, $stateParams, Distribuicao, Estoque, $q, $ionicHistory) {

  var receptorName = $stateParams.receptorName;
  var receptorId = $stateParams.receptorId;
  var dataDeRetirada = $stateParams.dataDeRetirada;

  $scope.receptorName = receptorName;
  $scope.dataDeRetirada = dataDeRetirada;

  Distribuicao.list({
    'receptor._id': receptorId,
    dataDeRetirada: dataDeRetirada,
    status: 'separado'
  })
  .then(function (distribuicoes) {
    console.log(distribuicoes);
    $scope.saidas = distribuicoes;
  });

  $scope.saveDelivery = function () {


    // check that all items are delivered
    var allSaidasDelivered = true;

    $scope.saidas.forEach(function (saida) {
      if (saida.status !== 'retirado') {
        allSaidasDelivered = false;
      }
    });

    if (allSaidasDelivered) {

      $q.all($scope.saidas.map(function (saida) {
        return Estoque.registerDelivery(saida._id);
      }))
      .then(function () {
        alert('saida efetivada com sucesso');

        $ionicHistory.goBack();
      });

    } else {
      alert('Por favor confirme a saída de todos os items');
    }
  };

  $scope.cancel = function () {
    $ionicHistory.goBack();
  }
});

