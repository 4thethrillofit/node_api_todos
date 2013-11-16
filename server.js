var express = require('express');
var mongoskin = require('mongoskin');
var app = express();
app.use(express.bodyParser());
var db = mongoskin.db('localhost:27017/testTodoList', {safe:true});

app.param('listName', function(req, res, next, listName){
  req.collection = db.collection(listName);
  return next();
});

// sending a message to user if the user does not request a specific resource
app.get('/', function(req, res){
  res.send('please select a collection, e.g., /todos/messages');
});

// GET a specific todoList collection
app.get('/todos/:listName', function(req, res){
  req.collection.find({}, {limit: 10, sort: [['_id', -1]]}).toArray(function(err, results){
    if(err) return next(err);
    res.send(results);
  });
});

// GET a todo item
app.get('/todos/:listName/:id', function(req, res){
  req.collection.findOne({_id: req.collection.id(req.params.id)}, function(err, result){
    if(err) return next(err);
    res.send(result);
  });
});

// POST a new todo item
app.post('/todos/:listName', function(req, res){
  req.collection.insert(req.body, {}, function(err, results){
    if(err) return next(err);
    res.send(results);
  });
});

// PUT existing todo item
// in Mongo, PUT returns a count of affected objects
// {$set:req.body} is special Mongo operator that sets values
// {safe:true, multi:false} tells Mongo to wait for execution b4 running callback and
// to process only one item.
app.put('/todos/:listName/:id', function(req, res){
  req.collection.update({_id: req.collection.id(req.params.id)}, {$set:req.body}, {safe:true, multi:false}, function(err, result){
    if(err) return next(err);
    res.send(
      result === 1 ? {msg: 'success'} : {msg: 'error:' + err}
    );
  });
});

// Start the Node server
var server = app.listen(3000);
console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
