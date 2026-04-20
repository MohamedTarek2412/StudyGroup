import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useNotifications } from "../../context/NotificationContext";
import { ROLES } from "../../utils/constants";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      {/* ─── Logo ─────────────────────────────── */}
      <Link to="/" style={styles.logo}>
        StudyGroup
      </Link>

      {/* ─── Desktop links ────────────────────── */}
      <div style={styles.links}>
        <Link to="/groups" style={styles.link}>Browse Groups</Link>

        {/* Student links */}
        {isAuthenticated && user?.role === ROLES.STUDENT && (
          <Link to="/my-groups" style={styles.link}>My Groups</Link>
        )}

        {/* Creator links */}
        {isAuthenticated && user?.role === ROLES.GROUP_CREATOR && (
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        )}

        {/* Admin links */}
        {isAuthenticated && user?.role === ROLES.ADMIN && (
          <Link to="/admin" style={styles.link}>Admin Panel</Link>
        )}
      </div>

      {/* ─── Right side ───────────────────────── */}
      <div style={styles.right}>
        {isAuthenticated ? (
          <>
            <NotificationBell unreadCount={unreadCount} />
            <span style={styles.username}>{user?.fullName || user?.email}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: "60px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontWeight: "700",
    fontSize: "20px",
    color: "#4f46e5",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "24px",
  },
  link: {
    color: "#374151",
    textDecoration: "none",
    fontSize: "15px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  username: {
    fontSize: "14px",
    color: "#6b7280",
  },
  logoutBtn: {
    background: "none",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#374151",
  },
  registerBtn: {
    background: "#4f46e5",
    color: "#ffffff",
    padding: "7px 16px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default Navbar; 
