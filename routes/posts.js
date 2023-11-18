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
router.put("/:_id", authentication, isAuthor, PostController.update);
router.delete("/:_id", authentication, isAuthor, PostController.delete);
router.get("/", PostController.getAll);
router.get("/:_id", PostController.getById);
router.get("/name/:name", PostController.getByName);
router.put("/like/:_id", authentication, PostController.like);
router.put("/unlike/:_id", authentication, PostController.unlike);

module.exports = router;
