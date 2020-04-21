const Post = require("../models/postModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const dotenv = require("dotenv");
const gzUI = require("gz-ui-react");
const multer = require("multer");

dotenv.config();

//FIXME: upload image version 2
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

exports.checkId = (req, res, next, val) => {
  console.log(`the id is: ${val}`);
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.country) {
    return res.status(400).json({
      status: "fail",
      message: "missing country",
    });
  }
  next();
};

//get all posts
exports.getPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query)
    .filter() //posts?filter=description,by
    .sort() //posts?sort=date
    .limitFields() //posts?limit=4 (shows only 4 results)
    .paginate(); //posts?page=1&limit=3 (3 results per page)
  const posts = await features.query;

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: { posts },
  });
});

//add post
exports.addPost = catchAsync(async (req, res, next) => {
  console.log("addPost");
  const newPost = await Post.create(req.body);
  res.status(200).json({
    status: "success",
    data: { post: newPost },
  });
  console.log("post added: ", newPost);
});

//like post
exports.likePost = catchAsync(async (req, res, next) => {
  let likes = req.body.likes + 1;
  const reaction = req.body.reaction === "love" ? "love" : "funny";
  console.log("reaction: ", reaction, likes);
  await Post.updateOne({ _id: req.params.id }, { [reaction]: likes });
  res.status(200).json({
    status: "success",
    data: likes,
  });
});
//post comment
exports.postComment = catchAsync(async (req, res, next) => {
  await Post.updateOne(
    { _id: req.params.id },
    {
      $push: { comments: { user: req.body.user, comment: req.body.comment } },
    }
  );
  res.status(200).json({
    status: "success",
    data: "ok",
  });
});

//delete a post
exports.deletePost = catchAsync(async (req, res, next) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
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

//MONGO/MONGOOSE AGGREGATION
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
