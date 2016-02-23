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

.controller('SeparacaoCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
