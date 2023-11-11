const express = require("express");

const router = express.Router();

const PostController = require("../controllers/PostController");

router.post("/", PostController.create);
router.get("/", PostController.getAll);
router.get("/id/:_id", PostController.getById);
router.get("/name/:name", PostController.getPostByName);
router.delete("/id/:_id", PostController.delete);
router.put("/id/:_id", PostController.update);

module.exports = router;
