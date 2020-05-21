const { promisify } = require("util");
const crypto = require("crypto");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    //convert the below to miliseconds = 90d * 24h * 60m * 60s * 1000mili
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //true = cookie can't be accessed or modified by the browser
    secure: req.secure || req.headers["x-forwarded-proto"] === "https", //true = only sent in encrypted connection (HTTPS)
  }); //res.cookie('name', data, {options})

  //remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  //TODO: the above is replaced by the below - problem with the above is that the user can send a body to that route with say {admin: true} and this is not good
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const url = "https://zona.gustavozapata.me";
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) check if email and password were entered (were sent)
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2) check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3) if everything is ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) getting the token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    //401 = unauthorized
    return next(
      new AppError("You are not logged in. Please log in to get access", 401)
    );
  }

  //2) verification token - jwt.verify(token sent by user, SECRET in .env)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //+we use 'promisify' (a node built-in util) that converts a method into a promise

  //3) check if user still exists - this is an extra step (what if the user has deleted the account after the token has been issued) - the token should then not work
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError(
        "The user belonging to this token does not longer exist",
        401
      )
    );

  //4) check if user changed password after the token was issued - if the token gets stolen and user changes password, that token shouldn't be valid
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password. Please log in again", 401)
    );
  }

  //5) finally, if we make it here, next() will grant access to protected route
  req.user = currentUser; //by modifying the req.user we will be able to use it downwards (middleware flow)
  next();
});

//FIXME: (TO BE IMPLEMENTED IN VIEW ENGINE (PUG))
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next();

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    //res.locals : all view engine have access to res.locals object
    res.locals.user = currentUser;
    next();
  }
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin', 'developer']  if(roles doens't have any of those 2) don't give persmission
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      ); //403 = forbidden (user has not permission to access this)
    }
    next();
  };
};

exports.invitationCode = (req, res, next) => {
  if (req.body.code !== process.env.INVITATION_CODE) {
    return next(new AppError("Wrong code", 400));
  }

  res.status(200).json({
    status: "success",
    data: true,
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address", 404)); //404 = NOT FOUND
  }

  //2) generate the random reset
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later.",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) if token has not expired and there is user, set new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  //we use save() and not findOneAndUpdate() for everything related to users and passwords so we can use our own validators (validate: {...} in the model)
  await user.save();

  //3) update changePasswordAt property for the user **this is handled in the userModel.js

  //4) log the user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. get user from collection
  const user = await User.findById(req.user.id).select("+password"); //since this scenario the user is logged, we have access to the id from the protect() middleware

  //2. check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }

  //3. if so, update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  //4. log user in, send JWT
  createSendToken(user, 200, req, res);
});
