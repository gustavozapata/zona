const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const commentRouter = require("./commentRoutes");
const router = express.Router();

router.get("/stats", postController.stats);
router.get("/test", postController.testEndPoint);

//AUTHENTICATION (USERS)
router.use(authController.protect);
//all routes below will be protected (because of the middleware flow)

router.use("/:postId/comments", commentRouter); //instead of the above we redirect to the commentRouter

router
  .route("/")
  .get(postController.getAllPosts)
  .post(postController.createPost);

router
  .route("/:id")
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

router.patch("/:id/like", postController.likePost);
router.patch("/:id/comment", postController.postComment);

//will execute whenever a param 'id' is in the request
router.param("id", postController.checkId);

module.exports = router;
