const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const commentRouter = require("./commentRoutes");
const router = express.Router();

// POST /posts/325ad(postId)/comments
// GET /posts/3453g(postId)/comments
// router.route("/:postId/comments").post(authController.protect, commentController.createComment);
router.use("/:postId/comments", commentRouter); //instead of the above we redirect to the commentRouter

router
  .route("/")
  .get(authController.protect, postController.getAllPosts)
  .post(authController.protect, postController.createPost);

router.route("/likes/:id").patch(postController.likePost);
router.route("/comments/:id").patch(postController.postComment);

router
  .route("/:id")
  // .post(controller.checkBody)
  //TODO: AUTHORIZATION VERSION
  .get(authController.protect, postController.getPost)
  .patch(authController.protect, postController.updatePost)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    postController.deletePost
  );

//will execute whenever a param 'id' is in the request
router.param("id", postController.checkId);
router.route("/stats").get(postController.stats);
router.route("/test").get(postController.testEndPoint);

module.exports = router;
