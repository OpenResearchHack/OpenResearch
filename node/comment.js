var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  paper: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  voteplus: {
    type: Number,
    default: 0,
    min: 0
  },
  voteminus: {
    type: Number,
    default: 0,
    min: 0
  },
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
