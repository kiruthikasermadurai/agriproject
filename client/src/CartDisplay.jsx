import React, { useState, useEffect, useRef } from "react";
import Header1 from "./Header1";
import Footer1 from "./Footer1";

const CartDisplay = () => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [location, setLocation] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const scrollContainerRef = useRef(null);

  const userId = localStorage.getItem("userID");

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch cart.");
        const data = await response.json();
        setCart(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Cart Fetch Error:", error);
      }
    };
    fetchCart();
  }, [userId]);

  const updateCartItem = async (productId, newQuantity) => {
    if (newQuantity < 1) return alert("Quantity must be at least 1.");
    try {
      const response = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
          action:
            newQuantity > cart.find((p) => p.productId === productId).quantity
              ? "increment"
              : "decrement",
        }),
      });

      if (response.ok) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Update Cart Error:", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/remove?userId=${userId}&productId=${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCart(cart.filter((item) => item.productId !== productId));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const toggleSelection = (productId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const checkout = async () => {
    const selectedProducts = cart.filter((item) => selectedItems[item.productId]);

    if (selectedProducts.length === 0) {
      alert("No items selected for checkout.");
      return;
    }

    if (!location.trim() || !phoneNumber.trim()) {
      alert("Please provide both location and phone number.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          products: selectedProducts,
          location,
          phoneNumber,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(`Checkout failed: ${data.message || "Unknown error"}`);
        return;
      }

      alert("Checkout successful!");
      setCart(cart.filter((item) => !selectedItems[item.productId]));
      setSelectedItems({});
      setLocation("");
      setphoneNumber("");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <div>
      <Header1 />
      <main style={{ padding: "20px", maxWidth: "1000vw", margin: "auto" }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>🛒 Your Cart</h2>

        {cart.length > 0 ? (
          <div style={{ position: "relative" }}>
            <div
              ref={scrollContainerRef}
              style={{
                display: "flex",
                flexWrap: "nowrap",
                gap: "15px",
                overflowX: "auto",
                padding: "10px",
                scrollBehavior: "smooth",
                scrollbarWidth: "thin",
                scrollbarColor: "#ccc transparent",
                position: "relative",
              }}
            >
              {cart.map((item) => (
                <div
                  key={item.productId}
                  onClick={() => toggleSelection(item.productId)}
                  style={{
                    minWidth: "220px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "15px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: selectedItems[item.productId]
                      ? "#D4EDDA"
                      : "#fff",
                    cursor: "pointer",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                    transition: "background 0.3s",
                  }}
                >
                  <img
                    src={
                      item.image
                        ? `http://localhost:5000${item.image}`
                        : "https://placehold.co/150x150?text=No+Image"
                    }
                    alt={item.name}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                  <strong style={{ marginTop: "10px" }}>{item.name}</strong>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    ${item.price} (x{item.quantity})
                  </p>

                  <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                    <button
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        updateCartItem(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>

                    <button
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: item.quantity > 1 ? "pointer" : "not-allowed",
                      }}
                      onClick={() =>
                        updateCartItem(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                  </div>

                  <button
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ff5733",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      marginTop: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => removeItem(item.productId)}
                  >
                    🗑 Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#777", fontSize: "18px" }}>
            Your cart is empty.
          </p>
        )}

        {cart.length > 0 && (
          <>
            <div style={{ marginTop: "20px" }}>
              <label>📍 Location:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              />
              <label>📞 Phone Number:</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setphoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              />
            </div>

            <button
              style={{
                backgroundColor: "#90EE90",
                color: "#006400",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                display: "block",
                margin: "20px auto",
              }}
              onClick={checkout}
              disabled={Object.keys(selectedItems).length === 0}
            >
              Checkout
            </button>
          </>
        )}
      </main>
      <Footer1 />
    </div>
  );
};

export default CartDisplay;