const Comment = require("../models/Comment");
const Post = require("../models/Post");
const CommentController = {
  async create(req, res, next) {
    try {
      const comment = await Comment.create({
        ...req.body,
        userId: req.user._id,
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

  async delete(req, res) {
    try {
      await Comment.findByIdAndDelete(req.params._id);

      await Post.findOneAndUpdate(
        { commentIds: req.params._id },
        { $pull: { commentIds: req.params._id } },
        { new: true }
      );
      res.status(200).send({ message: "Comment deleted succesfully." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error trying to remove the comment" });
    }
  },
};

module.exports = CommentController;
