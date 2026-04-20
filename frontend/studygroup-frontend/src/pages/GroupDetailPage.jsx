import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";
import groupService from "../services/groupService";
import joinRequestService from "../services/joinRequestService";

const GroupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const isCreator = user?.role === ROLES.GROUP_CREATOR;
  const isStudent = user?.role === ROLES.STUDENT;

  const isOwner = useMemo(() => {
    if (!group?.ownerId || !user?.id) return false;
    return String(group.ownerId).toLowerCase() === String(user.id).toLowerCase();
  }, [group?.ownerId, user?.id]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupService.getGroupById(id);
      setGroup(data);
    } catch (err) {
      setError(err?.message || "Failed to load group.");
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    load();
  }, [id, load]);

  const handleJoinRequest = async () => {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await joinRequestService.createJoinRequest(id);
      setActionSuccess("Join request submitted.");
    } catch (err) {
      setActionError(err?.message || "Failed to submit join request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Delete this group? This action cannot be undone.");
    if (!ok) return;

    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await groupService.deleteGroup(id);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setActionError(err?.message || "Failed to delete group.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error) {
    return (
      <div style={styles.errorPage}>
        <h2 style={styles.errorTitle}>Group not available</h2>
        <p style={styles.errorMsg}>{error}</p>
        <div style={styles.errorBtns}>
          <button onClick={() => load()} style={styles.primaryBtn}>
            Try again
          </button>
          <Link to="/groups" style={styles.secondaryLink}>
            Back to groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{group?.name}</h1>
          <div style={styles.metaLine}>
            <span style={styles.pill}>{group?.subject}</span>
            <span style={styles.metaText}>
              Owner: <strong>{group?.ownerName}</strong>
            </span>
            <span style={styles.metaText}>
              Members: <strong>{group?.memberCount}</strong> /{" "}
              <strong>{group?.maxMembers}</strong>
            </span>
            {group?.isApproved === false ? (
              <span style={{ ...styles.pill, ...styles.pillWarn }}>Pending approval</span>
            ) : null}
          </div>
        </div>

        <div style={styles.headerActions}>
          <Link to="/groups" style={styles.secondaryLink}>
            Back
          </Link>
          {isCreator && isOwner ? (
            <>
              <Link to={`/groups/${id}/edit`} style={styles.secondaryLink}>
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                style={styles.dangerBtn}
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Description</h3>
        <p style={styles.desc}>{group?.description}</p>
      </div>

      {actionError ? (
        <div style={styles.alertError}>
          <strong style={styles.alertTitle}>Action failed</strong>
          <div style={styles.alertText}>{actionError}</div>
        </div>
      ) : null}

      {actionSuccess ? (
        <div style={styles.alertSuccess}>
          <strong style={styles.alertTitle}>Success</strong>
          <div style={styles.alertText}>{actionSuccess}</div>
        </div>
      ) : null}

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Actions</h3>

        {isStudent ? (
          <div style={styles.actionRow}>
            <div style={styles.actionInfo}>
              <div style={styles.actionName}>Request to join</div>
              <div style={styles.actionHint}>
                Your request will be reviewed by the group creator.
              </div>
            </div>
            <button
              type="button"
              onClick={handleJoinRequest}
              disabled={actionLoading || group?.isApproved === false}
              style={styles.primaryBtn}
            >
              Send request
            </button>
          </div>
        ) : (
          <div style={styles.muted}>
            Joining is available for students. If you’re a creator, manage requests from your dashboard.
          </div>
        )}
      </div>
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
  metaLine: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  pill: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#4f46e5",
    background: "#eef2ff",
    borderRadius: "999px",
    padding: "6px 10px",
  },
  pillWarn: { color: "#b45309", background: "#fffbeb" },
  metaText: { fontSize: "13px", color: "#6b7280" },
  headerActions: { display: "flex", alignItems: "center", gap: "10px" },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "16px",
  },
  sectionTitle: { margin: 0, fontSize: "14px", fontWeight: "900", color: "#111827" },
  desc: { margin: "10px 0 0", color: "#6b7280", lineHeight: 1.7, fontSize: "14px" },
  muted: { color: "#6b7280", fontSize: "13px", lineHeight: 1.6, marginTop: "10px" },
  actionRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  actionInfo: { display: "flex", flexDirection: "column", gap: "4px" },
  actionName: { fontWeight: "900", color: "#111827", fontSize: "14px" },
  actionHint: { color: "#6b7280", fontSize: "13px" },
  primaryBtn: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "900",
    whiteSpace: "nowrap",
  },
  dangerBtn: {
    background: "#ef4444",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "900",
    whiteSpace: "nowrap",
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
  alertSuccess: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "14px",
    padding: "12px 14px",
  },
  alertTitle: { color: "#111827", fontSize: "13px" },
  alertText: { marginTop: "4px", fontSize: "13px", color: "#374151", lineHeight: 1.6 },
  errorPage: {
    minHeight: "50vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "8px",
    padding: "24px",
  },
  errorTitle: { margin: 0, fontSize: "22px", fontWeight: "900", color: "#111827" },
  errorMsg: { margin: 0, color: "#6b7280", fontSize: "14px", lineHeight: 1.6 },
  errorBtns: { display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" },
};

export default GroupDetailPage;

 
