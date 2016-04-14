angular.module('cecamOp.controllers')

.controller('EntradasCtrl', function($scope, $ionicModal, $ionicPopup, $timeout, $rootScope, $filter, Operacao, Produto) {
  // set today's date onto the scope
  $scope.today = new Date();

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
    focusFirstInput: true,
  })
  .then(function (modal) {
    $scope.modalNovaEntrada = modal;
  });

  $ionicModal.fromTemplateUrl('templates/novo-produto.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true,
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

      $timeout(function () {
        // set the selected product of the new entry as the
        // just created product
        // wait for changes to be applied before
        // setting value
        $scope.novaEntrada.produtoId = produto._id;
      }, 0);
      
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

    // run validations
    if (!$scope.novaEntrada.produtoId || $scope.novaEntrada.produtoId === '__new__') {
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

    if (!$scope.novaEntrada.unidadeDeMedida) {
      alert('Por favor insira a unidade de medida');
      return;
    }

    // retrieve the selected product
    Produto.get($scope.novaEntrada.produtoId)
      .then(function (response) {

        var produto = response.data;

        if (!produto) { throw new Error('produto nao encontrado'); }

        produto.validade = $scope.novaEntrada.validade;

        var entradaData = {
          produto: produto,
          quantidade: $scope.novaEntrada.quantidade,
          unidadeDeMedida: $scope.novaEntrada.unidadeDeMedida,
          tipo: 'entrada',
        };

        var template = [
          '<div class="list card">',
            '<div class="item">',
              '<label>produto</label>',
              '<h2>' + entradaData.produto.descricao + '</h2>',
            '</div>',
            '<div class="item">',
              '<label>validade</label>',
              '<h2>',
                $filter('date')(new Date(entradaData.produto.validade), 'dd \'de\' MMMM yyyy'),
              '</h2>',
            '</div>',
            '<div class="item">',
              '<label>quantidade</label>',
              '<h2>' + entradaData.quantidade + ' ' + entradaData.unidadeDeMedida + '</h2>',
            '</div>',
          '</div>'
        ].join('');

        return $ionicPopup.confirm({
          title: 'Confirmar entrada', // String. The title of the popup.
          // cssClass: '', // String, The custom CSS class name
          subTitle: 'Por favor verifique se os seguintes dados estão corretos', // String (optional). The sub-title of the popup.
          template: template, // String (optional). The html template to place in the popup body.
          cancelText: 'Cancelar', // String (default: 'Cancel'). The text of the Cancel button.
          cancelType: '', // String (default: 'button-default'). The type of the Cancel button.
          okText: 'Confirmar', // String (default: 'OK'). The text of the OK button.
          okType: '', // String (default: 'button-positive'). The type of the OK button.
        })
        .then(function (confimed) {
          if (confimed) {
            // operacao creation here
            return Operacao.create(entradaData)
              .then(function (entrada) {

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
                console.warn(err);
              });
          } else {
            // entrada cancelada
            console.log('entrada cancelada')
          }
        })
      });

  };

  /// NOVA ENTRADA ///
  ////////////////////

})

.controller('EntradaDetalhamentoCtrl', function ($scope, $stateParams, Operacoes) {
  $stateParams.entradaId;

  $scope.entrada = Operacoes.$getRecord($stateParams.entradaId);
});