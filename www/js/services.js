angular.module('cecamOp.services', [])

.factory('Operacao', function ($http) {
  return {
    list: function (query) {

      console.log(query);
      return $http.get('http://localhost:4000/estoque/operacoes', {
        params: {
          dbQuery: query
        }
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
        params: {
          dbQuery: query
        }
      })
      .then(function (response) {
        return response.data;
      });
    },

    groupByDate: function (query) {
      return $http.get('http://localhost:4000/estoque/distribuicao/groupByDate', {
          params: {
            dbQuery: query
          }
        })
        .then(function (response) {
          return response.data;
        });
    },

    groupByReceptor: function (query) {
      return $http.get('http://localhost:4000/estoque/distribuicao/groupByReceptor', {
          params: {
            dbQuery: query
          }
        })
        .then(function (response) {
          return response.data;
        });
    },

    groupByDateAndReceptor: function (query) {
      return $http.get('http://localhost:4000/estoque/distribuicao/groupByDateAndReceptor', {
          params: {
            dbQuery: query
          }
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
});
