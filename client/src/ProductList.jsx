import React, { useState, useEffect } from "react";
import Header1 from "./Header1";
import Footer1 from "./Footer1";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch all products
  useEffect(() => {
    fetch('http://localhost:5000/api/farmer/cd/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Products:", data); // Debugging
        setProducts(data);
        setFilteredProducts(data); // Show all products initially
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Handle search
  const handleSearch = () => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };
  
  
  const handleAddToCart = async (productId) => {
    const userId = localStorage.getItem("userID");

    if (!userId) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity: 1 }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Added to cart successfully!");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Check console.");
    }
  };
  

  return (
    <div style={{ padding: "4rem" }}>
      
      
      
     
      {/* 🛒 Product Listings */}
      
      <h2>All Products</h2>
      <div className="search-container" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: "10px",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
      
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Ensures horizontal expansion first
          gap: "20px",
          padding: "10px",
          overflowY: "auto", // Enables vertical scrolling if necessary
        }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              style={{
                border: "2px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                textAlign: "center",
                minWidth: "25vw",
                maxWidth: "100vw",
              }}
            >
              <img src={product.image ? `http://localhost:5000${product.image}` : "https://placehold.co/150x150?text=No+Image"} alt={product.name}
  style={{
    width: "30vw",
    height: "150px",
    objectFit: "cover",
    borderRadius: "5px",
  }}
/>

              <p style={{ fontWeight: "bold" }}>{product.name} - ₹{product.price}</p>
              
              <button
                style={{
                  backgroundColor: "#90EE90", // Light green
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => handleAddToCart(product._id)}
              >
                Add to Cart
              </button>
              
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      
    </div>
  );
};

export default ProductList;