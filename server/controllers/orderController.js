import Order from "../models/Orders.js";
import Request from "../models/farmerModels.js";
import Product from "../models/farmerModels.js";
//import Delivery from "../models/Delivery.js";
import { User } from "../models/User.js";
app.get("/orders/pending", async (req, res) => {
    try {
      const orders = await Order.find({ status: "Pending" }).populate("requestid");
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  
  // Get Accepted Orders
  app.get("/orders/accepted", async (req, res) => {
    try {
      const orders = await Order.find({ accept_status: "accept" }).populate("requestid");
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch accepted orders" });
    }
  });
  
  // Accept Order
  app.put("/orders/accept/:orderId", async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(req.params.orderId, { accept_status: "accept" }, { new: true });
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json({ message: "Order accepted", order });
    } catch (err) {
      res.status(500).json({ error: "Failed to accept order" });
    }
  });
  
  // Reject Order
  app.delete("/orders/reject/:orderId", async (req, res) => {
    try {
      const order = await Order.findByIdAndDelete(req.params.orderId);
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json({ message: "Order rejected" });
    } catch (err) {
      res.status(500).json({ error: "Failed to reject order" });
    }
  });
  
  // Upload Delivery Proof & Mark as Delivered
  app.post("/orders/proof/:orderId", upload.single("proof"), async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.orderId,
        { status: "Delivered", deliveryProof: req.file.filename },
        { new: true }
      );
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json({ message: "Order marked as Delivered", order });
    } catch (err) {
      res.status(500).json({ error: "Failed to upload proof" });
    }
  });
  
  // Get Farmer Location via Request ID
  app.get("/farmer/location/:requestId", async (req, res) => {
    try {
      const request = await Request.findById(req.params.requestId).populate("farmerId");
      if (!request) return res.status(404).json({ error: "Request not found" });
  
      const farmer = await User.findById(request.farmerId);
      if (!farmer) return res.status(404).json({ error: "Farmer not found" });
  
      res.json({ farmerLocation: farmer.location });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch farmer location" });
    }
  });