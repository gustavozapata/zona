const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");
const commentRouter = require("./routes/commentRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

//VIEW ENGINE (PUG)
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

dotenv.config();

//GLOBAL MIDDLEWARE
app.use(express.static(path.join(__dirname, "public"))); //serves files (html, css, js) in the "public" folder - .static(`${__dirname}/public`) is also used
app.use(helmet()); //set security HTTP Headers
// if (app.get("env") === "development") { //USE THIS ONE WHEN NO USING dotenv()
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //logs all the end-point calls
}
const limiter = rateLimit({
  max: 100, //number of requests allowed
  windowMs: 60 * 60 * 1000, //100 request per hour = 60m * 60s * 1000ms
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter); //only apply the limiter to /api path

// app.use(cors()); //allow-access: *
app.use(cors({ credentials: true, origin: "https://zona.gustavozapata.me" }));
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// app.use(fileUpload()); //to upload files

app.use(express.json()); //allows us to access the body of the request
// app.use(express.json({limit: '10kb'})); //limit the amount of data that can be sent - it's comment out since images might be larger
app.use(cookieParser()); //parses the data from cookies coming from the server (allows us to access the cookie of the request)

app.use(mongoSanitize()); //data sanitization against NoSQL query injection
app.use(xss()); //data sanitization against XSS

app.use(
  hpp({
    //these are going to be valid when using them in the url: api/post?love=3&love=4 etc.
    whitelist: ["love", "funny", "description", "location", "by"],
  })
); //prevent parameter pollution - it clears up the query string

//testing middleware (for all requests)
app.use((req, res, next) => {
  // console.log("req.cookies: ", req.cookies);
  next();
});

//ROUTES - MOUNTING THE ROUTERS
app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

app.all("*", (req, res, next) => {
  //all requests (get, post, etc) and any path (*)
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler); //the error handler middleware

module.exports = app;
