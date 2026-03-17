import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LogoutButton = ({ style, children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{ ...defaultStyle, ...style }}
    >
      {children || (loading ? "Signing out..." : "Sign out")}
    </button>
  );
};

const defaultStyle = {
  background: "none",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "7px 16px",
  cursor: "pointer",
  fontSize: "14px",
  color: "#374151",
};

export default LogoutButton;