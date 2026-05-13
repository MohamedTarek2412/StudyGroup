import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import groupService from "../services/groupService";

const EditGroupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    description: "",
    location: "",
    meetingType: "Online",
    meetingSchedule: "",
    maxMembers: 30,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const g = await groupService.getGroupById(id);
        if (cancelled) return;
        setForm({
          name: g?.name || "",
          subject: g?.subject || "",
          description: g?.description || "",
          location: g?.location || "",
          meetingType: g?.meetingType || "Online",
          meetingSchedule: g?.meetingSchedule || "",
          maxMembers: Number.isFinite(g?.maxMembers) ? g.maxMembers : 30,
        });
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Failed to load group.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const validation = useMemo(() => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.subject.trim()) errors.subject = "Subject is required.";
    if (!form.description.trim()) errors.description = "Description is required.";
    if (!form.meetingSchedule.trim()) errors.meetingSchedule = "Schedule is required.";
    if (form.meetingType === "Offline" && !form.location.trim()) {
      errors.location = "Location is required for offline meetings.";
    }
    const max = Number(form.maxMembers);
    if (!Number.isFinite(max) || max < 1) errors.maxMembers = "Max students must be at least 1 (owner is separate).";
    return errors;
  }, [form]);

  const canSubmit = useMemo(
    () => Object.keys(validation).length === 0 && !submitting,
    [validation, submitting]
  );

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
        location: form.location.trim(),
        meetingType: form.meetingType,
        meetingSchedule: form.meetingSchedule.trim(),
        maxMembers: Number(form.maxMembers),
      };
      await groupService.updateGroup(id, payload);
      navigate(`/groups/${id}`, { replace: true });
    } catch (err) {
      setError(err?.message || "Failed to update group.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="container mt-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Group</h1>
          <p className="page-subtitle">Update group details. Changes take effect immediately.</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/groups/${id}`} className="btn btn-secondary">
            Back to group
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        {error && (
          <div className="alert alert-error">
            <strong className="alert-title">Couldn’t update group</strong>
            <span className="alert-desc">{error}</span>
          </div>
        )}

        <div className="grid-cols-2">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              disabled={submitting}
            />
            {validation.name && <div className="form-error">{validation.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              className="form-input"
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              disabled={submitting}
            />
            {validation.subject && <div className="form-error">{validation.subject}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            disabled={submitting}
          />
          {validation.description && <div className="form-error">{validation.description}</div>}
        </div>

        <div className="grid-cols-3">
          <div className="form-group">
            <label className="form-label">Meeting Type</label>
            <select
              className="form-select"
              value={form.meetingType}
              onChange={(e) => setForm((p) => ({ ...p, meetingType: e.target.value }))}
              disabled={submitting}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location (or Link)</label>
            <input
              className="form-input"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              disabled={submitting}
            />
            {validation.location && <div className="form-error">{validation.location}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Meeting Schedule</label>
            <input
              className="form-input"
              value={form.meetingSchedule}
              onChange={(e) => setForm((p) => ({ ...p, meetingSchedule: e.target.value }))}
              disabled={submitting}
            />
            {validation.meetingSchedule && <div className="form-error">{validation.meetingSchedule}</div>}
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: "300px" }}>
          <label className="form-label">Max members</label>
          <input
            type="number"
            min={1}
            className="form-input"
            value={form.maxMembers}
            onChange={(e) => setForm((p) => ({ ...p, maxMembers: e.target.value }))}
            disabled={submitting}
          />
          {validation.maxMembers && <div className="form-error">{validation.maxMembers}</div>}
        </div>

        <div className="flex justify-end mt-4">
          <button type="submit" disabled={!canSubmit} className="btn btn-primary">
            {submitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditGroupPage;

 
