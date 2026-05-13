// RegisterForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.STUDENT,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const validate = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const { confirmPassword, ...payload } = formData;
      await register(payload);

      if (formData.role === ROLES.GROUP_CREATOR) {
        navigate("/pending-approval");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-header">
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Start collaborating with fellow learners</p>
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
        <label className="form-label" htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          required
          className="form-input"
          autoComplete="name"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
          className="form-input"
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          required
          className="form-input"
          autoComplete="new-password"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          required
          className="form-input"
          autoComplete="new-password"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="role">I want to join as</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="form-select"
        >
          <option value={ROLES.STUDENT}>Student</option>
          <option value={ROLES.GROUP_CREATOR}>Group Creator</option>
        </select>
      </div>

      {formData.role === ROLES.GROUP_CREATOR && (
        <div className="auth-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
          Group Creator accounts require admin approval before activation.
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading} 
        className={`auth-submit ${loading ? 'loading' : ''}`}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="auth-footer">
        Already have an account?{" "}
        <a href="/login" className="auth-link">Sign in</a>
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
        
        .auth-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px 16px;
          margin-bottom: 8px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          color: #92400e;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #2c313c;
          margin-bottom: 6px;
          line-height: 1.5;
        }
        
        .form-input,
        .form-select {
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
        
        .form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235e6675' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
        }
        
        .form-input:focus,
        .form-select:focus {
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

export default RegisterForm;