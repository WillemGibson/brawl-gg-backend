const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlayerStatsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    player: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      default: "",
    },
    stats: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { PlayerStatsSchema };
