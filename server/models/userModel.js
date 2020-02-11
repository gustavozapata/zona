const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: String,
  password: String
});

const User = mongoose.model("users", userSchema);

module.exports = User;
