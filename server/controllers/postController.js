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
    /*if (req.files === null) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const file = req.files.postImage;
    file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });*/

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
