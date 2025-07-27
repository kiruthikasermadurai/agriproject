import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import Header1 from "./Header1";
import Footer1 from "./Footer1";
import OrderHistory from "./OrderHistory";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userID");
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setUser(data);
        console.log("Fetched User Data:", data); 
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      <Header1 />

      <main
        style={{
          padding: "20px",
          overflowY: "auto",
          maxHeight: "80vh",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          textAlign: "center",
        }}
      >
        <div>
          <h2></h2>
          {user ? (
            <div>
              <div style={{ fontSize: "80px", color: "#6A1B9A" }}>👤</div>
              <h2 style={{ margin: "10px 0", fontSize: "20px", color: "#333" }}>
                {user.name}
              </h2>
              <p style={{ color: "#777", fontSize: "14px" }}>{user.email}</p>

              {/* ✅ Logout Button with Light Green Color */}
              <button
                onClick={handleLogout}
                style={{
                  marginTop: "15px",
                  padding: "10px 20px",
                  backgroundColor: "#90EE90", // Light green
                  color: "#006400", // Dark green text
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>

        <div style={{ padding: "20px", overflowY: "auto", maxHeight: "80vh" }}>
          <OrderHistory />
        </div>
      </main>

      <Footer1 />
    </div>
  );
}

export default Profile;
