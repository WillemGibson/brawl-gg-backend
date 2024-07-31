const mongoose = require("mongoose");

const PlayerStatsSchema = new Schema({
  playerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  teamNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  gamePlayed: {
    type: String,
    required: false,
  },
  totalMatches: {
    type: Number,
    required: false,
    default: 0,
  },
  wins: {
    type: Number,
    required: false,
    default: 0,
  },
  losses: {
    type: Number,
    required: false,
    default: 0,
  },
  draws: {
    type: Number,
    required: false,
    default: 0,
  },
  kills: {
    type: Number,
    default: 0,
  },
  deaths: {
    type: Number,
    default: 0,
  },
  assists: {
    type: Number,
    default: 0,
  },
  damageDealt: {
    type: Number,
    default: 0,
  },
  damageTaken: {
    type: Number,
    default: 0,
  },
  headshots: {
    type: Number,
    default: 0,
  },
  accuracy: {
    type: Number,
    default: 0.0,
  },
  healingDone: {
    type: Number,
    default: 0,
  },
  objectivesCompleted: {
    type: Number,
    default: 0,
  },
  timePlayed: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  performanceRating: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const PlayerStatsModel = mongoose.model("PlayerStats", PlayerStatsSchema);
module.exports = { PlayerStatsModel };
