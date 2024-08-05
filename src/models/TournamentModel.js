const mongoose = require("mongoose");
const { Schema } = mongoose;
const { PlayerStatsSchema } = require("./PlayerStatsModel");

const TournamentSchema = new Schema(
  {
    tournamentName: { type: String, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    author: {
      type: String,
      required: true,
    },
    teams: {
      type: [String],
      default: [""],
    },
    gameStats: [String],
    game: {
      type: String,
      required: true,
    },
    gameType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    minimumPlayers: {
      type: Number,
      required: true,
    },
    maximumPlayers: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
    },
    joinlink: {
      type: String,
    },
    playerStats: [PlayerStatsSchema],
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
