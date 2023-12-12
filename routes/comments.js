const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const {
  authentication,
  isAdmin,
  isSuperAdmin,
  isCommentAuthor,
} = require("../middleware/authentication");
const upload = require("../middleware/upload");

router.put("/like/:_id", authentication, CommentController.like);
router.put("/unlike/:_id", authentication, CommentController.unlike);

router.post(
  "/:_id",
  authentication,
  upload.single("image"),
  CommentController.create
);

router.get("/:_id", CommentController.getAllByPostId);
router.delete(
  "/:_id",
  authentication,
  isCommentAuthor,
  CommentController.delete
);

module.exports = router;
