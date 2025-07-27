import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    quantity: Number,
    price: Number,
    image: String,
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { versionKey: false });

const requestSchema = new mongoose.Schema({
    customerName: String,
    phoneNumber: String,
    location: String,
    quantityReq: Number,
    pID: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export const Product = mongoose.model("Product", productSchema);
export const Request = mongoose.model("Request", requestSchema);
