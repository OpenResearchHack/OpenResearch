var assert = require('assert');
var mongoose = require('mongoose');
var express = require('express');
var status = require('http-status');
var superagent = require('superagent');
var wagner = require('wagner-core');

describe('Mongoose schemas', function() {
  describe('User', function() {
    var User = mongoose.model('User', require('./user'), 'users');

    it('has a username field that\'s a required string', function(done) {
      var user = new User({});

      user.validate(function(err) {
        assert.ok(err);
        assert.equal(err.errors['username'].kind, 'required');

        user.username = 'testuser';
        assert.equal(user.username, 'testuser');
        done();
      });
    });

    it('has a password field that\'s a required string', function(done) {
      var user = new User({});

      user.validate(function(err) {
        assert.ok(err);
        assert.equal(err.errors['password'].kind, 'required');

        user.password = 'superpassword';
        assert.equal(user.password, 'superpassword');
        done();
      });
    });

    it('has a bc_address field that\'s a required string', function(done) {
      var user = new User({});

      user.validate(function(err) {
        assert.ok(err);
        assert.equal(err.errors['bc_address'].kind, 'required');

        user.bc_address= '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy';
        assert.equal(user.bc_address, '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy');
        done();
      });
    });
      
  });
});

describe('REST API tests', function() {
  var server;
  var app;

  var User;

  before(function() {
    app = express();

    // Bootstrap server
    models = require('./models')(wagner);

    // Make models available in tests
    var deps = wagner.invoke(function(User) {
      return {
        User: User
      };
    });

    User = deps.User;

    app.use(function(req, res, next) {
      User.findOne({}, function(error, user) {
        assert.ifError(error);
        req.user = user;
        next();
      });
    });

    app.use(require('./api')(wagner));

    server = app.listen(3000);
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure users are empty before each test
    User.remove({}, function(error) {
      assert.ifError(error);
      done();
    });
  });

  beforeEach(function(done) {
    var users = [{
      username: 'testuser',
      password: 'superpassword'
    }];

    User.create(users, function(error) {
      assert.ifError(error);
      done();
    });
  });
});
