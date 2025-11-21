const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    firstImg: { type: String, required: true },
    secondImg: { type: String, required: true },
    price: { type: Number, required: true },
    stars: { type: Number, default: 4 },
    // NEW: Link product to a specific Vendor (User ID)
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);