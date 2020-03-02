//THIS FILE IS OUR MODEL THE SCHELETON OF OUR COLLECTION (TABLE) - IT'S LIKE A CLASS IN OOP
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "you must enter a title"]
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
    likes: {
      type: Number
    },
    location: {
      type: String,
      required: true
    }
  },
  {
    toJSON: { virtuals: true }
  }
);

postSchema.virtual("myVirtual").get(function() {
  return this.likes * 5;
});

//"posts" is the name of the collection (table)
module.exports = Post = mongoose.model("posts", postSchema);
