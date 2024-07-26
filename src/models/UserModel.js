const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    tournaments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament",
      },
    ],
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  console.log("pre-save hook running");

  if (!user.isModified("password")) {
    return next();
  }

  console.log(this.password);

  // TODO: encryption
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;

  console.log(hash);

  next();
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = { UserModel };
