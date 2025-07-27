import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Product, Request } from "../models/farmerModels.js";
import authenticateUser from '../middlewares/authenticateUser.js';
const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });



// Add Product
router.post("/products",authenticateUser, upload.single("image"), async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            category: req.body.category,
            quantity: req.body.quantity,
            price: req.body.price,
            image: req.file ? `/uploads/${req.file.filename}` : null,
            userID: req.user.id,
        }); 
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
});

// Delete Product
router.delete("/products/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userID } = req.user;  // Destructuring userID from authenticated user

        if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find and delete the product by ID
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the authenticated user owns the product
        if (deletedProduct.userID.toString() !== userID) {
            return res.status(403).json({ message: "Unauthorized to delete this product" });
        }

        // Successfully deleted
        return res.status(204).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting product", error });
    }
});


// Get All Products
router.get("/products", authenticateUser, async (req, res) => {
    try {
        // Fetch products belonging to the logged-in user
        const products = await Product.find({ userID: req.user.id }); // Ensure this is filtering by userID
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
});

router.get("/cd/products", async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error });
    }
  });


// Get Product by ID
router.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
});

router.put("/products/:id", authenticateUser, upload.single("image"), async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const { id: userID } = req.user;
  
      // Fetch the product once and handle everything with it
      const existingProduct = await Product.findById(id);
  
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Check if the user is the owner of the product
      if (existingProduct.userID.toString() !== userID) {
        return res.status(403).json({ message: "Unauthorized to update this product" });
      }
  
      // Prepare the fields to update based on the incoming data
      let updatedFields = {};
  
      if (req.body.quantity) {
        updatedFields.quantity = Number(req.body.quantity); // Only update quantity
      }
  
      // Handle image update (optional)
      if (req.file) {
        if (existingProduct.image) {
          const oldImagePath = `.${existingProduct.image}`;
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updatedFields.image = `/uploads/${req.file.filename}`;
      }
  
      // If there are no updates (quantity or image), do not attempt to update the product
      if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: "No updates provided" });
      }
  
      // Update the product in the database
      const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
  
      if (!updatedProduct) {
        return res.status(500).json({ message: "Failed to update product" });
      }
  
      res.json(updatedProduct); // Send the updated product
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Error updating product", error: error.message });
    }
  });
  


// Create a Request
router.post("/requests", async (req, res) => {
    try {
        const { customerName, phoneNumber, location, quantityReq, pID , userID } = req.body;
        if (!customerName || !phoneNumber || !location || !quantityReq || !pID) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const product = await Product.findById(pID);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const newRequest = new Request({
            customerName,
            phoneNumber,
            location,
            quantityReq,
            pID: product._id,
            userID:req.user.id,
        });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: "Error creating request", error });
    }
});

// Get All Requests
router.get("/requests", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;  // Get the userID from the token
        console.log("User ID from token:", userId); // Log the user ID

        // Fetch the products owned by the user
        const products = await Product.find({ userID: userId });
        console.log("Products owned by user:", products);  // Log products

        if (products.length === 0) {
            return res.json([]);  // Return empty if no products found
        }

        const pIDs = products.map(product => product._id);
        console.log("Product IDs to match:", pIDs);  // Log the pIDs

        // Query for requests that match the product IDs
        const requests = await Request.find({ pID: { $in: pIDs } });
        console.log("Fetched Requests:", requests);  // Log the fetched requests

        res.json(requests);  // Send the requests as the response
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Error fetching requests", error });
    }
});

  

export default router;
