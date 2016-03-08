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


.controller('EntradasCtrl', function($scope, $ionicModal, Operacao, Produto, Operacoes) {

  // retrieve all operations
  Operacao.list()
    .then(function (response) {
      console.log(response.data);
      $scope.operacoes = response.data;
    });

  // retrieve the list of registered products
  Produto.list()
    .then(function (response) {

      $scope.produtosRegistrados = response.data;
    });


  ////////////////////
  // MODAL CREATION //

  // create an $ionic modal instance and attach it to the scope
  // so that other functions may use the modal
  $ionicModal.fromTemplateUrl('templates/nova-entrada.html', {
    scope: $scope,
    animation: 'slide-in-up',
  })
  .then(function (modal) {
    $scope.modalNovaEntrada = modal;
  });

  $ionicModal.fromTemplateUrl('templates/novo-produto.html', {
    scope: $scope,
    animation: 'slide-in-up'
  })
  .then(function (modal) {
    $scope.modalNovoProduto = modal;
  });

  // MODAL CREATION //
  ////////////////////

  // Define an object to hold the form input values
  $scope.novaEntrada = {
    produtoId: '',
    validade: '',
    quantidade: '',
    unidadeDeMedida: 'cx',
  };

  $scope.$watch('novaEntrada.produtoId', function () {
    console.log($scope.novaEntrada.produtoId);

    var produtoId = $scope.novaEntrada.produtoId;

    if (produtoId === '__new__') {
      $scope.modalNovoProduto.show();
    } else {
      // do nothing
    }
  });

  ////////////////////
  /// NOVO PRODUTO ///
  $scope.novoProduto = {};
  
  $scope.openModalNovoProduto = function () {
    $scope.modalNovoProduto.show();
  };

  $scope.createProduto = function () {
    console.log('create');

    if (!$scope.novoProduto.descricao) {
      alert('Descrição é um campo obrigatório');
      return;
    }

    Produto.create({
      descricao: $scope.novoProduto.descricao
    })
    .then(function (response) {

      console.log(response);

      var produto = response.data;

      // add the product to the produtosRegistrados array
      $scope.produtosRegistrados.push(produto);

      console.log(produto._id);

      // set the selected product of the new entry as the
      // just created product
      $scope.novaEntrada.produtoId = produto._id;

      // TODO: make the newly created product the selected one on the UI

      $scope.modalNovoProduto.hide();

      return produto;
    });
  };

  /// NOVO PRODUTO ///
  ////////////////////


  ////////////////////
  /// NOVA ENTRADA ///
  $scope.novaEntrada = {};

  $scope.openNovaEntradaModal = function () {
    $scope.modalNovaEntrada.show();
  };

  $scope.createEntrada = function () {

    $scope.isLoading = true;

    // run validations
    if (!$scope.novaEntrada.produtoId) {
      alert('Produto é um campo obrigatório');
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

    // retrieve the selected product
    Produto.get($scope.novaEntrada.produtoId)
      .then(function (response) {

        console.log(response);
        console.log(response.data);

        var produto = response.data;

        if (!produto) { throw new Error('produto nao encontrado'); }

        return Operacao.create({
          produto: produto,
          quantidade: $scope.novaEntrada.quantidade,
          unidadeDeMedida: $scope.novaEntrada.unidadeDeMedida,
          tipo: 'entrada',
        });
      })
      .then(function (entrada) {

        $scope.isLoading = false;

        // reset the novaEntrada's data
        $scope.novaEntrada = {
          produtoId: '',
          validade: '',
          quantidade: '',
          unidadeDeMedida: 'cx',
        };

        // push the new entry to the entries array
        $scope.operacoes.unshift(entrada);

        // close the modal
        $scope.modalNovaEntrada.hide();
      }, function (err) {
        $scope.isLoading = false;

        console.warn(err);
      });

    // Operacao.create({
    //   produto: {

    //     descricao: $scope.novaEntrada.produto.descricao,
    //     validade: $scope.novaEntrada.produto.validade,
    //   },

    //   quantidade: $scope.novaEntrada.quantidade,
    //   unidadeDeMedida: $scope.novaEntrada.unidadeDeMedida,
    //   tipo: 'entrada',

    // })
    // // Operacoes.$add({
    // //   descricao: $scope.novaEntrada.descricao,
    // //   validade: $scope.novaEntrada.validade,
    // //   quantidade: $scope.novaEntrada.quantidade,
    // //   unidadeDeMedida: $scope.novaEntrada.unidadeDeMedida,
    // // })
  };

  /// NOVA ENTRADA ///
  ////////////////////

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
