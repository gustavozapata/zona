//THIS FILE IS OUR MODEL THE SCHELETON OF OUR COLLECTION (TABLE) - IT'S LIKE A CLASS IN OOP
const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./userModel");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "You must enter a description"],
    },
    location: {
      type: String,
      required: [true, "You must enter a location"],
    },

    //FIXME: (IMPLEMENT)
    geolocation: {
      //Mongo calls this 'GeoJSON' data format
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number], //longitude first, latitude second
      address: String,
      description: String,
    },
    // byEmbedding: Object,  //to embed documents into another document
    byReferencing: {
      type: mongoose.Schema.ObjectId, //to reference docs to another doc
      ref: "User",
    },
    commentsEmbedding: Array,
    slug: String,
    //FIXME: (IMPLEMENT)

    image: {
      type: String,
      default: "none",
      required: true,
    },
    by: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: Date.now,
    },
    love: {
      type: Number,
      default: 0,
    },
    funny: {
      type: Number,
      default: 0,
    },
    comments: [Object],

    //FIXME: (DEV PURPOSE)
    ratingsQty: {
      type: Number,
      default: 0,
    },
    ratingsAvg: {
      type: Number,
      min: [1, "rating must be above 1.0"],
      max: [5, "rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.6666 round will give 47. To get 4.7 we use * 10 / 10 trick
    },
    //FIXME: (DEV PURPOSE)
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//INDEXES
postSchema.index({ by: 1, location: -1 }); //1 = ascending order, -1 descending
postSchema.index({ slug: 1 });
postSchema.index({ geolocation: "2dsphere" });

postSchema.virtual("myVirtual").get(function () {
  return this.love * 5;
});

// Virtual Populate
postSchema.virtual("comments_ref", {
  //'commnets_ref' is the name of the field that is going to be shown in the result
  ref: "Comment", //name of the model
  foreignField: "post", //this is the name of the field in the Comment model where the reference to the current model is stored
  localField: "_id", //this is the name of the foreignField here in the local model (Post Model)
});

//TODO: (IF NEEDED) EMBEDDING
// postSchema.pre("save", async function (next) {
// MULTIPLE EMBEDDING
// const commentsEmbeddingPromises = this.commentsEmbedding.map(
//   async (id) => await User.findById(id)
// );
// this.commentsEmbedding = await Promise.all(commentsEmbeddingPromises);

// SINGLE EMBEDDING
// const user = await User.findById(this.byEmbedding);
// this.byEmbedding = user;
// next();
// });

postSchema.pre("save", function (next) {
  this.slug = slugify(this.description, { lower: true });
  next();
});

postSchema.pre(/^find/, function (next) {
  this.queryTime = Date.now();
  next();
});

//Referencing
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "byReferencing",
    select: "-__v -photo", //don't display this field
  });
  next();
});

postSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.queryTime}`);
  next();
});

//"posts" is the name of the collection (table)
//FIXME: (NOT SURE ABOUT ABOVE) I THINK 'POST' IS JUST THE NAME OF THIS MODEL
module.exports = Post = mongoose.model("Post", postSchema);
