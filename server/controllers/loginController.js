const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const db = process.env.MONGO_URI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("*** Login DB ***"))
  .catch(error => console.log(error));
const conn = mongoose.connection;
//DATABASE

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
