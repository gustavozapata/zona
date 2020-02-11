const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const DB = process.env.DB_URI.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log("*** Connected to MongoDB ***");
  });

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`*** Server running on port ${port} ***`));
