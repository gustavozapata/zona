const express = require("express");
const viewController = require("../controllers/viewsController");
const router = express.Router();

router.get("/", viewController.renderMain);

module.exports = router;
