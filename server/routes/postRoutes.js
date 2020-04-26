const express = require("express");
const userController = require("../controllers/postController");
const authController = require("../controllers/authController");
const commentRouter = require("./commentRoutes");
const router = express.Router();

// POST /posts/325ad(postId)/comments
// GET /posts/3453g(postId)/comments
// router.route("/:postId/comments").post(authController.protect, commentController.createComment);
router.use("/:postId/comments", commentRouter); //instead of the above we redirect to the commentRouter

//will execute whenever a param 'id' is in the request
router.param("id", userController.checkId);
router.route("/stats").get(userController.stats);
router.route("/test").get(userController.testEndPoint);

router.route("/").get(userController.getPosts).post(userController.addPost);

router.route("/likes/:id").patch(userController.likePost);
router.route("/comments/:id").patch(userController.postComment);

router
  .route("/:id")
  // .post(controller.checkBody)
  //TODO: AUTHORIZATION VERSION
  .get(authController.protect, userController.getPost)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deletePost
  );

module.exports = router;
