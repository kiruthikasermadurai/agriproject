import React, { useState } from "react";
import axios from "axios";
import Header1 from "./Header1";
import Footer1 from "./Footer1";
import ProductList from "./ProductList";
const CustomerPage = () => {
  return (
    <div style={styles.container}>
      <Header1 /> {/* ✅ Fixed at the top */}
      
      <main style={styles.main}>
        <ProductList /> {/* ✅ Middle Section */}
      </main>
      
      <Footer1 /> {/* ✅ Fixed at the bottom */}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // Ensures full viewport height
    width:"100vw"
  },
  main: {
    flex: 1,
    padding: "2rem",
    marginTop: "5rem", // Adjust this value based on the header height
    marginBottom: "4rem",
  },
  
};

export default CustomerPage;
