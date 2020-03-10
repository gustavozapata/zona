const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

dotenv.config();

//MIDDLEWARE
// if (app.get("env") === "development") { //USE THIS ONE WHEN NO USING dotenv()
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //logs all the end-point calls
}
app.use(cors()); //allow-access: *
app.use(fileUpload()); //to upload files
app.use(express.static("public")); //serves files (html, css, js) in the "public" folder
app.use(express.json()); //allows us to access the body of the request

//ROUTES - MOUNTING THE ROUTERS
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
// mensaje para git testing
module.exports = app;
