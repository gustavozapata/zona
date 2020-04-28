const Post = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const dotenv = require("dotenv");
const gzUI = require("gz-ui-react");
const multer = require("multer");

dotenv.config();

exports.createPost = factory.createOne(Post);
exports.getPost = factory.getOne(Post, { path: "comments_ref" });
exports.getAllPosts = factory.getAll(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);

//like post
exports.likePost = catchAsync(async (req, res, next) => {
  const reaction = req.body.reaction === "love" ? "love" : "funny";
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { [reaction]: 1 } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: post[reaction],
  });
});

//post comment
exports.postComment = catchAsync(async (req, res, next) => {
  console.log(req.body);
  await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: req.body },
  });
  res.status(200).json({
    status: "success",
    data: "ok",
  });
});

exports.checkId = (req, res, next, val) => {
  console.log(`the id is: ${val}`);
  next();
};

exports.stats = catchAsync(async (req, res, next) => {
  const randomNum = gzUI(5, 10); //my own npm package
  const stats = await Post.aggregate([
    {
      $match: { by: "Gustavo" },
    },
    {
      $group: {
        _id: "$location",
        total: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: { total: 0 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: stats,
    randomNum,
  });
});

//test-patch
exports.testEndPoint = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "checkpoint - Windows project setup and running",
    env: process.env.NODE_ENV,
  });
};

//FIXME: (OLD CODE) upload image version 2
const uploadImageV2 = () => {
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images/posts");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  const multerFilter = (req, file, cb) => {
    //filters the files - only accepts images
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("only images please"), false);
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  exports.uploadPostImage = upload.single("postImage");
  exports.saveImage = (req, res) => {
    res.status(200).json({
      status: "success",
      message: "post image uploaded",
    });
  };
};
