import express from "express";
import { Product } from "../models/farmerModels.js";
import Order from "../models/Order.js";
const router = express.Router();
import mongoose from "mongoose";
import { User } from "../models/User.js";
// Get User Details
router.get('/users/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findById(userId).select("name email");
      
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch user" });
  }
});
router.get("/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log("🔍 Fetching orders for:", userId);
  
      const orders = await Order.find({ userId }).populate("products.productId");
  
      if (!orders.length) {
        console.log("⚠️ No orders found for user:", userId);
        return res.status(404).json({ message: "No past orders found." });
      }
  
      res.json(orders);
    } catch (error) {
      console.error("❌ Server Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  export default router;