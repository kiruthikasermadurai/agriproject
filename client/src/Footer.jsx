import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>2024 © AMF - All rights reserved</p>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#0e641c",
    color: "white",
    textAlign: "center",
    padding: "10px 0",
    width: "100%",
    marginTop: "auto",
  },
};

export default Footer;