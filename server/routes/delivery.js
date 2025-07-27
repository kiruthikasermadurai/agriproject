import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import Delivery from "../models/Delivery.js";
import { Product, Request } from "../models/farmerModels.js";

const router = express.Router();

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

//  Get All Unaccepted Deliveries (Visible to All Delivery Men)
router.get("/assignments", async (req, res) => {
  try {
    const deliveries = await Delivery.find({ accept_status: "pending" })
    .populate({
      path: "requestid",
      populate: {
        path: "pID", //  Get product details
        model: "Product",
        populate: {
          path: "userID", // Get farmer details from Product table
          model: "User", // Assuming User model stores farmer details
          select: "name location email", // Only fetch name & address
        },
      }
    });

    console.log(JSON.stringify(deliveries, null, 2)); // Debugging
    res.status(200).json({ success: true, deliveries });
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ success: false, error: "Failed to fetch deliveries" });
  }
});


// ✅ Accept a Delivery
router.put("/accept/:deliveryId/:deliverymanId", async (req, res) => {
  try {
    const { deliveryId, deliverymanId } = req.params;
    const delivery = await Delivery.findById(deliveryId);
    console.log(deliverymanId);
    if (!delivery || delivery.accept_status === "accept") {
      return res.status(400).json({ success: false, error: "Delivery already accepted" });
    }

    delivery.accept_status = "accept";
    delivery.deliveryid = deliverymanId;
    await delivery.save();

    res.status(200).json({ success: true, message: "Delivery accepted", delivery });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to accept delivery" });
  }
});

// ✅ Get Assigned Deliveries
router.get("/my-deliveries/:deliverymanId", async (req, res) => {
  
  try {
    const { deliverymanId } = req.params;
    const deliveries = await Delivery.find({
      accept_status: "accept",
      deliveryid: deliverymanId,
    })
      .populate({
        path: "requestid",
        populate: [
          {
            path: "pID", //  Get Product details
            model: "Product",
            populate: {
              path: "userID", //  Get farmer details from Product
              model: "User",
              select: "name location", //  Fetch only name & location
            },
          },
          {
            path: "userID", //  Get customer details
            model: "User",
            select: "email", //  Fetch email only
          },
        ],
      });
    console.log(deliveries);
    res.status(200).json({ success: true, deliveries });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch deliveries" });
  }
});

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kiruthikasermadurai2004@gmail.com", // Replace with your email
    pass: "cdvw hfss ppcy ruzg", // Replace with your app password
  },
});

const generateOTP = () => ({
  otp: Math.floor(100000 + Math.random() * 900000).toString(),
  expiresAt: Date.now() + 5 * 60 * 1000, // OTP valid for 5 minutes
});


router.post("/send-otp/:deliveryId", async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const delivery = await Delivery.findById(deliveryId).populate({
      path: "requestid",
      populate: {
        path: "userID",
        model: "User",
        select: "email",
      },
    });

    if (!delivery || !delivery.requestid?.userID) {
      return res.status(404).json({ success: false, error: "Customer email not found" });
    }

    const userEmail = delivery.requestid.userID.email;
    const { otp, expiresAt } = generateOTP();

    delivery.otp = otp;
    delivery.otpExpiresAt = expiresAt;
    await delivery.save();

    const mailOptions = {
      from: "kiruthikasermadurai2004@gmail.com",
      to: userEmail,
      subject: "Delivery OTP Verification",
      text: `Your OTP for delivery verification is: ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "OTP sent to customer email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});
router.post("/verify-otp/:deliveryId", async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { enteredOtp } = req.body;

    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return res.status(404).json({ success: false, error: "Delivery not found" });
    }

    if (!delivery.otp || !delivery.otpExpiresAt || new Date() > delivery.otpExpiresAt) {
      return res.status(400).json({ success: false, error: "OTP expired. Please request a new one." });
    }

    if (delivery.otp !== enteredOtp) {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    delivery.status = "Delivered";
    delivery.otp = null; // Clear OTP after successful verification
    delivery.otpExpiresAt = null;
    await delivery.save();

    res.status(200).json({ success: true, message: "Delivery marked as Delivered" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to verify OTP" });
  }
});


export default router;
