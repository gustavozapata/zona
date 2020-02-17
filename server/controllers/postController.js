const Post = require("../models/postModel");
const dotenv = require("dotenv");

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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

//witeteAll
exports.insertPosts = (req, res) => {
  const data = require("../data/zona");
  console.log(data);
  conn.collection("posts").insertMany(data, () => {
    res.json({
      api: "write all posts",
      status: 200,
      description: "wrote all posts successfully"
    });
  });
};

//deleteAll
exports.deletePosts = (req, res) => {
  conn.collection("posts").deleteMany({}, () => {
    res.json({
      api: "delete all posts",
      status: 200,
      description: "deleted all posts successfully"
    });
  });
};

//deleteOne
exports.deletePost = (req, res) => {
  conn.collection("posts").deleteOne({ name: req.params.id }, () => {
    res.json({
      api: "delete one product",
      status: 200,
      description: "deleted a product successfully"
    });
  });
};
