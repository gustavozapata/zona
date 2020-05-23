const Post = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const dotenv = require("dotenv");
const gzUI = require("gz-ui-react");
const multer = require("multer");

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPost = factory.createOne(Post);
exports.getPost = factory.getOne(Post, { path: "comments_ref" });
exports.getAllPosts = factory.getAll(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);

//like post
exports.likePost = catchAsync(async (req, res, next) => {
  const reaction = req.body.reaction === "love" ? "love" : "funny";
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { [reaction]: 1 } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: post[reaction],
  });
});

//post comment
exports.postComment = catchAsync(async (req, res, next) => {
  console.log(req.body);
  await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: req.body },
  });
  res.status(200).json({
    status: "success",
    data: "ok",
  });
});

//buy post
exports.buyPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  //1. create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `https://zona.gustavozapata.me`,
    cancel_url: `https://zona.gustavozapata.me`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    line_items: [
      {
        //info about the product
        name: `${post.description}`,
        description: `${post.location}`,
        images: [`https://server.gustavozapata.me/zona/public/${post.image}`],
        amount: post.price * 100, //convert to cents (pens) since stripe expects cents
        currency: "usd",
        quantity: 1,
      },
    ],
  });

  //2. create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});
exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    createCheckout(event.data.object);

  res.status(200).json({ received: true });
};
const createCheckout = async (session) => {
  //TODO: uncomment below if want to store buying info
  // const post = session.client_reference_id
  // const user = await User.findOne({email: session.customer_email}).id
  // const price = session.display_items[0].amount / 100
  // await Sales.create({post, user, price})
  console.log("This method will be used when storing the checkout/buying info");
};

exports.checkId = (req, res, next, val) => {
  console.log(`the id is: ${val}`);
  next();
};

exports.stats = catchAsync(async (req, res, next) => {
  const randomNum = gzUI(5, 10); //my own npm package
  const stats = await Post.aggregate([
    {
      $match: { by: "Gustavo" },
    },
    {
      $group: {
        _id: "$location",
        total: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: { total: 0 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: stats,
    randomNum,
  });
});

//Geospatial feature
exports.getPostsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(","); //url search first lat, then lng

  //if miles ? then pass the radius of the earth in miles (3963.2), if km then 6378.1 km
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat, lng",
        400
      )
    );
  }

  const posts = await Post.find({
    geolocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }, //here lng is first
  });

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      data: posts,
    },
  });
});
exports.getDistance = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(","); //url search first lat, then lng

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat, lng",
        400
      )
    );
  }

  const distances = await Post.aggregate([
    {
      //$geoNear has to be the first one - this is the only stage (aggregate) that exists for geospatial data in mongo
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1], // * 1 to convert to a number
        }, //this is the point from which we calculate the distance
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});

//test-patch
exports.testEndPoint = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "checkpoint - Windows project setup and running",
    env: process.env.NODE_ENV,
  });
};

//FIXME: (OLD CODE) upload image version 2
const uploadImageV2 = () => {
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images/posts");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  const multerFilter = (req, file, cb) => {
    //filters the files - only accepts images
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("only images please"), false);
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  exports.uploadPostImage = upload.single("postImage");
  exports.saveImage = (req, res) => {
    res.status(200).json({
      status: "success",
      message: "post image uploaded",
    });
  };
};
