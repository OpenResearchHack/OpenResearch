var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
  mongoose.connect('mongodb://mongo:27017/openresearch');

  wagner.factory('db', function() {
    return mongoose;
  });

  var User =
    mongoose.model('User', require('./user'), 'users');
  var Paper =
    mongoose.model('Paper', require('./paper'), 'papers');
  var Comment =
    mongoose.model('Comment', require('./comment'), 'comments');

  var models = {
    User: User,
    Paper: Paper,
    Comment: Comment
  };

  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });

  return models;
};
