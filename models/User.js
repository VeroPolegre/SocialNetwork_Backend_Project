const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please, enter a username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please, enter an email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please, enter a password"],
    },
    role: {
      type: String,
      default: "user",
    },
    confirmed: Boolean,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
