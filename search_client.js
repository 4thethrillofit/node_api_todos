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

// TODO: Currently the index function does not automatically terminate after the process is finished.
elasticSearchClient.createBulkIndex = function(bulkDataArray, index, type){
  var _this = this;
  _this.createIndex(index, {}, {}).on('data', function(data){
    var commands = [];
    bulkDataArray.forEach(function(todoObj){
      commands.push({'index':{'_index': index, '_type': type, '_id': todoObj._id}});
      commands.push(todoObj);
    });
    _this.bulk(commands, {})
    .on('data', function(data){
      console.log("Indexed DB successfully! DATA:");
      console.log(data);
      return data;
    })
    .on('error', function(err){
      console.log("ERROR:");
      throw err;
    })
    .exec();
  })
  .on('data', function(data){
    console.log('finished index creation process')
    console.log(data);
    return data;
  })
  .on('error', function(err){
    console.log("ERROR:");
    throw err;
  }).exec();
  return;
};

module.exports.SearchClient = elasticSearchClient;
