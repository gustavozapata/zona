const Post = require("../models/postModel");
const dotenv = require("dotenv");
const gzUI = require("gz-ui-react");

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
//saveImage
exports.saveImage = async (req, res) => {
  try {
    const file = req.files.postImage;
    //${__dirname}/client/public/
    file.mv(
      `/Users/guquinon/Downloads/GZ/Development/zona/client/src/images/posts/${file.name}`,
      err => {
        if (err) {
          return res.status(500).json({
            status: "fail",
            message: err
          });
        }
      }
    );
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
