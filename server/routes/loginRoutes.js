const express = require("express");
const controller = require("../controllers/loginController");
const router = express.Router();

router
  .route("/")
  .get(controller.isLogged)
  .post(controller.checkLogin);

module.exports = router;
