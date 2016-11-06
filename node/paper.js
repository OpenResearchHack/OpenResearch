var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  file: {
    type: String,
    required: true,
    unique: true,
    match: /^http:\/\//i
  },
  file_hash: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
