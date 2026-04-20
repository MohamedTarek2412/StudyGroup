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

      // لو Group Creator، وجهه لصفحة تقول ليه إن حسابه تحت المراجعة
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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Create your account</h2>
      <p style={styles.subtitle}>Join the StudyGroup community</p>

      {error && <div style={styles.error}>{error}</div>}

      {/* ─── Full Name ─────────────────────── */}
      <div style={styles.field}>
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Mohamed Ahmed"
          required
          style={styles.input}
        />
      </div>

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
          placeholder="Min. 8 characters"
          required
          style={styles.input}
        />
      </div>

      {/* ─── Confirm Password ──────────────── */}
      <div style={styles.field}>
        <label style={styles.label}>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
          style={styles.input}
        />
      </div>

      {/* ─── Role ──────────────────────────── */}
      <div style={styles.field}>
        <label style={styles.label}>I want to join as</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={styles.input}
        >
          <option value={ROLES.STUDENT}>Student</option>
          <option value={ROLES.GROUP_CREATOR}>Group Creator</option>
        </select>
      </div>

      {/* Group Creator note */}
      {formData.role === ROLES.GROUP_CREATOR && (
        <div style={styles.note}>
          Group Creator accounts require admin approval before activation.
        </div>
      )}

      <button type="submit" disabled={loading} style={styles.btn}>
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p style={styles.footer}>
        Already have an account?{" "}
        <a href="/login" style={styles.footerLink}>Sign in</a>
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
  note: {
    padding: "10px 14px",
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "6px",
    color: "#92400e",
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
    background: "#ffffff",
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

export default RegisterForm; 
