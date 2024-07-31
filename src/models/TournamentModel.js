const mongoose = require("mongoose");
const { Schema } = mongoose;
const { PlayerStatsSchema } = require("./PlayerStatsModel");

const TournamentSchema = new Schema(
  {
    tournamentName: {
      type: String,
      unique: true,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teams: {
      type: [String],
      required: false,
    },
    game: {
      type: String,
      required: true,
    },
    gameType: {
      type: String,
    },
    description: {
      type: String,
    },
    minimumPlayers: {
      type: Number,
      required: true,
      default: 2,
    },
    maximumPlayers: {
      type: Number,
      required: true,
      default: 10,
    },
    playerStats: [PlayerStatsSchema],
    password: {
      type: String,
    },
    joinlink: {
      type: String,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TournamentModel = mongoose.model("Tournament", TournamentSchema);
module.exports = { TournamentModel };
