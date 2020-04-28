const express = require("express");
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");
const router = express.Router({ mergeParams: true }); //this allows us to use the params passed in the other router (post: the one that redirected us here)

//AUTHENTICATION (USERS)
router.use(authController.protect);

router
  .route("/")
  .get(commentController.getAllComments)
  .post(commentController.setPostUserIds, commentController.createComment);

router
  .route("/:id")
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
