const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const CommentController = {
  async create(req, res, next) {
    try {
      let imageFileName;
      if (req.file && req.file.filename) {
        imageFileName = req.file.filename;
      }
      const comment = await Comment.create({
        ...req.body,
        userId: req.user._id,
        image: imageFileName,
      });

      await Post.findByIdAndUpdate(
        req.params._id,
        { $push: { commentIds: comment._id } },
        { new: true }
      );
      res.status(201).send(comment);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async getAllByPostId(req, res, next) {
    try {
      const postId = req.params._id;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }
      const commentIds = post.commentIds;
      const comments = await Comment.find({
        _id: { $in: commentIds },
      }).populate({
        path: "userId",
        select: "username",
      });

      res.status(200).send({ postId, comments });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async delete(req, res) {
    try {
      const comment = await Comment.findByIdAndDelete(req.params._id);

      await Post.findOneAndUpdate(
        { commentIds: req.params._id },
        { $pull: { commentIds: req.params._id } },
        { new: true }
      );

      res
        .status(200)
        .send({ message: "Comment deleted succesfully.", comment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error trying to remove the comment" });
    }
  },

  async like(req, res) {
    try {
      const loggedUser = await User.findById(req.user._id);
      let commentToLike = await Comment.findById(req.params._id);

      if (!commentToLike)
        return res.status(400).send({ message: "Comment not found" });

      if (commentToLike.likes.includes(req.user._id)) {
        return res.status(400).send({
          message: `You already liked this comment by ${commentToLike.userId}, comment ${loggedUser.username}`,
        });
      } else {
        commentToLike = await Comment.findByIdAndUpdate(
          req.params._id,
          { $push: { likes: req.user._id } },
          { new: true }
        );

        await User.findByIdAndUpdate(
          req.user._id,
          { $push: { likesList: req.params._id } },
          { new: true }
        );

        res.send(commentToLike);
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "There was a problem liking the comment" });
    }
  },

  async unlike(req, res) {
    try {
      let commentToUnlike = await Comment.findById(req.params._id);

      if (!commentToUnlike)
        return res.status(400).send({ message: "Comment not found" });

      commentToUnlike = await Comment.findByIdAndUpdate(
        req.params._id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { likesList: req.params._id } },
        { new: true }
      );

      res.send(commentToUnlike);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "There was a problem unliking the comment" });
    }
  },
};

module.exports = CommentController;
