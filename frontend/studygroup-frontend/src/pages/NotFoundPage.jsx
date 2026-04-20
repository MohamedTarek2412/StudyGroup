import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page not found</h2>
      <p style={styles.desc}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={styles.btns}>
        <button onClick={() => navigate(-1)} style={styles.btnOutline}>
          Go back
        </button>
        <Link to="/" style={styles.btnPrimary}>
          Back to home
        </Link>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center",
    gap: "12px",
    padding: "24px",
  },
  code: {
    fontSize: "80px",
    fontWeight: "800",
    color: "#e5e7eb",
    margin: 0,
    lineHeight: 1,
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  desc: {
    fontSize: "15px",
    color: "#6b7280",
    margin: 0,
  },
  btns: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  btnPrimary: {
    background: "#4f46e5",
    color: "#ffffff",
    padding: "10px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
  btnOutline: {
    background: "#ffffff",
    color: "#374151",
    padding: "10px 24px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default NotFoundPage; 
