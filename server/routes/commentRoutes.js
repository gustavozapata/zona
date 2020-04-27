const express = require("express");
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");
const router = express.Router({ mergeParams: true }); //this allows us to use the params passed in the other router (post: the one that redirected us here)

router
  .route("/")
  .get(commentController.getAllComments)
  .post(
    authController.protect,
    commentController.setPostUserIds,
    commentController.createComment
  );

router
  .route("/:id")
  .get(authController.protect, commentController.getComment)
  .patch(authController.protect, commentController.updateComment)
  .delete(authController.protect, commentController.deleteComment);

module.exports = router;
