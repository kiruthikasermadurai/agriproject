import React from "react";
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
  }
};

export default Header;
