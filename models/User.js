const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

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
      match: [/.+\@.+\..+/, "Enter a valid email"],
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
    tokens: [],
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    confirmed: Boolean,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
