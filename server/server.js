const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exception! Shutting down...");
  process.exit(1);
});

dotenv.config({ path: "./.env" });

const DB = process.env.DB_URI.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("*** Connected to MongoDB ***");
  });

const port = process.env.PORT || 4000;
const server = app.listen(port, () =>
  console.log(
    `*** Server running in ${process.env.NODE_ENV} mode on port ${port} ***`
  )
);

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

//TODO: (HEROKU) - H sends SIGTERM every 24h to ensure the Denos work well and this shuts down the app
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  server.close(() => {
    //this is why we manually close it to ensure all requests are completed
    console.log("Process terminated");
  });
});
