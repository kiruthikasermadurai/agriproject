import React, { useEffect, useState } from "react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }
    
        console.log("🔍 Fetching orders for user:", userId);
    
        const response = await fetch(`http://localhost:5000/api/orders/${userId}`);
        
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (!Array.isArray(data) || data.length === 0) {
          setError("No past orders found.");
          return;
        }
    
        setOrders(data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    

    fetchOrders();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Order History</h2>
      {loading && <p style={styles.message}>Loading orders...</p>}
      {error && <p style={{ ...styles.message, color: "red" }}>{error}</p>}
      <div style={styles.orderList}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
              <p>
                <strong>Items:</strong>{" "}
                {order.products.map((p) => p.productId?.name || "Unknown Product").join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p style={styles.message}>No past orders found.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "auto",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#2c3e50",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  message: {
    textAlign: "center",
    color: "#777",
    fontSize: "16px",
  },
  orderList: {
    maxHeight: "450px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  orderCard: {
    padding: "15px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
  },
  orderCardHover: {
    transform: "scale(1.02)",
  },
};

export default OrderHistory;
