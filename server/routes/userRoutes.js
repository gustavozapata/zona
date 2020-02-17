const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();

router
  .route("/")
  .get(controller.getAllUsers)
  .post(controller.createUser);

router
  .route("/login")
  .get(controller.isLogged)
  .post(controller.checkLogin);

router
  .route("/:id")
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = router;
