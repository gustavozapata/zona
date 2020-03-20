const express = require("express");
const controller = require("../controllers/postController");
const router = express.Router();

//will execute whenever a param 'id' is in the request
router.param("id", controller.checkId);

router.route("/stats").get(controller.stats);

router.route("/test").get(controller.testEndPoint);

router
  .route("/")
  .get(controller.getPosts)
  .post(controller.addPost);

router.route("/likes/:id").patch(controller.likePost);

router.route("/comments/:id").patch(controller.postComment);

router
  .route("/:id")
  // .post(controller.checkBody)
  .delete(controller.deletePost);

module.exports = router;
