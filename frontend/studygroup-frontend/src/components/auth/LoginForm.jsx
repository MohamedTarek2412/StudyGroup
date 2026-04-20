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

  // لو جه من ProtectedRoute يرجع للصفحة اللي كان فيها
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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Welcome back</h2>
      <p style={styles.subtitle}>Sign in to your account</p>

      {error && <div style={styles.error}>{error}</div>}

      {/* ─── Email ─────────────────────────── */}
      <div style={styles.field}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          style={styles.input}
        />
      </div>

      {/* ─── Password ──────────────────────── */}
      <div style={styles.field}>
        <label style={styles.label}>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          style={styles.input}
        />
      </div>

      <button type="submit" disabled={loading} style={styles.btn}>
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p style={styles.footer}>
        Don't have an account?{" "}
        <a href="/register" style={styles.footerLink}>Register</a>
      </p>
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "32px",
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
  },
  error: {
    padding: "10px 14px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    color: "#b91c1c",
    fontSize: "13px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    color: "#111827",
  },
  btn: {
    padding: "11px",
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
  },
  footer: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },
  footerLink: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default LoginForm; 
