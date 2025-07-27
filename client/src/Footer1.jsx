import React from "react";

const Footer1 = () => {
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
    padding: "1rem",
    width: "100%",
    position: "fixed",
    bottom: 0,
    left: 0,
  },
};

export default Footer1;