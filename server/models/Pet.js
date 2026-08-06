const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    default: 'Milo',
  },
  hunger: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
  },
  cleanliness: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
  },
  happiness: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
  },
  energy: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pet', petSchema);
