//THIS FILE IS OUR MODEL THE SCHELETON OF OUR COLLECTION (TABLE) - IT'S LIKE A CLASS IN OOP
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, "you must enter a title"]
  },
  image: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

//"posts" is the name of the collection (table)
module.exports = Post = mongoose.model("posts", postSchema);
