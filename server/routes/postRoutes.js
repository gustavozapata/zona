const express = require("express");
const controller = require("../controllers/postController");
const router = express.Router();

router.param("id", controller.checkId); //will execute whenever a param 'id' is in the request

router.route("/stats").get(controller.stats);
router.route("/images").post(controller.saveImage);

router
  .route("/")
  .get(controller.getPosts)
  .post(controller.addPost);

router
  .route("/:id")
  .post(controller.checkBody)
  .delete(controller.deletePost);

module.exports = router;
