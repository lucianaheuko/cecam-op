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
      return $http.post('http://localhost:4000/estoque/operacao', data)
        .then(function (response) {
          return response.data;
        });
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

.factory('Estoque', function ($http) {
  return {
    registerDelivery: function (distribuicaoId) {
      return $http.post('http://localhost:4000/estoque/saida', {
        distribuicao: {
          _id: distribuicaoId
        }
      })
      .then(function (response) {
        return response.data;
      });
    }
  }
})


.factory('Distribuicao', function ($http) {
  return {
    create: function (data) {
      return $http.post('http://localhost:4000/estoque/distribuicao', data)
        .then(function (response) {
          return response.data;
        });
    },

    update: function (distId, distData) {
      return $http.put('http://localhost:4000/estoque/distribuicao/' + distId, distData)
        .then(function (response) {
          return response.data;
        });
    },

    list: function (query) {
      return $http.get('http://localhost:4000/estoque/distribuicoes', {
        params: query
      })
      .then(function (response) {
        return response.data;
      });
    },

    groupByDate: function (query) {
      return $http.get('http://localhost:4000/estoque/distribuicao/groupByDate', {
          params: query
        })
        .then(function (response) {
          return response.data;
        });
    },

    groupByReceptor: function (query) {
      return $http.get('http://localhost:4000/estoque/distribuicao/groupByReceptor', {
          params: query
        })
        .then(function (response) {
          return response.data;
        });
    },

    groupByDateAndReceptor: function (query) {
      return $http.get('http://localhost:4000/estoque/distribuicao/groupByDateAndReceptor', {
          params: query
        })
        .then(function (response) {
          return response.data;
        });
    },

    /**
     * Computes the virtual status of a group of distributions
     * @param  {Object} distAggregate
     * @return {String}
     */
    computeDistribuicaoAggregateStatus: function (distAggregate) {

      var hasASepararStatus = distAggregate.statuses.indexOf('a-separar') > -1;
      var hasSeparadoStatus = distAggregate.statuses.indexOf('separado') > -1;

      if (hasASepararStatus && hasSeparadoStatus) {
        // mixed statuses
        return 'separando';
      } else if (hasASepararStatus) {
        // only a-separar
        return 'a-separar';
      } else if (hasSeparadoStatus) {
        // only separado
        return 'separado';
      } else {
        // default fallback
        return '-';
      }
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
