const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
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
  photo: {
    type: String,
    default: "user",
  },
  role: {
    type: String,
    enum: ["user", "developer", "admin"], //enum = these are the only allowed fields
    default: "user",
  },
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
  next(); //this calls the function below with the password encrypted
});

userSchema.pre("save", function (next) {
  //if the password is not modified or this is a new document (a newly created user)
  if (!this.isModified("password") || this.isNew) return next();

  //else (so if the pass has been modified), set the passwordChangedAt property
  this.passwordChangedAt = Date.now() - 1000; // - 1sec since we want to make sure the token is created after the pass has been changed
  next();
});

userSchema.pre(/^find/, function (next) {
  //run this before any 'User.find()' runs in our app - this hides the users with active: false
  this.find({ active: { $ne: false } });
  next();
});

//this is an instance method (it's available in all documents of a collection i.e. userController.js can access it)
//this is in contrast to 'static' methods like: User.findOne() that act on the model
//instance methods act on the document, the instance, the object e.g. {id: 1, name: tavo}
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    //if token was issued at time 100, and password was changed at 200
    return JWTTimestamp < changedTimestamp; //100 < 200 (true means password was changed so token is invalid)
  }

  //false means = NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  //this token is sent to the user
  const resetToken = crypto.randomBytes(32).toString("hex"); //as a hexadecimal value

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
