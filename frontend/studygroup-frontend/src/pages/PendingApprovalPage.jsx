import React from "react";
import { Link } from "react-router-dom";

const PendingApprovalPage = () => {
  return (
    <div className="container mt-6" style={{ maxWidth: 560, margin: "48px auto" }}>
      <div className="card" style={{ padding: "32px", textAlign: "center" }}>
        <h1 className="page-title" style={{ fontSize: "24px", marginBottom: "12px" }}>
          Registration received
        </h1>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "24px" }}>
          Your Group Creator account is pending admin approval. You will be able to sign in and create
          study groups after an administrator approves your request.
        </p>
        <Link to="/login" className="btn btn-primary" style={{ marginRight: "8px" }}>
          Go to login
        </Link>
        <Link to="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
