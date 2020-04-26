const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment can not be empty"],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post"],
    },
    byUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.pre(/^find/, function (next) {
  //this populate will create a populate chain where we display data to a ref and that ref also displays data of the other ref
  //   this.populate({
  //     path: "post",
  //     select: "location description",
  //   });
  this.populate({
    path: "byUser",
    select: "name email",
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
