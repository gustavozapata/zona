const mongoose = require("mongoose");
const Post = require("./postModel");

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

    //FIXME: (DEV PURPOSE)
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: [true, "review can't be empty"],
    },
    //FIXME: (DEV PURPOSE)
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//this means that each combination of post and user have to be unique (this is to avoid users to post multiple reviews)
commentSchema.index({ post: 1, byUser: 1 }, { unique: true });

commentSchema.pre(/^find/, function (next) {
  //this populate will create a populate chain where we display data to a ref and that ref also displays data of the other ref
  //   this.populate({path: "post", select: "location description"});
  this.populate({
    path: "byUser",
    select: "name email",
  });
  next();
});

//FIXME: (DEV PURPOSE)
commentSchema.statics.calcAvgRating = async function (post) {
  const stats = await this.aggregate([
    {
      $match: { post },
    },
    {
      $group: {
        _id: "$post",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Post.findByIdAndUpdate(post, {
      ratingsQty: stats[0].nRating,
      ratingsAvg: stats[0].avgRating,
    });
  } else {
    await Post.findByIdAndUpdate(post, {
      ratingsQty: 0,
      ratingsAvg: 0,
    });
  }
};
commentSchema.post("save", function () {
  this.constructor.calcAvgRating(this.post);
});
commentSchema.pre(/^findOneAnd/, async function (next) {
  this.c = await this.findOne(); //we store the query in a new var called this.c
  next();
});
//we calculate on post since this will have updated data
commentSchema.post(/^findOneAnd/, async function () {
  //await this.findOne(); doesn't work here, the query has already been executed
  await this.c.constructor.calcAvgRating(this.c.post); //then we use it to call the calcAvgRating
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
