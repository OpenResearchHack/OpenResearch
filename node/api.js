var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

var User = mongoose.model('User', require('./user'));
var Paper = mongoose.model('Paper', require('./paper'));
var Comment = mongoose.model('Comment', require('./comment'));

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json());
  api.use(bodyparser.urlencoded({ extended: true }));

  /* User schema */

  api.get('/user', function(req, res) {
    User.find(function(err, users) {
      if (err) {
        return res.send(err);
      }
      return res.json(users);
    });
  });

  api.get('/user/:user_id', function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        return res.send(err);
      }
      return res.json(user);
    });
  });

  api.post('/user', function(req, res) {
    if (!req.body.hasOwnProperty('username') ||
      !req.body.hasOwnProperty('password')) {
      res.statusCode = status.BAD_REQUEST;
      return res.json({ message: 'Post syntax incorrect.' });
    }

    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;

    if (req.body.hasOwnProperty('email')) {
      user.email = req.body.email;
    }

    // will be replace with a real bitcoin address
    user.bc_address = Math.random();

    user.save(function(err) {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: 'User created.' });
    });
  });

  api.put('/user/:user_id', function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        return res.send(err);
      }

      if (req.body.hasOwnProperty('username')) {
        user.username= req.body.username;
      }
      if (req.body.hasOwnProperty('password')) {
        user.password= req.body.password;
      }
      if (req.body.hasOwnProperty('email')) {
        user.email = req.body.email;
      }
      if (req.body.hasOwnProperty('bc_address')) {
        user.bc_address = req.body.bc_address;
      }
      if (req.body.hasOwnProperty('verified')) {
        user.verified = req.body.verified;
      }

      user.save(function(err) {
        if (err) {
          return res.send(err);
        }
        return res.json({ message: 'User updated.' });
      });
    });
  });

  api.delete('/user/:user_id', function(req, res) {
    User.remove({ _id: req.params.user_id }, function(err, user) {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: 'User deleted.' });
    });
  });

  /* Paper schema */

  api.get('/paper', function(req, res) {
    Paper.find(function(err, papers) {
      if (err) {
        return res.send(err);
      }
      return res.json(papers);
    });
  });

  api.get('/paper/:paper_id', function(req, res) {
    Paper.findById(req.params.paper_id, function(err, paper) {
      if (err) {
        return res.send(err);
      }
      return res.json(paper);
    });
  });

  api.delete('/paper/:paper_id', function(req, res) {
    Paper.remove({ _id: req.params.paper_id }, function(err, paper) {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: 'Paper deleted.' });
    });
  });

  /* Comment schema */

  api.get('/comment', function(req, res) {
    Comment.find(function(err, comments) {
      if (err) {
        return res.send(err);
      }
      return res.json(comments);
    });
  });

  api.get('/comment/:comment_id', function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err) {
        return res.send(err);
      }
      return res.json(comment);
    });
  });

  api.delete('/comment/:comment_id', function(req, res) {
    Comment.remove({ _id: req.params.comment_id }, function(err, comment) {
      if (err) {
        return res.send(err);
      }
      return res.json({ message: 'Comment deleted.' });
    });
  });

  return api;
};
