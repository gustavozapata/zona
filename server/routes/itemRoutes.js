const express = require("express");
const controller = require("../controllers/itemController");
const router = express.Router();

router.route("/").get(controller.getItems);

module.exports = router;
