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
      const a = Comment.findById(req.params._id);
      console.log(a);
      const b = await Post.findById({ commentIds: req.params._id });
      //  await Post.findByIdAndDelete({ commentIds: req.params._id });
      console.warn(`Hallo`, b);
      res.status(200).send({ message: "Comment deleted succesfully." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error trying to remove the comment" });
    }
  },
};

module.exports = CommentController;
