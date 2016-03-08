angular.module('cecamOp.services', [])

.factory('Operacoes', function($firebaseArray) {


  var itemsRef = new Firebase("https://cecam.firebaseio.com/Operacoes");
  return $firebaseArray(itemsRef);
})

.factory('Operacao', function ($http) {
  return {
    list: function (query) {
      return $http.get('http://localhost:4000/estoque/operacoes', {
        data: query
      });
    },

    create: function (data) {
      return $http.post('http://localhost:4000/estoque/operacao', data);
    }
  };
})

.factory('Produto', function ($http) {
  return {
    get: function (produtoId) {
      return $http.get('http://localhost:4000/estoque/produto/' + produtoId);
    },

    list: function () {
      return $http.get('http://localhost:4000/estoque/produtos');
    },

    create: function (data) {
      return $http.post('http://localhost:4000/estoque/produto', data);
    }
  }
})


.factory('Distribuicoes', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var distribuicoes = [{
    id: 0,
    name: 'Carmo',
    date: '3 marc 2016',
    status: 'a separar'
  }, {
    id: 1,
    name: 'Itaquera',
    date: '4 marc 2016',
    status: 'separando...'
  }, {
    id: 2,
    name: 'Santos',
    date: '4 marc 2016',
    status: 'pronto para retirar'
  }, {
    id: 3,
    name: 'Carmo',
    date: '4 marc 2016',
    status: 'a separar'
  }];

  return {
    all: function() {
      return distribuicoes;
    },
    remove: function(distribuicao) {
      distribuicoes.splice(distribuicoes.indexOf(distribuicao), 1);
    }
  };
})

.factory('Datas', function() {
  var datas = [{
    id: 0,
    date: 'dia3'
  }, {
    id: 1,
    date: 'dia4'
  }, {
    id: 2,
    date: 'dia5'
  }, {
    id: 3,
    date: 'dia6'
  }];

  return {
    all: function() {
      return datas;
    },
    get: function(dataId) {
      for (var i = 0; i < datas.length; i++) {
        if (datas[i].id === parseInt(dataId)) {
          return datas[i];
        }
      }
      return null;
    }
  };
});


