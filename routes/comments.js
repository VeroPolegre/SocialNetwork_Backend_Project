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

router.put("/:_id/like", authentication, CommentController.like);
router.put("/:_id/unlike", authentication, CommentController.unlike);

router.post(
  "/:_id",
  authentication,
  upload.single("image"),
  CommentController.create
);

router.get("/:_id", CommentController.getAll);
router.delete(
  "/:_id",
  authentication,
  isCommentAuthor,
  CommentController.delete
);

module.exports = router;
