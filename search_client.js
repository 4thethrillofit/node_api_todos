var ElasticSearchClient = require('elasticsearchclient');
var keys = require('./keys');

var titleBoostValue = 2;
var serverOptions = {
  host: 'api.searchbox.io',
  port: 80,
  secure: false,
  auth: {
    username: 'site',
    password: keys.searchlyApiKey
  }
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

elasticSearchClient.buildQueryObj = function(query) {
  var queryObj = {
    'query': {
      "multi_match" : {
        "query" : query,
        "fields" : [ "title^"+titleBoostValue, "body"  ]
      }
    }
  }
  return queryObj;
};

module.exports.SearchClient = elasticSearchClient;
