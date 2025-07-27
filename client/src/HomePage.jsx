import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import farmImage from "./images/farm1.jpg";
import { FaEnvelope, FaPhone, FaFacebook, FaInstagram } from "react-icons/fa";

const HomePage = () => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      width: "99vw",
    },
    content: {
      flex: 1,
      padding: "20px",
    },
    section: {
      marginBottom: "40px",
    },
    heading: {
      color: "#259210",
      textAlign: "center",
      fontSize: "28px",
      fontWeight: "bold",
    },
    aboutContainer: {
        backgroundColor: "",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "90%",
        margin: "0 auto",
      },
    aboutSection: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      textAlign: "left",
    },
    aboutText: {
      flex: 1,
      paddingRight: "20px",
      fontSize: "18px",
      lineHeight: "1.6",
      
    },
    aboutImage: {
      width: "30%",
      height: "auto",
      borderRadius: "10px",
    },
    contactSection: {
        backgroundColor: "#0e641c",
        color: "white",
        padding: "20px",
        textAlign: "center",
        width: "96vw", // Full width of the viewport
        marginLeft: "-20px", // Adjust margin to compensate for container padding
        marginRight: "-20px",
        marginBottom: "-20px",
      },
    contactText: {
        margin: "10px 0",
        fontSize: "18px",
        display: "flex",
        alignItems: "left",
        justifyContent: "left",
        gap: "10px",
        color:"#fff"
      },
    details: {
      margin: "10px 0",
      color: "#6bab11",
      fontSize: "18px",
    },
  };

  return (
    <div style={styles.container}>
      <Header />
      <main style={styles.content}>
        {/* About Us Section */}
        {/* About Us Section */}
      <section style={{ ...styles.section, ...styles.aboutContainer }}>
        <div style={styles.aboutSection}>
          <div style={styles.aboutText}>
            <h2 style={styles.heading}>About Us</h2>
            <p style={styles.details}>
              Welcome to AMF, an innovative agriculture marketplace designed to
              bring farmers, shop owners, customers, and delivery personnel
              together on a single platform. Our mission is to revolutionize the
              way farm products are bought and sold by eliminating middlemen,
              ensuring that farmers get fair prices for their produce while
              customers receive fresh, high-quality goods directly from the
              source.
            </p>
            <p style={styles.details}>
            For generations, farmers have been the backbone of our society, yet they often face challenges in selling their products at fair market prices due to the involvement of intermediaries. At AMF, we aim to bridge this gap by providing a direct and transparent marketplace where:
Farmers can list and sell their fresh produce directly to shop owners and customers.
Shop Owners can source high-quality farm products at competitive prices.
Customers can purchase fresh, organic products directly from farmers.
Delivery Personnel ensure seamless and timely delivery of farm produce to buyers.
            </p>
          </div>
          <img src={farmImage} alt="Farm" style={styles.aboutImage} />
        </div>
      </section>

        {/* Why Choose Us Section */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Why Choose Us?</h2>
          <p style={styles.details}>✅ No Middlemen, More Profit for Farmers</p>
          <p style={styles.details}>✅ Fresh & Organic Produce at Competitive Prices</p>
          <p style={styles.details}>✅ Fair Trade & Transparent Transactions</p>
          <p style={styles.details}>✅ Easy-to-Use Platform for All Stakeholders</p>
          <p style={styles.details}>✅ Fast & Reliable Delivery Service</p>
        </section>

        {/* FAQs Section */}
        <section style={styles.section}>
          <h2 style={styles.heading}>FAQs</h2>
          <details style={styles.details}>
            <summary>What services do we offer?</summary>
            <p>
              We provide a range of services including supply management,
              customer support, and order tracking.
            </p>
          </details>
          <details style={styles.details}>
            <summary>How can I contact support?</summary>
            <p>You can reach out to us via the contact section below.</p>
          </details>
        </section>

        {/* Contact Us Section */}
        <section style={styles.contactSection}>
          <h2>Contact Us</h2>
          <p style={styles.contactText}>
            <FaEnvelope style={styles.icon} /> support@example.com
          </p>
          <p style={styles.contactText}>
            <FaPhone style={styles.icon} /> +123 456 7890
          </p>
          <p style={styles.contactText}>
            <FaFacebook style={styles.icon} /> facebook.com/ourpage
          </p>
          <p style={styles.contactText}>
            <FaInstagram style={styles.icon} /> instagram.com/ourpage
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;