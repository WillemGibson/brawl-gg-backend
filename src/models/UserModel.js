const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: false,
    },
    profileImage: {
      type: String,
      required: false,
      unique: false,
    },
    tournaments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
        unique: false,
      },
    ],
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
      unique: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  // TODO: encryption
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;

  next();
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = { UserModel };
