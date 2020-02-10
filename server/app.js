const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const productRouter = require("./routes/productRoutes");
const itemRouter = require("./routes/itemRoutes");
const loginRouter = require("./routes/loginRoutes");

const app = express();

//MIDDLEWARE
// if (process.env.NODE_env === "development") { USE THIS ONE WHEN USING dotenv()
if (app.get("env") === "development") {
  app.use(morgan("dev")); //logs all the end-point calls
}
app.use(cors()); //allows *
app.use(express.static("public")); //serves files (html, css, js) in the public folder
app.use(express.json()); //allows us to access the body of the request

//ROUTES - MOUNTING THE ROUTERS
app.use("/api/v1/products", productRouter);
app.use("/api/v1/items", itemRouter);

//ZONA
app.use("/api/v1/login", loginRouter);

module.exports = app;
