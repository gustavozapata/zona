//THIS FILE IS OUR MODEL THE SCHELETON OF OUR COLLECTION (TABLE) - IT'S LIKE A CLASS IN OOP
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "you must enter a description"]
    },
    location: {
      type: String,
      required: [true, "you must enter a location"]
    },
    image: {
      type: String,
      default: "none",
      required: true
    },
    by: {
      type: String,
      required: true
    },
    date: {
      type: String,
      default: Date.now()
    },
    love: {
      type: Number,
      default: 0
    },
    funny: {
      type: Number,
      default: 0
    },
    comments: [Object]
  },
  {
    toJSON: { virtuals: true }
  }
);

postSchema.virtual("myVirtual").get(function() {
  return this.likes * 5;
});

postSchema.pre(/^find/, function(next) {
  this.queryTime = Date.now();
  next();
});
postSchema.post(/^find/, function(doc, next) {
  console.log(`Query took ${Date.now() - this.queryTime}`);
  next();
});

//"posts" is the name of the collection (table)
module.exports = Post = mongoose.model("posts", postSchema);
