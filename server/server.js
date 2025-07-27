process.env.MONGO_URI = "mongodb://127.0.0.1:27017/agridb";
process.env.PORT = "5000";
process.env.JWT_SECRET = "1c821b43a1b347b1c547f0eca69102e06fe92b486a0fe2830472b9c99d218e86";
process.env.NODE_ENV = "development";

import express from "express";
import cors from "cors";
import { connectDB } from './db/connectDB.js';
import authRoutes from "./routes/auth.js";

import farmerRoutes from "./routes/farmer.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import deliveryRoutes from "./routes/delivery.js";
const app = express();


app.use(cors({
    origin: "http://localhost:5173",  // Allow only your frontend origin
    credentials: true,  // Allow cookies/authentication headers
    methods: "GET,POST,PUT,DELETE",  // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization",  // Allowed headers
  }));

const PORT = process.env.PORT || 5000;


//console.log("JWT_SECRET:", process.env.JWT_SECRET);

app.use(express.json()); //allows us to parse incoming requests :req.body

app.use("/api/auth", authRoutes);

app.use("/api/farmer", farmerRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/orders",orderRoutes);
app.use("/api/delivery",deliveryRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, "0.0.0.0", () => {
  connectDB();
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

 

