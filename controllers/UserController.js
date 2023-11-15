const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/keys");

const UserController = {
  async create(req, res, next) {
    try {
      let hash = "";
      if (req.body.password) {
        hash = bcrypt.hashSync(req.body.password, 10);
      }
      const user = await User.create({
        ...req.body,
        password: hash,
        confirmed: false,
        role: "user",
      });
      res.status(201).send({ msg: "User created successfully.", user });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      return res.status(200).send({ msg: `Welcome ${user.username}`, token });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send(`Error while trying to connect the current user`, error);
    }
  },

  async updateByID(req, res) {
    try {
      if (!req.user._id)
        return res.status(400).send({ msg: "Register user first" });
      const foundUser = await User.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      });
      res
        .status(200)
        .send({ msg: `Usuario ${foundUser.username} actualizado`, foundUser });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getLoggedUser(req, res) {
    try {
      const loggedUser = await User.findById({ _id: req.user._id });
      res.status(200).send(loggedUser);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Error while trying to get the current user`, error);
    }
  },

  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.status(200).send({ msg: `Disconnected, see you soon!` });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        msg: `Error while trying to disconnect the current user`,
        error,
      });
    }
  },

  async follow(req, res, next) {
    try {
      let loggedUser = await User.findById({ _id: req.user._id });
      let userToFollow = await User.findById({ _id: req.params._id });
      if (loggedUser.following.includes(userToFollow._id)) {
        res.status(400).send({ msg: `already following ${userToFollow.username}` })
      } else {
        loggedUser = await User.findByIdAndUpdate(
          req.user._id,
          { $push: { following: req.params._id } },
          { new: true }
        );
        userToFollow = await User.findByIdAndUpdate(
          req.params._id,
          { $push: { followers: req.user._id } },
          { new: true }
        );
        res.status(200).send({ msg: `${loggedUser.username} is now following ${userToFollow.username}`, loggedUser, userToFollow });
      }
    } catch (error) {
      console.error(error);
      next(error)
    }
  },

  async unFollow(req, res, next) {
    try {
      let loggedUser = await User.findById({ _id: req.user._id });
      let userToUnfollow = await User.findById({ _id: req.params._id });
      if (!loggedUser.following.includes(userToUnfollow._id)) {
        res.status(400).send({ msg: `You're not following ${userToUnfollow.username}` })
      } else {
        loggedUser = await User.findByIdAndUpdate(
          req.user._id,
          { $pull: { following: req.params._id } },
          { new: true }
        );
        userToUnfollow = await User.findByIdAndUpdate(
          req.params._id,
          { $pull: { followers: req.user._id } },
          { new: true }
        );
        res.status(200).send({ msg: `${loggedUser.username} is now unfollowing ${userToUnfollow.username}`, loggedUser, userToUnfollow });
      }
    } catch (error) {
      console.error(error);
      next(error)
    }
  },
  async getById(req, res, next) {
    try {
      const foundUser = await User.findById({ _id: req.params._id });
      if (!foundUser) {
        return res.status(400).send({ msg: `ID: ${req.params._id} not found` })
      } else {
        return res.status(200).send(foundUser);
      }
    } catch (error) {
      console.error(error);
      next(error)
    }
  },
  async getByName(req, res, next) {
    try {
      const username = new RegExp(req.params.username, "i");
      const foundUser = await User.find({ username });
      if (!foundUser) {
        return res.status(400).send({ msg: `${req.params.username} not found` })
      } else {
        return res.status(200).send(foundUser);
      }
    } catch (error) {
      console.error(error);
      next(error)
    }
  },

};

module.exports = UserController;
