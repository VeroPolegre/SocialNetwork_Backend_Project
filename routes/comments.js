const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const {
  authentication,
  isAuthor,
  isAdmin,
  isSuperAdmin,
} = require("../middleware/authentication");

router.post("/", authentication, CommentController.create);

module.exports = router;
