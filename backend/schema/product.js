const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pid: { type: Number, unique: true , required: true},
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  keywords: [String],
  brand: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
