const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//DATABASE
const db = process.env.MONGO_URI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("*** Connected to MongoDB ***"))
  .catch(error => console.log(error));
const conn = mongoose.connection;
//DATABASE

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
exports.getProducts = (req, res) => {
  conn
    .collection("products")
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

//witeteAll
exports.insertProducts = (req, res) => {
  const data = require("../data/db");
  conn.collection("products").insertMany(data, () => {
    res.json({
      api: "write all products",
      status: 200,
      description: "wrote all products successfully"
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
