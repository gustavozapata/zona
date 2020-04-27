const Comment = require("../models/commentModel");
const factory = require("./handlerFactory");

exports.setPostUserIds = (req, res, next) => {
  //Allow nested routes - this will add /posts/:postId/comments and :userId to the url
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.byUser) req.body.byUser = req.user.id;
  next();
};

exports.createComment = factory.createOne(Comment);
exports.getComment = factory.getOne(Comment);
exports.getAllComments = factory.getAll(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
