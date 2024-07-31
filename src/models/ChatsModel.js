const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatsModel = mongoose.model("Chat", chatSchema);

module.exports = { ChatsModel };
