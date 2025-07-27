import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage"; 
import CustomerPage from "./CustomerPage";
import VendorPage from "./VendorPage";
import ProductListing from "./ProductListing";
import SupplierPage from "./SupplierPage";
import HomePage from "./HomePage";
import ProductList from "./ProductList";
import CartDisplay from "./CartDisplay";
import OrderHistory from "./OrderHistory";
import Header1 from "./Header1";
import Footer1 from "./Footer1";
import Profile from "./Profile";


function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/vendor" element={<VendorPage />} />
        <Route path="/farmer" element={<ProductListing />} />
        <Route path="/supplier" element={<SupplierPage />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/CartDisplay" element={<CartDisplay />} />
        <Route path="/OrderHistory" element={<OrderHistory />} />
        <Route path="/Header1" element={<Header1 />} />
        <Route path="/Footer1" element={<Footer1 />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
