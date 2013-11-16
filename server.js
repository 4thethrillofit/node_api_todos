var express = require('express');
var mongoskin = require('mongoskin');
var app = express();
app.use(express.bodyParser());
var db = mongoskin.db('localhost:27017/test', {safe:true});

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName);
  return next();
});

app.get('/', function(req, res){
  res.send('please select a collection, e.g., /collections/messages');
});

app.get('/collections/:collectionName', function(req, res){
  req.collection.find({}, {limit: 10, sort: [['_id', -1]]}).toArray(function(err, results){
    if(err) return next(err);
    res.send(results);
  });
});

var server = app.listen(3000);
console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
