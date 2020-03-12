const dotenv = require("dotenv");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");

dotenv.config();

exports.usersAlias = (req, res, next) => {
  req.query.sort = "name";
  req.query.fields = "email,password";
  req.query.limit = "5";
  next();
};

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

exports.invitationCode = async (req, res) => {
  if (req.body.code === process.env.INVITATION_CODE) {
    res.status(200).json({
      status: "success",
      data: true
    });
  }
};

//TODO: I DONT THINK THIS IS SECURE (GET ALL USERS)
exports.getAllUsers = async (req, res) => {
  try {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await features.query;

    //SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { user }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: "success",
      data: { user }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
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
//ZONA

exports.checkLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.find({ email, password });
  if (user.length > 0) {
    res.json({ logged: true, user: user[0].name });
  } else {
    res.json({ logged: false });
  }
};
