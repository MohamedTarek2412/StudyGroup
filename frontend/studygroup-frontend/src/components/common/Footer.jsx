import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* ─── Brand ──────────────────────── */}
        <div>
          <span style={styles.brand}>StudyGroup</span>
          <p style={styles.tagline}>Collaborative learning for everyone.</p>
        </div>

        {/* ─── Links ──────────────────────── */}
        <div style={styles.links}>
          <Link to="/groups" style={styles.link}>Browse Groups</Link>
          <Link to="/register" style={styles.link}>Join Us</Link>
          <Link to="/login" style={styles.link}>Login</Link>
        </div>
      </div>

      {/* ─── Bottom bar ─────────────────── */}
      <div style={styles.bottom}>
        <span style={styles.copy}>
          © {new Date().getFullYear()} StudyGroup. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
    marginTop: "auto",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "24px",
  },
  brand: {
    fontWeight: "700",
    fontSize: "18px",
    color: "#4f46e5",
  },
  tagline: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#9ca3af",
  },
  links: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },
  link: {
    fontSize: "14px",
    color: "#6b7280",
    textDecoration: "none",
  },
  bottom: {
    borderTop: "1px solid #e5e7eb",
    padding: "14px 24px",
    textAlign: "center",
  },
  copy: {
    fontSize: "12px",
    color: "#9ca3af",
  },
};

export default Footer; 
