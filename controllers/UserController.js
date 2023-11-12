const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserController = {
  async create(req, res, next) {
    try {
      //   if (!username || !email || !password) {
      //     return res
      //       .status(400)
      //       .send({ error: "Username, email and password are required." });
      //   }
      const hash = await bcrypt.hashSync(req.body.password, 10);
      const user = await User.create({
        ...req.body,
        password: hash,
        confirmed: false,
        role: "user",
      });
      res.status(201).send({ msg: "User created successfully.", user });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).send({ error: error.message });
      }
      console.error("error creating a user", error);
      res.status(500).send({ message: "Server error creating a user" });
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      return res.status(200).send({ msg: `Welcome ${user.name}`, token });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send(`Error while trying to connect the current user`, error);
    }
  },

  async getLoggedUsers(req, res) {
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
};

module.exports = UserController;
