// LoginForm.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-header">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to continue your learning journey</p>
      </div>

      {error && (
        <div className="auth-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          className="form-input"
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <div className="form-label-wrapper">
          <label className="form-label" htmlFor="password">Password</label>
          <a href="/forgot-password" className="form-label-link">Forgot?</a>
        </div>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          className="form-input"
          autoComplete="current-password"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className={`auth-submit ${loading ? 'loading' : ''}`}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="auth-footer">
        Don't have an account?{" "}
        <a href="/register" className="auth-link">Create one</a>
      </p>

      <style jsx>{`
        .auth-form {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
          padding: 40px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e9eaed;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }
        
        .auth-header {
          margin-bottom: 32px;
        }
        
        .auth-title {
          margin: 0 0 8px 0;
          font-size: 26px;
          font-weight: 600;
          color: #1a1f2e;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        
        .auth-subtitle {
          margin: 0;
          font-size: 15px;
          color: #5e6675;
          line-height: 1.5;
        }
        
        .auth-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          margin-bottom: 24px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #b91c1c;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #2c313c;
          line-height: 1.5;
        }
        
        .form-label-link {
          font-size: 13px;
          color: #4f46e5;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s ease;
        }
        
        .form-label-link:hover {
          color: #4338ca;
          text-decoration: underline;
        }
        
        .form-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #dde0e5;
          border-radius: 10px;
          font-size: 15px;
          color: #1a1f2e;
          background: #ffffff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
        }
        
        .form-input::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }
        
        .auth-submit {
          width: 100%;
          padding: 12px;
          margin: 24px 0 20px;
          background: #4f46e5;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        
        .auth-submit:hover:not(:disabled) {
          background: #4338ca;
        }
        
        .auth-submit:active:not(:disabled) {
          transform: scale(0.98);
        }
        
        .auth-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .auth-footer {
          text-align: center;
          font-size: 14px;
          color: #5e6675;
          margin: 0;
        }
        
        .auth-link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s ease;
        }
        
        .auth-link:hover {
          color: #4338ca;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .auth-form {
            padding: 24px 20px;
          }
          
          .auth-title {
            font-size: 24px;
          }
        }
      `}</style>
    </form>
  );
};

export default LoginForm;