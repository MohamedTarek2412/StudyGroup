import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__brand-title">
            <span className="site-footer__icon" aria-hidden>📚</span>
            <span className="site-footer__name">StudyGroup</span>
          </div>
          <p className="site-footer__tag">Collaborative learning: find groups, discuss, and share study materials in one place.</p>
        </div>

        <div className="site-footer__cols">
          <div className="site-footer__group">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/groups">Browse groups</Link>
          </div>
          <div className="site-footer__group">
            <h4>Account</h4>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} StudyGroup</span>
        <span aria-hidden>·</span>
        <span>Made with</span>
        <Heart size={12} style={{ color: "#f87171", flexShrink: 0 }} aria-hidden />
        <span>for students</span>
      </div>
    </footer>
  );
};

export default Footer;
