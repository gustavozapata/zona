const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must enter a name"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "You must enter an email"],
    unique: true,
    lowecase: true, //converts email to lowercase
    validate: [validator.isEmail, "Please enter a valid email"],
    trim: true, //removes leading or trailing spaces
  },
  photo: String,
  password: {
    type: String,
    required: [true, "You must enter a password"],
    minlength: 5, //password length must be minumum 5 character
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //FIXME: (ALERT) THIS ONLY WORK ON User.save(), User.create() AND NOT WITH User.findOneAndUpdate()
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// .pre() runs right before writing the data in the db
userSchema.pre("save", async function (next) {
  //only run this function if password is modified, if it's not just return next()
  if (!this.isModified("password")) return next();

  //hash the password with cost at 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete the confirmPassword field
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
