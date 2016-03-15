angular.module('cecamOp.controllers')


.controller('SeparacaoDataCtrl', function($scope, Distribuicao) {

  Distribuicao.groupByDate()
    .then(function (dates) {
      $scope.datas = dates;
    });

  // $scope.datas = Datas.all();
})

.controller('SeparacaoDistribuicoesCtrl', function($scope, $stateParams, Distribuicao) {

  Distribuicao.list({
    dataDeRetirada: new Date($stateParams.dataDate)
  })
  .then(function (res) {
    $scope.distribuicoes = res;
  })

  $scope.dataDate = $stateParams.dataDate;
})

.controller('SeparacaoDetailCtrl', function($scope, $stateParams, Distribuicoes, $state, Distribuicao) {
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
  })

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
    $state.go('tab.separacao-distribuicoes');
  };
});