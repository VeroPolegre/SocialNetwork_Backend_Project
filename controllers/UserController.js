const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_secret = process.env.JWT_SECRET;
const transporter = require("../config/nodemailer");
const fs = require("fs").promises;

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
        avatar: req.file ? req.file.filename : "example_uploaded_img.png",
        confirmed: false,
        role: "user",
      });
      const emailToken = jwt.sign(
        {
          email: req.body.email,
        },
        jwt_secret,
        { expiresIn: "48h" }
      );
      const url = "http://localhost:8080/users/confirm/" + emailToken;
      await transporter.sendMail({
        to: req.body.email,
        subject: "Please, confirm your email.",
        html: `<h3>Welcome to Hunta!</h3>
        <a href="${url}"> Please, click to confirm it your email</a>
        `,
      });
      res.status(201).send({ message: "User created successfully.", user });
    } catch (error) {
      next(error);
    }
  },

  async confirm(req, res) {
    try {
      const token = req.params.emailToken;
      const payload = jwt.verify(token, jwt_secret);
      await User.findOneAndUpdate(
        {
          email: payload.email,
        },
        { confirmed: true }
      );
      res.status(201).send("User confirmed successfully!");
    } catch (error) {
      console.error(error);
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .send({ error: "Please enter both username and password." });
      }
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(400).send({ message: "Incorrect user or password" });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Incorrect user or password" });
      }
      const token = jwt.sign(
        {
          _id: user._id,
        },
        jwt_secret
      );
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      return res
        .status(200)
        .send({ message: `Welcome ${user.username}`, token, user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send(`Error while trying to connect the current user`, error);
    }
  },

  async updateProfile(req, res) {
    try {
      if (!req.user._id) {
        return res.status(400).send({ message: "Register user first" });
      }

      let foundUser = await User.findById(req.user._id);

      if (!foundUser) {
        return res.status(400).send({ message: "User not found" });
      }
      let updateFields = {};

      if (req.file) {
        if (foundUser.avatar) {
          await fs.unlink(`uploads/${foundUser.avatar}`);
        }
        updateFields.avatar = req.file.filename;
      }
      if (req.body.password) {
        updateFields.password = bcrypt.hashSync(req.body.password, 10);
      }

      foundUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
        new: true,
      });

      res.status(200).send({ message: "User updated", foundUser });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getLoggedUser(req, res) {
    try {
      const loggedUser = await User.findById({ _id: req.user._id })
        .populate({
          path: "postIds",
          select: "category images title content keywords likes commentIds",
        })
        .populate({
          path: "following",
          select: "username avatar",
          populate: {
            path: "postIds",
            select: "category images title content keywords likes commentIds",
          },
        });
      const numOfFollowing = loggedUser.following.length;
      const numOfFollowers = loggedUser.followers.length;
      const numOfPosts = loggedUser.postIds.length;
      const loggedUserInfo = {
        loggedUser,
        numOfFollowers,
        numOfFollowing,
        numOfPosts,
      };
      res.status(200).send(loggedUserInfo);
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error while trying to get the current user`, error);
    }
  },

  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: {
          tokens: req.headers.authorization,
        },
      });
      res
        .status(200)
        .send({ message: `Disconnected, see you soon ${req.user.username}!` });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: `Error while trying to disconnect the current user`,
        error,
      });
    }
  },

  async follow(req, res, next) {
    try {
      let loggedUser = await User.findById({ _id: req.user._id });
      let userToFollow = await User.findById({ _id: req.params._id });
      if (loggedUser.following.includes(userToFollow._id)) {
        res
          .status(400)
          .send({ message: `Already following ${userToFollow.username}` });
      } else {
        loggedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            $push: {
              following: req.params._id,
            },
          },
          { new: true }
        );
        userToFollow = await User.findByIdAndUpdate(
          req.params._id,
          {
            $push: {
              followers: req.user._id,
            },
          },
          { new: true }
        );
        res.status(200).send({
          message: `${loggedUser.username} is now following ${userToFollow.username}`,
          loggedUser,
          userToFollow,
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async unFollow(req, res, next) {
    try {
      let loggedUser = await User.findById({ _id: req.user._id });
      let userToUnfollow = await User.findById({ _id: req.params._id });
      if (!loggedUser.following.includes(userToUnfollow._id)) {
        res
          .status(400)
          .send({ message: `You're not following ${userToUnfollow.username}` });
      } else {
        loggedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: {
              following: req.params._id,
            },
          },
          { new: true }
        );
        userToUnfollow = await User.findByIdAndUpdate(
          req.params._id,
          {
            $pull: {
              followers: req.user._id,
            },
          },
          { new: true }
        );
        res.status(200).send({
          message: `${loggedUser.username} is now following ${userToUnfollow.username}`,
          loggedUser,
          userToUnfollow,
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const foundUser = await User.findById({ _id: req.params._id });
      if (!foundUser) {
        return res
          .status(400)
          .send({ message: `ID: ${req.params._id} not found` });
      } else {
        return res.status(200).send(foundUser);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  async getByName(req, res, next) {
    try {
      const username = new RegExp(req.params.username, "i");
      const foundUser = await User.find({ username });
      if (!foundUser) {
        return res
          .status(400)
          .send({ message: `${req.params.username} not found` });
      } else {
        return res.status(200).send(foundUser);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};

module.exports = UserController;
