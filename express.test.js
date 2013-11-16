var superagent = require('superagent');
var expect = require('chai').expect;

describe('express rest api server', function(){
  var id;
  var hostRoot = 'http://localhost:3000'
  it('posts a todo item', function(done){
    superagent.post(hostRoot + '/todos/testTodoList')
      .send({
        title: 'test item title',
        body: 'test item body'
      })
      .end(function(err, res){
        // console.log(res.body);
        if(err) console.log(err);
        expect(err).to.equal(null);
        expect(res.body.length).to.equal(1);
        expect(res.body[0]._id.length).to.equal(24);
        id = res.body[0]._id;
        done();
      });
  });

  it('retrieves an todo item', function(done){
    superagent.get(hostRoot + '/todos/testTodoList/' + id)
    .end(function(err, res){
      if(err) console.log(err);
      expect(err).to.equal(null);
      expect(res.body._id.length).to.equal(24);
      expect(res.body._id).to.equal(id);
      done();
    })
  });

  it('retrieves a todo list', function(done){
    superagent.get(hostRoot + '/todos/testTodoList/')
      .end(function(err, ers){
        done();
      })
  });
});
