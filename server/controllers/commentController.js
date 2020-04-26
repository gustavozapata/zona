const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllComments = catchAsync(async (req, res, next) => {
  let filter = {};
  //this allows us to get the comments of a post when GET /posts/postId/comments is called
  if (req.params.postId) filter = { post: req.params.postId };

  const comments = await Comment.find(filter);

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  //Allow nested routes - this will add /posts/:postId/comments and :userId to the url
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.byUser) req.body.byUser = req.user.id;

  const newComment = await Comment.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      comment: newComment,
    },
  });
});
