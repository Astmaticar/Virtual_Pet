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
  species: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit'],
  },
  variant: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
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
  growthStage: {
    type: String,
    default: 'baby',
    enum: ['baby', 'child', 'adult'],
  },
  isRunAway: {
    type: Boolean,
    default: false,
  },
  growthStageBeforeRunAway: {
    type: String,
    default: null,
    enum: ['baby', 'child', 'adult', null],
  },
  criticalSince: {
    type: Date,
    default: null,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pet', petSchema);
