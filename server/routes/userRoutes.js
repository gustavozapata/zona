const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

//AUTHENTICATION
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword); //receives only the email address
router.patch("/resetPassword/:token", authController.resetPassword); //receives the token and the 'new password'

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
); //receives the token and the 'new password'
//AUTHENTICATION

router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "developer"),
    userController.getAllUsers
  );

router
  .route("/top-5-users")
  .get(userController.usersAlias, userController.getAllUsers);
router.route("/invitation").post(userController.invitationCode);

router
  .route("/:id")
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser
  );

module.exports = router;
