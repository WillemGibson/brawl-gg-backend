const mongoose = require("mongoose");

const UserPasswordRecoverySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  passcode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "15m",
  },
});

const UserPasswordRecoveryModel = mongoose.model(
  "UserPasswordRecovery",
  UserPasswordRecoverySchema
);
module.exports = { UserPasswordRecoveryModel };
