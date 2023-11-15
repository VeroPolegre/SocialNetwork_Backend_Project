const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const {
  authentication,
  isAuthor,
  isAdmin,
  isSuperAdmin,
} = require("../middleware/authentication");

router.post("/:_id", authentication, CommentController.create);
router.delete("/:_id", authentication, CommentController.delete);
router.put("/like/:_id", authentication, CommentController.like);
router.put("/unlike/:_id", authentication, CommentController.like);

module.exports = router;
