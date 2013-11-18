var express = require('express');
var mongoskin = require('mongoskin');
var app = express();
var db = mongoskin.db('localhost:27017/testTodoList', {safe:true});
var SearchClient = require('./search_client').SearchClient;

var _index = 'todos';
var _type = 'document';

app.use(express.bodyParser());
app.param('listName', function(req, res, next, listName){
  req.collection = db.collection(listName);
  return next();
});

// sending a message to user if the user does not request a specific resource
app.get('/', function(req, res){
  res.send('please select a todo list, e.g., /v1/lists/test-todo-list');
});

// GET a specific todoList collection
app.get('/v1/lists/:listName/todos', function(req, res){
  req.collection.find({}, {limit: 10, sort: [['_id', -1]]}).toArray(function(err, results){
    if(err) return next(err);
    res.send(results);
  });
});

// for specific field, do q=title:test
app.get('/v1/lists/:listName/search', function(req, res){
  var queryObj = SearchClient.buildQueryObj(req.query.q);
  SearchClient.search(_index, _type, queryObj)
  .on('data', function(data){
    console.log("DATA")
    var results = JSON.parse(data).hits.hits.map(function(hit){ return hit._source });
    res.send(results)
  })
  .on('error', function(err){
    console.log(err);
    res.send(err);
  }).exec();
})

// GET a todo item
app.get('/v1/lists/:listName/todos/:id', function(req, res){
  req.collection.findOne({_id: req.collection.id(req.params.id)}, function(err, result){
    if(err) return next(err);
    res.send(result);
  });
});

// POST a new todo item
app.post('/v1/lists/:listName/todos', function(req, res){
  req.collection.insert(req.body, {}, function(err, results){
    if(err) return next(err);
    res.statusCode = 201;
    res.send(results);
  });
});

// PUT existing todo item
// in Mongo, PUT returns a count of affected objects
// {$set:req.body} is special Mongo operator that sets values
// {safe:true, multi:false} tells Mongo to wait for execution b4 running callback and
// to process only one item.
// NOT giving a status code of 204 here since we are returning a message. Same goes for DELET
app.put('/v1/lists/:listName/todos/:id', function(req, res){
  req.collection.update({_id: req.collection.id(req.params.id)}, {$set:req.body}, {safe:true, multi:false}, function(err, result){
    if(err) return next(err);
    res.send(
      result === 1 ? {msg: 'success'} : {msg: 'error:' + err}
    );
  });
});

// PUT route for marking an item DONE or UNDEON
app.put('/v1/lists/:listName/todos/:id/done', function(req, res){
  req.collection.update({_id: req.collection.id(req.params.id)}, {$set:{done: true}}, {safe:true, multi:false}, function(err, result){
    if(err) return next(err);
    res.send(
      result === 1 ? {msg: 'success'} : {msg: 'error:' + err}
    );
  });
})

app.put('/v1/lists/:listName/todos/:id/undone', function(req, res){
  req.collection.update({_id: req.collection.id(req.params.id)}, {$set:{done: false}}, {safe:true, multi:false}, function(err, result){
    if(err) return next(err);
    res.send(
      result === 1 ? {msg: 'success'} : {msg: 'error:' + err}
    );
  });
});

// DELETE a todo item. DELETE performs similar to PUT in Mongo
app.del('/v1/lists/:listName/todos/:id', function(req, res){
  req.collection.remove({_id: req.collection.id(req.params.id)}, function(err, result){
    if(err) return next(err);
    res.send(
      result === 1 ? {msg: 'success'} : {msg: 'error:' + err}
    );
  });
});

// Start the Node server
var server = app.listen(3000);
console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
