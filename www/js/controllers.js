var _data = [
  {
    id: 0,
    name: 'Carmo',
    date: '3 marc 2016',
    produtos: [
      {
        descricao: 'achocolatado em pó',
        validade: '04 Abr 2016',
        quantidade: '90',
        unidadeDeMedida: 'cx'
      },
      {
        descricao: 'leite',
        validade: '30 Nov 2016',
        quantidade: '30',
        unidadeDeMedida: 'cx'
      }
    ]
  }, {
    id: 1,
    name: 'Itaquera',
    date: '3 marc 2016',
    descricao: 'leite',
    validade: '30 Nov 2016',
    quantidade: '30',
    unidadeDeMedida: 'cx'
  }, {
    id: 2,
    name: 'Santos',
    date: '3 marc 2016',
    descricao: 'leite',
    validade: '30 Nov 2016',
    quantidade: '30',
    unidadeDeMedida: 'cx'
  }];

var db = {
  listAll: function () {
    return _data;
  },

  getById: function (requestedId) {
    return _data.find(function (item) {
      return item.id == requestedId;
    });
  },

  // getById: function (requestedId) {

  //   return new Promise(function (resolve, reject) {

  //     setTimeout(function () {

  //       resolve(_data.find(function (item) {
  //         return item.id === requestedId;
  //       }));

  //     }, 2000);
  //   });
  // }
};

angular.module('cecamOp.controllers', [])


.controller('EntradasCtrl', function($scope, $ionicModal, Operacoes) {

  $scope.operacoes = Operacoes;

  // create an $ionic modal instance and attach it to the scope
  // so that other functions may use the modal
  $ionicModal.fromTemplateUrl('templates/nova-entrada.html', {
    scope: $scope,
    animation: 'slide-in-up',
  })
  .then(function (modal) {
    $scope.modal = modal;
  });

  // Define an object to hold the form input values
  $scope.novaEntrada = {
    descricao: '',
    validade: '',
    quantidade: '',
    unidadeDeMedida: 'cx',
  };

  $scope.openNovaEntradaModal = function () {
    $scope.modal.show();
  };

  $scope.createEntrada = function () {

    $scope.isLoading = true;

    // run validations
    if (!$scope.novaEntrada.descricao) {
      alert('Descrição é um campo obrigatório');
      return;
    }

    if (!$scope.novaEntrada.validade) {
      alert('Por favor insira a validade do produto');
      return;
    }

    if ($scope.novaEntrada.validade < Date.now()) {
      alert('O produto está vencido');
      return;
    }

    if (!$scope.novaEntrada.quantidade) {
      alert('Por favor insira a quantidade');
      return;
    }

    Operacoes.$add({
      descricao: $scope.novaEntrada.descricao,
      validade: $scope.novaEntrada.validade.getTime(),
      quantidade: $scope.novaEntrada.quantidade,
      unidadeDeMedida: $scope.novaEntrada.unidadeDeMedida,
    })
    .then(function (ref) {

      $scope.isLoading = false;

      // reset the novaEntrada's data
      $scope.novaEntrada = {
        descricao: '',
        validade: '',
        quantidade: '',
        unidadeDeMedida: 'cx',
      };

      // close the modal
      $scope.modal.hide();
    }, function (err) {
      $scope.isLoading = false;

      console.warn(err);
    });
  };

})

.controller('EntradaDetalhamentoCtrl', function ($scope, $stateParams, Operacoes) {
  $stateParams.entradaId;

  $scope.entrada = Operacoes.$getRecord($stateParams.entradaId);
})

.controller('SeparacaoDataCtrl', function($scope, Datas) {
  $scope.datas =  Datas.all();
})

.controller('SeparacaoDistribuicoesCtrl', function($scope, Distribuicoes, $stateParams) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.distribuicoes = Distribuicoes.all();

  $scope.dataDate = $stateParams.dataDate;
})

.controller('SeparacaoDetailCtrl', function($scope, $stateParams, Distribuicoes, $state) {
  $scope.distribuicaoName = $stateParams.distribuicaoName;
  $scope.distribuicaoDate = $stateParams.distribuicaoDate;
  $scope.distribuicoes = [
  {
    id: 0,
    name: 'Carmo',
    date: '3 marc 2016',
    descricao: 'leite',
    validade: '30 Nov 2016',
    quantidade: '30',
    unidadeDeMedida: 'cx'
  }, {
    id: 1,
    name: 'Carmo',
    date: '3 marc 2016',
    descricao: 'achocolatado em pó',
    validade: '04 Abr 2016',
    quantidade: '90',
    unidadeDeMedida: 'cx'
  }, {
    id: 2,
    name: 'Carmo',
    date: '3 marc 2016',
    descricao: 'biscoito club social sabor parmesão',
    validade: '03 Jun 2016',
    quantidade: '37',
    unidadeDeMedida: 'cx'
  }];

  $scope.cancel = function () {
    $state.go('tab.separacao-distribuicoes');
  };
})

.controller('SaidaCtrl', function($scope) {
  $scope.saidas = db.listAll();

})

.controller('SaidaDetailCtrl', function($scope, $stateParams) {

  $scope.resultado = db.getById($stateParams.saidaId);

});
