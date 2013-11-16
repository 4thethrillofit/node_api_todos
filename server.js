var express = require('express');
var mongoskin = require('mongoskin');
var app = express();
app.use(express.bodyParser());
var db = mongoskin.db('localhost:27017/test', {safe:true});

app.param('listName', function(req, res, next, listName){
  req.collection = db.collection(listName);
  return next();
});

app.get('/', function(req, res){
  res.send('please select a collection, e.g., /todos/messages');
});

app.get('/todos/:listName', function(req, res){
  req.collection.find({}, {limit: 10, sort: [['_id', -1]]}).toArray(function(err, results){
    if(err) return next(err);
    res.send(results);
  });
});

app.get('/todos/:listName/:id', function(req, res){
  req.collection.findOne({_id: req.collection.id(req.params.id)}, function(err, result){
    if(err) return next(err);
    res.send(result);
  });
});

app.post('/todos/:listName', function(req, res){
  console.log(req.collection.insert)
  req.collection.insert(req.body, {}, function(err, results){
    if(err) return next(err);
    res.send(results);
  });
});

var server = app.listen(3000);
console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
