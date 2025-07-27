import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
    location: "",
    role: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle signup submission
  const handleSignup = async () => {
    console.log("Attempting to sign up..."); // Debugging log
  
    const { name, email, password, phoneNo, location, role } = formData;
  
    // ✅ Basic validation check
    if (!name || !email || !password || !phoneNo || !location || !role) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      // ✅ Store response in a variable
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password, phoneNo, location, role },
        { withCredentials: true }  // ✅ Ensure this stays
      );
  
      console.log("Signup successful:", response.data); // ✅ Now `response` is defined
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
  
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message); // Debugging log
  
      // Display meaningful error message
      alert(error.response?.data?.message || "Something went wrong. Check your API connection.");
    }
  };
  

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.signupContainer}>
        <div style={styles.formContainer}>
          <h2>Signup</h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />

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

          <input
            type="tel"
            name="phoneNo"
            placeholder="Phone Number"
            value={formData.phoneNo}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="location"
            placeholder="Location/Address"
            value={formData.address}
            onChange={handleChange}
            style={styles.input}
          />

          <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
            <option value="">Select Role</option>
            <option value="farmer">Farmer</option>
            <option value="customer">Customer</option>
            <option value="supplier">Supplier</option>
          </select>

          <button onClick={handleSignup} style={styles.signupButton}>
            Signup
          </button>

          <p style={styles.loginText}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} style={styles.loginLink}>
              Login
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100vw",
    background: "white",
  },
  signupContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
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
  signupButton: {
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
  loginText: { marginTop: "10px" },
  loginLink: { color: "#0e641c", cursor: "pointer", fontWeight: "bold" },
};

export default SignupPage;