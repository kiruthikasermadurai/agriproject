import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SupplierPage.css";
import Header from "./Header2";
import Footer from "./Footer";

const API_URL = "http://localhost:5000/api";

const SupplierPage = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [otp, setOtp] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliverymanId, setDeliverymanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem("deliveryid");
    if (savedId) {
      setDeliverymanId(savedId);
    } else {
      console.error("No deliveryman ID found");
    }
  }, []);

  useEffect(() => {
    if (deliverymanId) fetchOrders();
  }, [deliverymanId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [availableRes, myOrdersRes] = await Promise.all([
        axios.get(`${API_URL}/delivery/assignments`),
        axios.get(`${API_URL}/delivery/my-deliveries/${deliverymanId}`),
      ]);
      setAvailableOrders(availableRes.data.deliveries);
      setMyOrders(myOrdersRes.data.deliveries);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const acceptOrder = async (orderId) => {
    try {
      await axios.put(`${API_URL}/delivery/accept/${orderId}/${deliverymanId}`);
      alert("Order Accepted!");
      fetchOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const sendOtpToCustomer = async (deliveryId, email) => {
    if (!email) {
      alert(`Customer email not found! ${email}`);
      return;
    }
  
    try {
      await axios.post(`${API_URL}/delivery/send-otp/${deliveryId}`);
      alert(`OTP sent to customer: ${email}`);
      setSelectedOrder(deliveryId);
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };
  
  const verifyOtpAndDeliver = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }
  
    try {
      const response = await axios.post(`${API_URL}/delivery/verify-otp/${selectedOrder}`, {
        enteredOtp: otp,
      });
  
      if (response.data.success) {
        alert("Order marked as Delivered!");
        setOtp("");
        setOtpSent(false);
        fetchOrders();
      } else {
        alert(response.data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    }
  };
  
  return (
    <div style={styles.container}>
       <Header />
    <div style={{ padding: "20px" }}>
   
      <h2>Available Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : availableOrders.length === 0 ? (
        <p>No available orders.</p>
      ) : (
        availableOrders.map((item) => (
          <div key={item._id} style={orderStyle}>
            <p><strong>Customer:</strong> {item.requestid.customerName}</p>
            <p><strong>Product:</strong> {item.requestid?.pID?.name ?? "N/A"}</p>
            <p><strong>Location:</strong> {item.requestid.location}</p>
            <p><strong>Contact:</strong> {item.requestid.phoneNumber}</p>
            <p><strong>Quantity:</strong> {item.requestid.quantityReq}</p>
            <p><strong>Farmer Name:</strong> {item.requestid?.pID?.userID?.name || "N/A"}</p>
            <p><strong>Farmer Address:</strong> {item.requestid?.pID?.userID?.location || "N/A"}</p>
            <button onClick={() => acceptOrder(item._id)} style={acceptButton}>Accept</button>
          </div>
        ))
      )}

      <h2>My Deliveries</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : myOrders.length === 0 ? (
        <p>No accepted orders.</p>
      ) : (
        myOrders.map((item) => (
          <div key={item._id} style={orderStyle}>
            <p><strong>Customer:</strong> {item.requestid.customerName}</p>
            <p><strong>Product:</strong> {item.requestid?.pID?.name ?? "N/A"}</p>
            <p><strong>Location:</strong> {item.requestid.location}</p>
            <p><strong>Contact:</strong> {item.requestid.phoneNumber}</p>
            <p><strong>Quantity:</strong> {item.requestid.quantityReq}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Farmer Name:</strong> {item.requestid?.pID?.userID?.name || "N/A"}</p>
            <p><strong>Farmer Address:</strong> {item.requestid?.pID?.userID?.location || "N/A"}</p>

            {item.status !== "Delivered" && !otpSent && (
              <button
              onClick={() => sendOtpToCustomer(item._id, item.requestid?.userID?.email)}
              style={deliverButton}
            >
              Send OTP
            </button>
            )}

            {otpSent && selectedOrder === item._id && (
              <>
                <input 
                  type="text" 
                  placeholder="Enter OTP" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                />
                <button onClick={verifyOtpAndDeliver} style={verifyButton}>
                  Verify OTP & Confirm Delivery
                </button>
              </>
            )}
          </div>
        ))
      )}
      </div>

      <Footer />
    </div>
    
  );
};
const styles = {
  container: {
    flexDirection: "column",
    minHeight: "100vh",
    width: "99vw",

  }
};

const orderStyle = {
  //border: "1px solid gray",
  //padding: "10px",
  //marginBottom: "10px",
  //borderRadius: "5px",

    backgroundColor: "#fff", // Fixed hyphen issue
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "300px", /* Adjust width for horizontal layout */
    boxSizing: "border-box",
    transition: "transform 0.3s ease",
    margin: "10px",

  
};


const acceptButton = {
  background: "green",
  color: "white",
  padding: "5px",
  borderRadius: "5px",
  cursor: "pointer",
};

const deliverButton = {
  background: "blue",
  color: "white",
  padding: "5px",
  borderRadius: "5px",
  cursor: "pointer",
};

const verifyButton = {
  background: "orange",
  color: "white",
  padding: "5px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default SupplierPage;
