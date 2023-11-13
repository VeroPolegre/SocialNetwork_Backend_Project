const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/keys");
const Post = require("../models/Post");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, jwt_secret);
    const user = await User.findOne({ _id: payload._id, tokens: token });
    if (!user) {
      return res.status(404).send({ msg: "Not authorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(404).send({ msg: "There was a problem with the token" });
  }
};

const isAdmin = async (req, res, next) => {
  const admins = ["admin", "superadmin"];
  if (!admins.includes(req.user.role)) {
    return res.status(403).send({ msg: `You don't have permission` });
  }
  next();
};

const isSuperAdmin = async (req, res, next) => {
  const admins = ["superadmin"];
  if (!admins.includes(req.user.role)) {
    return res.status(403).send({ msg: `You don't have permission` });
  }
  next();
};

const isAuthor = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params._id); //may be body, if we use frontend to send the id
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ msg: `Is not your post` });
    }
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ msg: "There was an error when checking the author of the post" });
  }
};

module.exports = { authentication, isAdmin, isSuperAdmin, isAuthor };
