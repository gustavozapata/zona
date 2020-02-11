const User = require("../models/userModel");

//DATABASE -- BORRAR
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();
// const db = process.env.DB_URI.replace("<PASSWORD>", process.env.DB_PASSWORD);
// mongoose
//   .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("*** Login DB ***"))
//   .catch(error => console.log(error));
// const conn = mongoose.connection;
//DATABASE -- BORRAR

//ZONA
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent"
    });
  }
};
//ZONA

exports.isLogged = (req, res) => {
  res.send("isLogged");
};

exports.checkLogin = (req, res) => {
  const { email, password } = req.body;
  conn
    .collection("users")
    .find({ email, password })
    .toArray((err, db_res) => {
      console.log(db_res);
      if (db_res.length > 0) {
        res.json({ logged: true });
      } else {
        res.json({ logged: false });
      }
    });
};
