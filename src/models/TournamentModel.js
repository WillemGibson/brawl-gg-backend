const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema(
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
    game: {
      type: String,
      require: true,
      unique: false,
    },
    gameType: {
      type: String,
      require: false,
      unique: false,
    },
    description: {
      type: String,
      require: false,
      unique: false,
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
      required: false,
      unique: false,
    },
    joinlink: {
      type: String,
      require: false,
      unique: false,
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: false,
    },
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
