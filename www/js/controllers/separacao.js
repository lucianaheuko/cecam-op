angular.module('cecamOp.controllers')


.controller('SeparacaoDataCtrl', function($scope, Distribuicao) {

  Distribuicao.groupByDate()
    .then(function (distAggregates) {
      $scope.datas = distAggregates;
    });

  $scope.computeDistribuicaoAggregateStatus = Distribuicao.computeDistribuicaoAggregateStatus;
})

.controller('SeparacaoDistribuicoesCtrl', function($scope, $stateParams, Distribuicao) {

  Distribuicao.groupByReceptor({
    dataDeRetirada: new Date($stateParams.dataDate) 
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
    dataDeRetirada: $stateParams.dataDeRetirada
  })
  .then(function (distribuicoes) {
    $scope.distribuicoes = distribuicoes;

    console.log(distribuicoes);
  });

  // $scope.distribuicoes = [
  // {
  //   id: 0,
  //   name: 'Carmo',
  //   date: '3 marc 2016',
  //   descricao: 'leite',
  //   validade: '30 Nov 2016',
  //   quantidade: '30',
  //   unidadeDeMedida: 'cx'
  // }, {
  //   id: 1,
  //   name: 'Carmo',
  //   date: '3 marc 2016',
  //   descricao: 'achocolatado em pó',
  //   validade: '04 Abr 2016',
  //   quantidade: '90',
  //   unidadeDeMedida: 'cx'
  // }, {
  //   id: 2,
  //   name: 'Carmo',
  //   date: '3 marc 2016',
  //   descricao: 'biscoito club social sabor parmesão',
  //   validade: '03 Jun 2016',
  //   quantidade: '37',
  //   unidadeDeMedida: 'cx'
  // }];

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