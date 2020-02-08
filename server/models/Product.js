//THIS FILE IS OUR MODEL THE SCHELETON OF OUR COLLECTION (TABLE)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  id: Number,
  name: String,
  country: String,
  category: String,
  price: String,
  available: Boolean
});

//"products" is the name of the collection (table)
module.exports = Product = mongoose.model("products", ProductSchema);
