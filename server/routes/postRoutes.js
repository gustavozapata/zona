const express = require("express");
const controller = require("../controllers/postController");
const router = express.Router();

router.param("id", controller.checkId); //will execute whenever a param 'id' is in the request

router.route("/stats").get(controller.stats);
// router.route("/images").post(controller.saveImageClient);
router
  .route("/saveImage")
  .post(controller.uploadPostImage, controller.saveImage);
router.route("/test").get(controller.testEndPoint);

router
  .route("/")
  .get(controller.getPosts)
  .post(controller.addPost);

router
  .route("/:id")
  // .post(controller.checkBody)
  .patch(controller.likePost)
  .delete(controller.deletePost);

module.exports = router;
