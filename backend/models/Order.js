const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
        title: { type: String },
        price: { type: Number },
        img: { type: String }
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" }, // pending, delivered, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);