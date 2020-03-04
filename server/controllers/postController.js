const Post = require("../models/postModel");
const dotenv = require("dotenv");
const gzUI = require("gz-ui-react");
const path = require("path");

dotenv.config();

exports.checkId = (req, res, next, val) => {
  console.log(`the id is: ${val}`);
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.country) {
    return res.status(400).json({
      status: "fail",
      message: "missing country"
    });
  }
  next();
};

//getAll
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: { posts }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

//insertOne
exports.addPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.status(200).json({
      status: "success",
      data: { post: newPost }
    });
    console.log("post added: ", newPost);
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
//saveImage
exports.saveImage = async (req, res) => {
  try {
    const file = req.files.postImage;
    const pathSave = path.join(
      __dirname,
      `../../client/src/images/posts/${file.name}`
    );
    file.mv(pathSave, err => {
      if (err) {
        return res.status(500).json({
          status: "fail",
          message: err
        });
      }
    });
    res.status(200).json({
      status: "success",
      data: file.name
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
//likePost
exports.likePost = async (req, res) => {
  try {
    let likes = req.body.likes + 1;
    await Post.updateOne(
      { _id: req.params.id },
      {
        likes
      }
    );
    res.status(200).json({
      status: "success",
      data: likes
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

//deleteOne
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

//test-patch
exports.testEndPoint = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Testing the end-point: /api/v1/posts/test"
  });
};

//MONGO/MONGOOSE AGGREGATION
exports.stats = async (req, res) => {
  const randomNum = gzUI(5, 10); //my own npm package
  try {
    const stats = await Post.aggregate([
      {
        $match: { by: "gustavo" }
      },
      {
        $group: {
          _id: "$location",
          total: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: { total: 0 }
      }
    ]);
    res.status(200).json({
      status: "success",
      data: stats,
      randomNum
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
