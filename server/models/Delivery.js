import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  requestid:{ type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
  deliveryid:{ type: mongoose.Schema.Types.ObjectId, ref: "User"},
  accept_status: { type: String,default:null}, // accept or reject
  status: { type: String, default: "Pending" },
  mapLink: String,
  createdAt: { type: Date, default: Date.now },
  otp: {
    type: String, // Stores OTP code
    default: null, // Initially null
  },
  otpExpiresAt: {
    type: Date, // Stores OTP expiration time
    default: null,
  },
});

  const Delivery = mongoose.model("Delivery", deliverySchema);
  export default Delivery;
