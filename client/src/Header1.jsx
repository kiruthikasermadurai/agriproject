import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header1 = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userID");
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };
  const handleCartClick = (e) => {
    if (!userId) {
      e.preventDefault();  // ❌ Prevent navigation
      alert("⚠️ Please log in to view your cart.");
    }
  };
  return (
    <header style={styles.header}>
      <div style={styles.left}>AMF</div>
      
      <nav style={{
  display: "flex",
  justifyContent: "space-between", /* Ensures equal spacing */
  alignItems: "center",
  backgroundColor: "#006400", /* Dark green */
  padding: "15px 20px"
}}>
      <Link to="/CustomerPage">Product</Link>
      <div style={{ display: "flex", gap: "30px" }}> | </div>
      <Link to="/CartDisplay" onClick={handleCartClick}>Cart</Link>
      <div style={{ display: "flex", gap: "30px" }}> | </div>
      
      {userId ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </nav>
      
    </header>
   
    
  );
};

const styles = {
  header: {
    background: "#0e641c",
    color: "white",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",  // ✅ Full width
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
     
  },
  left: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  nav: {
    display: "flex", // ✅ Ensures "Login" stays visible
    alignItems: "center",
  },
  login: {
    fontWeight: "bold",
    textDecoration: "none",
    color: "white",
  }
};

export default Header1;