const express = require("express");
const controller = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

//TODO: AUTHENTICATION VERSION
router.post("/signup", authController.signup);

router.route("/").get(controller.getAllUsers).post(controller.createUser);

router.route("/top-5-users").get(controller.usersAlias, controller.getAllUsers);
router.route("/invitation").post(controller.invitationCode);
router.route("/login").post(controller.checkLogin);

router
  .route("/:id")
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = router;
