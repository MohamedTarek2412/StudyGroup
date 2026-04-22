import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__inner">
        <div className="not-found__codes" aria-hidden>
          <span className="not-found__digit">4</span>
          <span className="not-found__digit not-found__digit--accent">0</span>
          <span className="not-found__digit">4</span>
        </div>
        <h1 className="not-found__title">Page not found</h1>
        <p className="not-found__desc">The page you&rsquo;re looking for doesn&rsquo;t exist or was moved.</p>
        <div className="not-found__actions">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
            <ArrowLeft size={16} aria-hidden />
            Go back
          </button>
          <Link to="/" className="btn btn-primary" style={{ background: "var(--gradient-primary)" }}>
            <Home size={16} aria-hidden />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
