import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import groupService from "../services/groupService";

const CreateGroupPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    subject: "",
    description: "",
    maxMembers: 30,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const validation = useMemo(() => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.subject.trim()) errors.subject = "Subject is required.";
    if (!form.description.trim()) errors.description = "Description is required.";
    const max = Number(form.maxMembers);
    if (!Number.isFinite(max) || max < 1) errors.maxMembers = "Max members must be at least 1.";
    return errors;
  }, [form]);

  const canSubmit = useMemo(() => Object.keys(validation).length === 0 && !submitting, [validation, submitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
        maxMembers: Number(form.maxMembers),
      };
      const created = await groupService.createGroup(payload);
      navigate(`/groups/${created.id}`, { replace: true });
    } catch (err) {
      setError(err?.message || "Failed to create group.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Create Group</h1>
          <p style={styles.subTitle}>
            New groups require admin approval before they appear in browsing.
          </p>
        </div>
        <Link to="/dashboard" style={styles.secondaryLink}>
          Back to dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={styles.card}>
        {error ? (
          <div style={styles.alertError}>
            <strong style={styles.alertTitle}>Couldn’t create group</strong>
            <div style={styles.alertText}>{error}</div>
          </div>
        ) : null}

        <div style={styles.grid}>
          <label style={styles.label}>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              style={styles.input}
              disabled={submitting}
              placeholder="e.g. Algorithms Study Circle"
            />
            {validation.name ? <div style={styles.fieldError}>{validation.name}</div> : null}
          </label>

          <label style={styles.label}>
            Subject
            <input
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              style={styles.input}
              disabled={submitting}
              placeholder="e.g. Computer Science"
            />
            {validation.subject ? <div style={styles.fieldError}>{validation.subject}</div> : null}
          </label>

          <label style={{ ...styles.label, gridColumn: "1 / -1" }}>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              style={styles.textarea}
              disabled={submitting}
              placeholder="What will this group focus on? How will it run?"
            />
            {validation.description ? <div style={styles.fieldError}>{validation.description}</div> : null}
          </label>

          <label style={styles.label}>
            Max members
            <input
              type="number"
              min={1}
              value={form.maxMembers}
              onChange={(e) => setForm((p) => ({ ...p, maxMembers: e.target.value }))}
              style={styles.input}
              disabled={submitting}
            />
            {validation.maxMembers ? <div style={styles.fieldError}>{validation.maxMembers}</div> : null}
          </label>
        </div>

        <div style={styles.actions}>
          <button type="submit" disabled={!canSubmit} style={styles.primaryBtn}>
            {submitting ? "Creating..." : "Create group"}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  page: { display: "flex", flexDirection: "column", gap: "16px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  title: { margin: 0, fontSize: "26px", fontWeight: "900", color: "#111827" },
  subTitle: { margin: "6px 0 0", fontSize: "14px", color: "#6b7280", lineHeight: 1.6 },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "12px",
    fontWeight: "800",
    color: "#374151",
  },
  input: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "14px",
    outline: "none",
    minHeight: "120px",
    resize: "vertical",
  },
  fieldError: { color: "#b91c1c", fontSize: "12px", fontWeight: "700" },
  actions: { display: "flex", justifyContent: "flex-end" },
  primaryBtn: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "900",
  },
  secondaryLink: {
    background: "#ffffff",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 14px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "900",
    display: "inline-block",
  },
  alertError: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: "14px",
    padding: "12px 14px",
  },
  alertTitle: { color: "#111827", fontSize: "13px" },
  alertText: { marginTop: "4px", fontSize: "13px", color: "#374151", lineHeight: 1.6 },
};

export default CreateGroupPage;

 
