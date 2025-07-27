import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./mobile.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.left}>AMF</div>
      <nav style={styles.nav}>
        <Link to="/login" style={styles.login}>Logout</Link>
      </nav>
    </header>
  );
};
const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>2024 © AMF - All rights reserved</p>
    </footer>
  );
};
const ProductCard = ({
  product,
  requests,
  handleRemove,
  handleEdit,
  updateProductWeight,
  products,
  setProducts,
  completedRequests,
  setCompletedRequests
}) => {
  const [showRequests, setShowRequests] = useState(false);
  const userID = localStorage.getItem("userID");

  // Filter product requests related to the current product
  const productRequests = Array.isArray(requests)
    ? requests.filter((request) => request.pID.toString() === product._id.toString())
    : [];

  const toggleRequests = () => setShowRequests((prevState) => !prevState);

  useEffect(() => {
    productRequests.forEach((request) => {
      if (!completedRequests[request._id]) {
        handleAutoUpdate(request);
      }
    });
  }, [productRequests, completedRequests]);

  const handleAutoUpdate = async (request) => {
    if (!request.pID) return;
    if (!products || !Array.isArray(products)) return;

    const updatedProduct = products.find((p) => p._id.toString() === request.pID.toString());
    if (!updatedProduct) return;

    const newWeight = updatedProduct.quantity - request.quantityReq;
    if (newWeight < 0) {
      console.error("Not enough stock!");
      return;
    }

    try {
      await updateProductWeight(updatedProduct._id, newWeight);
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === updatedProduct._id ? { ...p, quantity: newWeight } : p))
      );
      setCompletedRequests((prev) => {
        const updatedCompleted = { ...prev, [request._id]: true };
        localStorage.setItem("completedRequests", JSON.stringify(updatedCompleted));
        return updatedCompleted;
      });
    } catch (err) {
      console.error("Error updating product weight:", err);
    }
  };

  return (
    <div style={styles.card}>
      <img
        src={product.image ? `http://localhost:5000${product.image}` : "https://placehold.co/150x150?text=No+Image"}
        alt={product.name}
        style={styles.image}
      />
      <div style={styles.details}>
        <h3 style={styles.productName}>{product.name}</h3>
        <p style={styles.productText}>Category: {product.category}</p>
        <p style={styles.productText}>Quantity: {product.quantity} kg</p>
        <p style={styles.productText}>Price: ₹{product.price} per kg</p>
        <button onClick={() => handleEdit(product)} style={styles.editButton}>Edit</button>
        <button onClick={() => handleRemove(product._id)} style={styles.removeButton}>Remove</button>
        <button style={styles.requestListButton} onClick={toggleRequests}>
          {productRequests.length > 0 ? `View ${productRequests.length} Request(s)` : "No Requests"}
        </button>
        {showRequests && (
          <div style={styles.requestList}>
            {productRequests.map((request) => (
              <div key={request._id} style={styles.requestCard}>
                <p>Customer: {request.customerName}</p>
                <p>Phone: {request.phoneNumber}</p>
                <p>Location: {request.location}</p>
                <p>QuantityReq: {request.quantityReq} kg</p>
                {completedRequests[request._id] && <p style={{ color: "green" }}>✅ Processed</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const updateProductWeight = async (productId, newWeight) => {
  const token = localStorage.getItem("token");  // Make sure token is valid

  if (!token) {
    alert("You must be logged in to update the product weight.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/farmer/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // Pass token here
      },
      body: JSON.stringify({ quantity: newWeight }),
    });

    if (!response.ok) {
      throw new Error("Failed to update product weight");
    }

    const data = await response.json();
    console.log("Updated Product:", data);
  } catch (error) {
    console.error("Error updating product weight:", error);
  }
};

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedRequests, setCompletedRequests] = useState({});
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    category: "",
    quantity: "",
    price: "",
    image: null,
  });
  useEffect(() => {
    fetch("http://localhost:5000/api/farmer/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`, // Add token here
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
    
      const token = localStorage.getItem('token');  // Fetch the token from localStorage
      fetch("http://localhost:5000/api/farmer/requests", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  // Add token to Authorization header
        },
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Fetched Requests:", data);  // Log the data received
        setRequests(data);  // Update state with the fetched requests
        const storedCompleted = JSON.parse(localStorage.getItem("completedRequests")) || {};
        setCompletedRequests(storedCompleted);  // Update completedRequests state
    })
    .catch((error) => console.error("Error fetching requests:", error));
    
}, []);
  const handleAddProduct = async () => {
    const userID = localStorage.getItem("userID");
    const token = localStorage.getItem("token");  // Get the token from localStorage
    console.log(userID, token);

    if (!token) {  // Check if the token is missing
      alert("You must be logged in to add a product.");
      return;
  }

    if (!newProduct.name || !newProduct.category || !newProduct.quantity || !newProduct.price) {
      alert("All fields are required!");
      return;
    } 
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("category", newProduct.category);
    formData.append("quantity", newProduct.quantity);
    formData.append("price", newProduct.price);
    formData.append("userID", userID);
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }
    const method = newProduct.id ? "PUT" : "POST";
    const url = newProduct.id
      ? `http://localhost:5000/api/farmer/products/${newProduct.id}`
      : "http://localhost:5000/api/farmer/products";
  
      try {
        const response = await fetch(url, {
            method,
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}`, // Use the token here, not the userID
            },
        });

        if (!response.ok) {
            throw new Error("Failed to add/update product");
        }

        const data = await response.json();
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product._id === data._id ? data : product
            )
        );
        alert(newProduct.id ? "Product updated successfully!" : "Product added successfully!");
        setNewProduct({
            id: "",
            name: "",
            category: "",
            quantity: "",
            price: "",
            image: null,
        });
    } catch (error) {
        console.error("Error adding/updating product:", error);
        alert("Error adding/updating product. Please try again.");
    }
};
      
const handleRemove = async (productId) => {
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  if (!token) {
    alert("You must be logged in to remove a product.");
    return;
  }

  if (!productId) {
    console.error("Error: Product ID is undefined");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/farmer/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to delete product");
    }

    // Update the UI after successful deletion
    setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

  const handleEdit = (product) => {
    setNewProduct({
      id: product._id,
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      image: null,
    });
  };
  if (loading) return <p style={styles.loadingText}>Loading products...</p>;
  return (
      <div style={styles.container}>
        <Header />
        <div style={styles.addProductForm}>
          <h3>{newProduct.id ? "Edit Product" : "Add New Product"}</h3>
          <input
            type="text"
            placeholder="Name *"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category *"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Stock Available (kg) *"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price per kg *"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required
          />
          <input
            type="file"
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
          />
          <button onClick={handleAddProduct} style={styles.addButton}>
            {newProduct.id ? "Update Product" : "Add Product"}
          </button>
        </div>
        <div style={styles.content}>
          <h2>Product Listing</h2>
          <div style={styles.productList}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} handleRemove={handleRemove} handleEdit={handleEdit} requests={requests} updateProductWeight={updateProductWeight} products={products} setProducts={setProducts}  completedRequests={completedRequests} setCompletedRequests={setCompletedRequests}/>
            ))}
          </div>
        </div>
        <Footer />
      </div>
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
    },
    left: {
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    login: {
      fontWeight: "bold",
      textDecoration: "none",
      color: "white",
    },
    footer: {
      background: "#0e641c",
      color: "white",
      textAlign: "center",
      padding: "10px 0",
      width: "100%",
      marginTop: "auto",
    },
    container: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
      minHeight: "80vh",
      display: "flex",
      width:"100vw",
      flexDirection: "column",
    },
    content: {
      padding: "20px",
      flex: 1,
    },
    addProductForm: {
      margin: "20px 0",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    addButton: {
      backgroundColor: "#3D550C",
      color: "#ECF87F",
      padding: "10px 15px",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
    },
    productList: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    productCardContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    card: {
      display: "flex",
      backgroundColor: "#81B622", // Lime green background
      padding: "10px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      alignItems: "center",
      justifyContent: "space-between",
    },
    image: {
      width: "300px",  // Increased width
      height: "200px",
      objectFit: "cover",
      borderRadius: "5px",
    },
    details: {
      padding: "10px",
      textAlign: "left",
      flex: 1,
    },
    productName: {
      fontSize: "2rem",
      margin: "0",
      color: "yellow",
    },
    productText: {
      color: "#fff",
      fontSize: "1rem",
      marginBottom: "5px",
    },
    editButton: {
      backgroundColor: "#ECF87F",  // Red button
      color: "#111",
      padding: "15px 10px",
      border: "none",
      cursor: "pointer",
      borderRadius: "10px",
      marginRight: "10px",
    },
    removeButton: {
      backgroundColor: "#ECF87F",  // Red button
      color: "#111",
      padding: "15px 10px",
      border: "none",
      cursor: "pointer",
      borderRadius: "10px",
    },
    requestListButton: {
      marginTop: "10px",
      backgroundColor: "#3D550C",      
      color: "#fff",
      padding: "15px 10px",
      border: "none",
      cursor: "pointer",
      borderRadius: "10px",
    },
    requestList: {
      marginTop: "10px",
      backgroundColor: "#f0f0f0",
      padding: "10px",
      borderRadius: "8px",
      width: "90%",
    },
    requestItem: {
      marginBottom: "10px",
      backgroundColor: "#fff",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
  
    },
    completeButton: {
      background: "#007bff", // Blue when not completed
      color: "white",
      border: "none",
      padding: "5px 10px",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "5px",
    },
    completedButton: {
      background: "#28a745", // Green when completed
      color: "white",
      border: "none",
      padding: "5px 10px",
      borderRadius: "5px",
      cursor: "not-allowed",
      marginTop: "5px",
    },
};
export default ProductListing;
