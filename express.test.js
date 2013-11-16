var superagent = require('superagent');
var expect = require('chai').expect;

describe('express rest api server', function(){
  it('posts a todo item', function(done){
    superagent.post('http://localhost:3000/todos/test')
      .send({
        title: 'test item title',
        body: 'test item body'
      })
      .end(function(err, res){
        console.log(res);
        console.log(err);
        expect(err).to.equal(null);
        expect(res.body.length).to.equal(1);
        done();
      });
  });
});
