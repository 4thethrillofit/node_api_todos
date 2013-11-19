var superagent = require('superagent');
var expect = require('chai').expect;
var SearchClient = require('../search_client');

// This test files uses superagent to make requests against the dev
// Node server. It tests the API by performing RESTful operations
// against the API.

describe('Express rest API server', function(){
  var id;
  var hostRoot = 'http://localhost:5000'
  var apiVersion = 'v1'
  it('POST a todo item', function(done){
    superagent.post(hostRoot + '/'+ apiVersion +'/lists/test-todo-list/todos')
      .send({
        title: 'test item title',
        body: 'test item body',
        done: false
      })
      .end(function(err, res){
        if(err) console.log(err);
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(201);
        expect(res.body.length).to.equal(1);
        expect(res.body[0]._id.length).to.equal(24);
        id = res.body[0]._id;
        done();
      });
  });

  it('GET an todo item', function(done){
    superagent.get(hostRoot + '/'+ apiVersion +'/lists/test-todo-list/todos/' + id)
    .end(function(err, res){
      if(err) console.log(err);
      expect(err).to.equal(null);
      expect(res.statusCode).to.equal(200);
      expect(res.body._id.length).to.equal(24);
      expect(res.body._id).to.equal(id);
      done();
    });
  });

  it('GET a todo list', function(done){
    superagent.get(hostRoot + '/'+ apiVersion +'/lists/test-todo-list/todos')
      .end(function(err, res){
        if(err) console.log(err);
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.be.above(0);
        expect(res.body.map(function(todoItem){ return todoItem._id })).to.include(id);
        done();
      });
  });

  it('PUT/update a todo item', function(done){
    superagent.put(hostRoot + '/'+ apiVersion +'/lists/test-todo-list/todos/' + id)
      .send({
        title: 'test item title2',
        body: 'test item body2',
      })
      .end(function(err, res){
        if(err) console.log(err);
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(typeof res.body).to.equal('object');
        expect(res.body.msg).to.equal('success');
        done();
      });
  });

  it('PUT/marks an item as DONE', function(done){
    superagent.put(hostRoot + '/'+ apiVersion +'/lists/test-todo-list/todos/' + id + '/done')
      .end(function(err, res){
        if(err) console.log(err);
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(typeof res.body).to.equal('object');
        expect(res.body.msg).to.equal('success');
      });
    superagent.get(hostRoot + '/'+ apiVersion +'/lists/test-todo-list/todos/' + id)
    .end(function(err, res){
      if(err) console.log(err);
      expect(err).to.equal(null);
      expect(res.statusCode).to.equal(200);
      expect(res.body.done).to.be.true
      done();
    })
  });

  it('PUT/marks an item as UNDONE', function(done){
    superagent.put(hostRoot + '/'+ apiVersion +'/lists/test-todo-list/todos/' + id + '/undone')
      .end(function(err, res){
        if(err) console.log(err);
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(typeof res.body).to.equal('object');
        expect(res.body.msg).to.equal('success');
      });
    superagent.get(hostRoot + '/'+ apiVersion +'/lists/test-todo-list/todos/' + id)
    .end(function(err, res){
      if(err) console.log(err);
      expect(err).to.equal(null);
      expect(res.statusCode).to.equal(200);
      expect(res.body.done).to.be.false
      done();
    })
  });

  it('checks an updated todo item', function(done){
    superagent.get(hostRoot + '/'+ apiVersion +'/lists/test-todo-list/todos/' + id)
      .end(function(err, res){
        if(err) console.log(err);
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(typeof res.body).to.equal('object');
        expect(res.body._id.length).to.equal(24);
        expect(res.body._id).to.equal(id);
        expect(res.body.body).to.equal('test item body2');
        done();
      });
  });

  it('DELETE a todo item', function(done){
    superagent.del(hostRoot + '/'+ apiVersion +'/lists/test-todo-list/todos/' + id)
      .end(function(err, res){
        if(err) console.log(err);
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(typeof res.body).to.equal('object');
        expect(res.body.msg).to.equal('success');
        done();
      });
  });

  it('searches the index', function(done){
    superagent.get(hostRoot + '/'+ apiVersion +'/lists/test-todo-list/search?q=title')
    .end(function(err, res){
      if(err) console.log(err);
      expect(err).to.equal(null);
      expect(res.statusCode).to.equal(200);
      expect(res.body.length).to.be.above(0);
      done();
    })
  });

});
