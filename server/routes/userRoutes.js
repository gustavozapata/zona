const express = require("express");
const controller = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

//TODO: AUTHENTICATION VERSION
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword); //receives only the email address
router.patch("/resetPassword/:token", authController.resetPassword); //receives the token and the 'new password'

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
); //receives the token and the 'new password'

router.patch("/updateMe", authController.protect, controller.updateMe);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "developer"),
    controller.getAllUsers
  );

router.route("/top-5-users").get(controller.usersAlias, controller.getAllUsers);
router.route("/invitation").post(controller.invitationCode);

router
  .route("/:id")
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    controller.deleteUser
  );

module.exports = router;
