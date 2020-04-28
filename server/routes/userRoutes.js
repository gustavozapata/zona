const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

//PUBLIC (ALL)
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/invitation", authController.invitationCode);
router.post("/forgotPassword", authController.forgotPassword); //receives only email address
router.patch("/resetPassword/:token", authController.resetPassword); //receives token and 'new password'

//AUTHENTICATION (USERS)
router.use(authController.protect);
//all routes below will be protected (because of the middleware flow)

router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);
router.patch("/updateMyPassword", authController.updatePassword);

router.get(
  "/top-5-users",
  userController.usersAlias,
  userController.getAllUsers
);

//AUTHORIZATION (ADMIN)
router.use(authController.restrictTo("admin"));
//all routes below will be restricted to admin only

router.get("/", userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
