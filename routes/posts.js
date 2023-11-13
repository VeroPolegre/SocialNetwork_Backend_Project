const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");

const {
  authentication,
  isAuthor,
  isAdmin,
  isSuperAdmin,
} = require("../middleware/authentication");

router.post("/", authentication, PostController.create);
router.get("/", authentication, PostController.getAll);
router.get("/id/:_id", authentication, PostController.getById);
router.get("/name/:name", authentication, PostController.getPostByName);
router.delete("/id/:_id", authentication, isAuthor, PostController.delete);
router.put("/id/:_id", authentication, isAuthor, PostController.update);
router.put("/likes/:_id", authentication, PostController.like);
// router.put("/unlikes/:_id", authentication, PostController.unlike);

module.exports = router;
