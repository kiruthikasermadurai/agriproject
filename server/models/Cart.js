import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
   // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   userId : String,
 // products: [{ productId: String, name: String, price: Number, quantity: Number }],
 products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // ✅ Reference Product
      quantity: { type: Number, required: true },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;

