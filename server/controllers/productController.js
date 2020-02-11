const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const conn = { void: true }; //BORRAR

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

//getAll TODO:
exports.getProducts = (req, res) => {
  conn
    .collection("posts")
    .find({})
    .toArray((err, db_res) => {
      res.send(db_res);
    });
};

//insertOne
exports.addProduct = (req, res) => {
  conn.collection("products").insertOne(req.body, () => {
    res.json({
      api: "insert one product",
      status: 200,
      description: "inserted a product successfully"
    });
  });
};

//witeteAll TODO:
exports.insertProducts = (req, res) => {
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
exports.deleteProducts = (req, res) => {
  conn.collection("products").deleteMany({}, () => {
    res.json({
      api: "delete all products",
      status: 200,
      description: "deleted all products successfully"
    });
  });
};

//deleteOne
exports.deleteProduct = (req, res) => {
  conn.collection("products").deleteOne({ name: req.params.id }, () => {
    res.json({
      api: "delete one product",
      status: 200,
      description: "deleted a product successfully"
    });
  });
};
