import express from "express";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import { User } from "../models/User.js";
import authenticateUser from '../middlewares/authenticateUser.js';
import Delivery from "../models/Delivery.js";
const router = express.Router();
import mongoose from "mongoose";
import { Product,Request } from "../models/farmerModels.js";

// Add to Cart
router.post("/add", async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      console.log("Received cart request:", req.body); // ✅ Debugging
  
      if (!userId || !productId) {
        console.log("❌ Missing data:", { userId, productId });
        return res.status(400).json({ message: "Missing user or product ID" });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" }); // ✅ Added ObjectId validation
      }
  
      // ✅ Convert userId to ObjectId
      const objectIdUserId = new mongoose.Types.ObjectId(userId);
      console.log("🟩 Converted userId to ObjectId:", objectIdUserId); // Step 2: Verify ObjectId conversion

      let cart = await Cart.findOne({ userId: objectIdUserId });
      console.log("🟨 Found cart:", cart);

      if (!cart) {
        cart = new Cart({ userId: objectIdUserId, products: [] });
        console.log("🟦 Created new cart:", cart); 
      }
  
      const existingProduct = cart.products.find((p) => p.productId.toString() === productId);
  
      if (existingProduct) {
        existingProduct.quantity += quantity;
        console.log("🟧 Updated existing product quantity:", existingProduct); // Step 5: Confirm product update
      } else {
        cart.products.push({ productId, quantity });
        console.log("🟪 Added new product to cart:", cart.products);
      }
  
      await cart.save();
      res.status(200).json({ message: "Added to cart successfully!" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  




// Get Cart
router.get("/:userId", async (req, res) => {
    try {
        console.log("Fetching cart for user:", req.params.userId);
        const cart = await Cart.findOne({ userId: req.params.userId }).populate("products.productId");

        if (!cart || !cart.products || cart.products.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        const populatedProducts = cart.products.map((item) => ({
            productId: item.productId?._id || "Unknown",
            name: item.productId?.name || "Unknown",
            price: item.productId?.price || 0,
            quantity: item.quantity,
            image: item.productId?.image || "MISSING",
        }));

        res.json(populatedProducts);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Server error", error });
    }
});



// Update Cart
router.put("/update", async (req, res) => {
    const { userId, productId, action } = req.body;
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (action === "increment") {
            cart.products[productIndex].quantity += 1;
        } else if (action === "decrement") {
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity -= 1;
            } else {
                cart.products.splice(productIndex, 1);
            }
        }

        await cart.save();
        return res.json({ success: true, cart });

    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Remove from Cart
router.delete("/remove", async (req, res) => {
    const { userId, productId } = req.query;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);

        await cart.save();
        return res.json({ success: true, cart });

    } catch (error) {
        console.error("Error removing item from cart:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

router.post("/checkout", async (req, res) => {
  try {
    const { userId, products, phoneNumber, location } = req.body;
    
    // ✅ Check for missing fields
    if (!userId || !products || products.length === 0 || !phoneNumber || !location) {
      console.log("❌ Missing required fields in the request");
      return res.status(400).json({ message: "Please provide all required details (userId, products, phoneNumber, location)" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }
    const customerName = user.name;
    console.log(customerName)

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log("❌ Cart not found for user:", userId);
      return res.status(404).json({ message: "Cart not found" });
    }

    let totalAmount = 0;
    const requestEntries = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        console.log(`❌ Product ${item.productId} not found`);
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.quantity < item.quantity) {
        console.log(`❌ Not enough stock for ${product.name}`);
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      if (product.quantity === 0) {
        console.log(`❌ No stock for ${product.name}`);
        return res.status(400).json({ message: `No stock for ${product.name}` });
      }

      // ✅ Update stock quantity
      //product.quantity -= item.quantity;
      totalAmount += product.price * item.quantity;
      await product.save();

      // ✅ Prepare request entry with phone and location
      const requestEntry = {
        customerName,
        phoneNumber,        // Store phone number
        location,           // Store location
        quantityReq: item.quantity,
        pID: product._id,
        userID: userId,
      };

      requestEntries.push(requestEntry);
    }

    console.log("✅ Creating new order...",requestEntries);
    const newOrder = new Order({
      userId,
      products,
      totalAmount,
    });

    await newOrder.save();
    console.log("✅ Order saved successfully!");

    // ✅ Insert request entries into Request table with phone and location
    let insertedRequests = [];
    if (requestEntries.length > 0) {
      insertedRequests = await Request.insertMany(requestEntries);
      console.log("✅ Request entries saved successfully with location and phone number!");
    }

    // ✅ Create Delivery entries for each request
    const deliveryEntries = insertedRequests.map((req) => ({
      requestid: req._id,
      accept_status: "pending",
    }));

    await Delivery.insertMany(deliveryEntries);
    console.log("✅ Delivery entries saved successfully!");

    // ✅ Remove checked-out items from cart
    cart.products = cart.products.filter(
      (cartItem) => !products.some((p) => p.productId === cartItem.productId.toString())
    );
    await cart.save();

    res.status(200).json({
      message: "Checkout successful!",
      checkedOutItems: products,
      location,
      phoneNumber,
    });

  } catch (error) {
    console.error("❌ Error during checkout:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
export default router;
