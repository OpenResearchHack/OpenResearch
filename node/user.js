var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true
  },
  bc_address: {
    type: String,
    unique: true,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
