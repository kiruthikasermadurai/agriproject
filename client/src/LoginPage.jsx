import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const LoginPage = () => {
  const navigate = useNavigate();

  // ✅ State for user type and form data
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // ✅ Handle user type selection
  const handleUserSelection = (userType) => {
    setSelectedUser(userType);
  };

  // ✅ Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Login function with Axios
  const handleLogin = async () => {
    console.log("Attempting to log in..."); // Debugging log

    const { email, password } = formData;

    // ✅ Basic validation check
    if (!selectedUser) {
      alert("Please select a user type.");
      return;
    }

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      // ✅ Send login request
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password, role: selectedUser }, // Ensure selectedUser is sent as role
        { withCredentials: true }
      );

      console.log("Login successful:", response.data);
      alert("Login successful! Redirecting...");
      localStorage.setItem("deliveryid", response.data.user.id); //added
      const deliveryid = localStorage.getItem("deliveryid");
      console.log("Logged in Delivery ID:", deliveryid);
      const user = response.data.user;
    console.log("User object:", user);  // Check if the object structure is as expected
    console.log("User ID:", user.id);
      // ✅ Store token & user details
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      localStorage.setItem("userID", user.id);
      navigate(`/${selectedUser}`); // Navigate to user's dashboard

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid credentials or server error.");
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.loginContainer}>
        {/* User Type Selection Sidebar */}
        <div style={styles.sidebar}>
          <h3>Select User Type</h3>
          {["customer", "farmer", "supplier"].map((user) => (
            <button
              key={user}
              style={styles.userButton(selectedUser === user)}
              onClick={() => handleUserSelection(user)}
            >
              {user}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <div style={styles.formContainer}>
          {selectedUser ? (
            <>
              <h2>{selectedUser} Login</h2>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
              <button onClick={handleLogin} style={styles.loginButton}>
                Login
              </button>
              <p style={styles.signupText}>
                Don't have an account?{" "}
                <span onClick={() => navigate("/signup")} style={styles.signupLink}>
                  Sign Up
                </span>
              </p>
            </>
          ) : (
            <p>Please select a user type to proceed.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

// ✅ Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100vw",
    background: "white",
  },
  loginContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    gap: "20px",
  },
  sidebar: {
    width: "200px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#8fde07",
    padding: "20px",
    borderRadius: "8px",
  },
  userButton: (isActive) => ({
    background: isActive ? "#0e641c" : "#6bab11",
    color: "white",
    padding: "10px",
    margin: "5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  }),
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#8fde07",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: "300px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    background: "#fff",
    color: "black",
  },
  loginButton: {
    background: "#0e641c",
    color: "white",
    padding: "10px",
    width: "100%",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  signupText: {
    marginTop: "10px",
  },
  signupLink: {
    color: "#0e641c",
    cursor: "pointer",
    fontWeight: "bold",
  },
  
};

export default LoginPage;
