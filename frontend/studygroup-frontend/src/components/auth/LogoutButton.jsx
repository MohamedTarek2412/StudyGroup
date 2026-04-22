// LogoutButton.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LogoutButton = ({ style, className, children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    navigate("/login");
  };

  return (
    <>
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`logout-btn ${className || ''} ${loading ? 'loading' : ''}`}
        style={style}
      >
        {children || (loading ? "Signing out..." : "Sign out")}
      </button>
      
      <style jsx>{`
        .logout-btn {
          background: transparent;
          border: 1.5px solid #dde0e5;
          border-radius: 8px;
          padding: 7px 18px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #4b5563;
          transition: all 0.15s ease;
          line-height: 1.5;
        }
        
        .logout-btn:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #cbd5e1;
          color: #1f2937;
        }
        
        .logout-btn:active:not(:disabled) {
          transform: translateY(1px);
        }
        
        .logout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default LogoutButton;