angular.module('cecamOp.controllers')

.controller('EntradasCtrl', function($scope, $ionicModal, Operacao, Produto) {

  // retrieve all operations
  Operacao.list({
      tipo: 'entrada'
    })
    .then(function (response) {
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

    if (!$scope.novoProduto.descricao) {
      alert('Descrição é um campo obrigatório');
      return;
    }

    Produto.create({
      descricao: $scope.novoProduto.descricao
    })
    .then(function (response) {

      var produto = response.data;

      // add the product to the produtosRegistrados array
      $scope.produtosRegistrados.push(produto);
      // set the selected product of the new entry as the
      // just created product
      $scope.novaEntrada.produtoId = produto._id;

      // TODO: make the newly created product the selected one on the UI

      $scope.modalNovoProduto.hide();

      // reset the values of the form
      $scope.novoProduto = {};

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

        var produto = response.data;

        if (!produto) { throw new Error('produto nao encontrado'); }

        produto.validade = $scope.novaEntrada.validade;

        var operacaoData = {
          produto: produto,
          quantidade: $scope.novaEntrada.quantidade,
          unidadeDeMedida: $scope.novaEntrada.unidadeDeMedida,
          tipo: 'entrada',
        };

        return Operacao.create(operacaoData);
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

  };

  /// NOVA ENTRADA ///
  ////////////////////

})

.controller('EntradaDetalhamentoCtrl', function ($scope, $stateParams, Operacoes) {
  $stateParams.entradaId;

  $scope.entrada = Operacoes.$getRecord($stateParams.entradaId);
});