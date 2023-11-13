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
router.post("/id/:_id", UserController.updateByID);
router.get("/profile", authentication, UserController.getLoggedUser);
router.delete("/logout", authentication, UserController.logout);

module.exports = router;
