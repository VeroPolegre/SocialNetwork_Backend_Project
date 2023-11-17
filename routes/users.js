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
router.get("/confirm/:emailToken", UserController.confirm);
router.put("/:_id", authentication, UserController.updateByID);
router.get("/profile", authentication, UserController.getLoggedUser);
router.get("/:_id", UserController.getById);
router.get("/name/:username", UserController.getByName);
router.put("/follow/:_id/", authentication, UserController.follow);
router.put("/unfollow/:_id/", authentication, UserController.unFollow);
router.delete("/logout", authentication, UserController.logout);

module.exports = router;
