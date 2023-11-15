const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {
  authentication,
  isAdmin,
  isSuperAdmin,
} = require("../middleware/authentication");

router.post("/register", UserController.create);
router.post("/login", UserController.login);
router.get("/profile", authentication, UserController.getLoggedUser);
router.get("/id/:_id", UserController.getById);
router.get("/name/:username", UserController.getByName);
router.put("/id/:_id", authentication, UserController.updateByID);
router.delete("/logout", authentication, UserController.logout);
router.put("/follow/:_id/", authentication, UserController.follow);
router.put("/unfollow/:_id/", authentication, UserController.unFollow);

module.exports = router;
