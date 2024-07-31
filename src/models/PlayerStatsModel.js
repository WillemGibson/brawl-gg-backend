const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlayerStatsSchema = new Schema({
  playerName: {
    type: String,
    required: true,
    default: "player",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
  },
  team: {
    type: String,
    default: "1",
  },
  commonStats: {
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    draws: {
      type: Number,
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
  },
  gameSpecificStats: {
    type: Object,
    required: false,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const PlayerStatsModel = mongoose.model("PlayerStats", PlayerStatsSchema);
module.exports = { PlayerStatsModel };
