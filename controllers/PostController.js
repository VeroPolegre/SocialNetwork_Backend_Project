const Post = require("../models/Post");

const PostController = {
  async create(req, res, next) {
    try {
      const post = await Post.create({
        ...req.body,
        userId: req.user._id,
      });
      res.status(201).send(post);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const posts = await Post.find()
        .limit(limit)
        .skip((page - 1) * limit);
      res.send(posts);
    } catch (error) {
      console.error(error);
    }
  },

  async getById(req, res) {
    try {
      const post = await Post.findById(req.params._id);

      res.send(post);
    } catch (error) {
      console.error(error);
    }
  },

  async getPostByName(req, res) {
    try {
      if (req.params.name.length > 20) {
        return res.status(400).send("Search too long");
      }

      const name = new RegExp(req.params.name, "i");
      const posts = await Post.find({ name });

      res.send(posts);
    } catch (error) {
      console.log(error);
    }
  },

  async delete(req, res) {
    try {
      const post = await Post.findByIdAndDelete(req.params._id);

      res.send({ message: "Post deleted succesfully", post });
    } catch (error) {
      console.error(error);

      res.status(500).send({ message: "Error trying to remove the post" });
    }
  },

  async update(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      });

      res.send({ message: "Post updated successfully!", post });
    } catch (error) {
      console.error(error);
    }
  },

  async like(req, res) {
    try {
      const foundPost = await Post.findById(req.params._id);
      if (!foundPost)
        return res.status(400).send({ message: "Post not found" });

      const userId = req.user._id;
      const alreadyLiked = foundPost.likes.includes(userId);

      if (alreadyLiked) {
        foundPost.likes.pull(userId);
      } else {
        foundPost.likes.push(userId);
      }
      const updatedPost = await foundPost.save();
      res.send(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "There was a problem liking the post" });
    }
  },
};

module.exports = PostController;
