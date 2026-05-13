import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useNotifications } from "../../context/NotificationContext";
import { ROLES } from "../../utils/constants";
import NotificationBell from "./NotificationBell";
import { Menu, X, LogOut, Users, Shield } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/groups", label: "Browse Groups", icon: <Users size={16} aria-hidden />, show: true },
    { to: "/my-groups", label: "My Groups", show: isAuthenticated && user?.role === ROLES.STUDENT },
    { to: "/dashboard", label: "Dashboard", show: isAuthenticated && user?.role === ROLES.GROUP_CREATOR },
    { to: "/admin", label: "Admin", show: isAuthenticated && user?.role === ROLES.ADMIN, icon: <Shield size={16} aria-hidden /> },
  ];

  const visibleLinks = navLinks.filter((l) => l.show);

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`} role="navigation" aria-label="Main">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon" aria-hidden>📚</span>
          <span className="navbar__logo-text">StudyGroup</span>
        </Link>

        <div className="navbar__links">
          {visibleLinks.map((link) => (
            <Link key={link.to} to={link.to} className="navbar__link">
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar__right">
          {isAuthenticated && <NotificationBell unreadCount={unreadCount} />}

          <div className="navbar__actions-desktop">
            {isAuthenticated ? (
              <div className="navbar__user">
                <span className="navbar__username" title={user?.fullName || user?.email}>
                  {user?.fullName?.split(" ")[0] || user?.email?.split("@")[0]}
                </span>
                <button type="button" onClick={handleLogout} className="navbar__logout">
                  <LogOut size={16} aria-hidden />
                  Logout
                </button>
              </div>
            ) : (
              <div className="navbar__auth">
                <Link to="/login" className="navbar__link-login">
                  Login
                </Link>
                <Link to="/register" className="navbar__link-register">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            className="navbar__menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="navbar__drawer" id="nav-drawer">
          {visibleLinks.map((link) => (
            <Link key={link.to} to={link.to} className="navbar__link" onClick={() => setMenuOpen(false)}>
              {link.icon} {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button type="button" onClick={handleLogout} className="navbar__logout" style={{ width: "100%" }}>
              <LogOut size={16} aria-hidden />
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" className="navbar__link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="navbar__link-register" onClick={() => setMenuOpen(false)} style={{ marginTop: "0.5rem" }}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
