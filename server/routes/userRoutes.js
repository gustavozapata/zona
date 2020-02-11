const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();

router
  .route("/")
  .get(controller.isLogged)
  .post(controller.createUser);
// .post(controller.checkLogin);

module.exports = router;
