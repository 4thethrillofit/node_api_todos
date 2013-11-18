var ElasticSearchClient = require('elasticsearchclient');
var keys = require('./keys');

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

module.exports.SearchClient = elasticSearchClient;
