import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import groupService from "../services/groupService";
import joinRequestService from "../services/joinRequestService";

const CreatorDashboardPage = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setActionError(null);
    setActionSuccess(null);
    try {
      const my = await groupService.getMyGroups();
      setGroups(Array.isArray(my) ? my : []);

      const firstId = (Array.isArray(my) && my.length > 0 && my[0]?.id) ? my[0].id : "";
      setSelectedGroupId((prev) => prev || firstId || "");
    } catch (err) {
      setError(err?.message || "Failed to load dashboard data.");
      setGroups([]);
      setSelectedGroupId("");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRequests = useCallback(async (groupId) => {
    if (!groupId) {
      setRequests([]);
      return;
    }

    setRequestsLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const list = await joinRequestService.getJoinRequestsForGroup(groupId);
      setRequests(Array.isArray(list) ? list : []);
    } catch (err) {
      setActionError(err?.message || "Failed to load join requests.");
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!selectedGroupId) return;
    loadRequests(selectedGroupId);
  }, [selectedGroupId, loadRequests]);

  const selectedGroup = useMemo(
    () => (Array.isArray(groups) ? groups.find((g) => String(g.id) === String(selectedGroupId)) : null),
    [groups, selectedGroupId]
  );

  const pendingRequests = useMemo(
    () => (Array.isArray(requests) ? requests.filter((r) => r?.status === "Pending") : []),
    [requests]
  );

  const handleApprove = async (requestId) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      await joinRequestService.approveJoinRequest(requestId);
      setActionSuccess("Request approved.");
      await loadRequests(selectedGroupId);
    } catch (err) {
      setActionError(err?.message || "Failed to approve request.");
    }
  };

  const handleReject = async (requestId) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      await joinRequestService.rejectJoinRequest(requestId);
      setActionSuccess("Request rejected.");
      await loadRequests(selectedGroupId);
    } catch (err) {
      setActionError(err?.message || "Failed to reject request.");
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Creator Dashboard</h1>
          <p style={styles.subTitle}>
            Manage your groups and approve/reject join requests.
          </p>
        </div>
        <div style={styles.headerActions}>
          <Link to="/groups/create" style={styles.primaryLink}>
            Create group
          </Link>
          <button type="button" onClick={() => load()} style={styles.secondaryBtn}>
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div style={styles.alertError}>
          <strong style={styles.alertTitle}>Couldn’t load dashboard</strong>
          <div style={styles.alertText}>{error}</div>
        </div>
      ) : null}

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>My groups</h3>
          </div>

          {groups.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyTitle}>No groups yet</div>
              <div style={styles.emptyHint}>
                Create your first group to start accepting join requests.
              </div>
              <Link to="/groups/create" style={styles.primaryLink}>
                Create group
              </Link>
            </div>
          ) : (
            <>
              <label style={styles.label}>
                Select group
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  style={styles.select}
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} {g.isApproved ? "" : "(Pending)"}
                    </option>
                  ))}
                </select>
              </label>

              {selectedGroup ? (
                <div style={styles.groupMeta}>
                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>Subject</span>
                    <span style={styles.metaValue}>{selectedGroup.subject}</span>
                  </div>
                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>Status</span>
                    <span style={styles.metaValue}>
                      {selectedGroup.isApproved ? "Approved" : "Pending approval"}
                    </span>
                  </div>
                  <div style={styles.metaActions}>
                    <Link to={`/groups/${selectedGroupId}`} style={styles.secondaryLink}>
                      View group
                    </Link>
                    <Link to={`/groups/${selectedGroupId}/edit`} style={styles.secondaryLink}>
                      Edit
                    </Link>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Join requests</h3>
            {selectedGroupId ? (
              <span style={styles.badge}>{pendingRequests.length} pending</span>
            ) : null}
          </div>

          {!selectedGroupId ? (
            <div style={styles.muted}>
              Select a group to view join requests.
            </div>
          ) : (
            <>
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

              {requestsLoading ? (
                <div style={styles.loadingWrap}>
                  <LoadingSpinner />
                </div>
              ) : requests.length === 0 ? (
                <div style={styles.empty}>
                  <div style={styles.emptyTitle}>No join requests</div>
                  <div style={styles.emptyHint}>
                    When students request to join, they will appear here.
                  </div>
                </div>
              ) : (
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Student</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Created</th>
                        <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r.id} style={styles.tr}>
                          <td style={styles.td}>{r.userFullName}</td>
                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.statusPill,
                                ...(r.status === "Approved"
                                  ? styles.statusOk
                                  : r.status === "Rejected"
                                  ? styles.statusBad
                                  : styles.statusPending),
                              }}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                          </td>
                          <td style={{ ...styles.td, textAlign: "right" }}>
                            {r.status === "Pending" ? (
                              <div style={styles.rowActions}>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(r.id)}
                                  style={styles.approveBtn}
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(r.id)}
                                  style={styles.rejectBtn}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={styles.mutedSmall}>No actions</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
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
  subTitle: { margin: "6px 0 0", fontSize: "14px", color: "#6b7280", lineHeight: 1.6 },
  headerActions: { display: "flex", gap: "10px", flexWrap: "wrap" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" },
  cardTitle: { margin: 0, fontSize: "14px", fontWeight: "900", color: "#111827" },
  badge: {
    fontSize: "12px",
    fontWeight: "900",
    color: "#4f46e5",
    background: "#eef2ff",
    borderRadius: "999px",
    padding: "6px 10px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "12px",
    fontWeight: "800",
    color: "#374151",
  },
  select: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "14px",
    background: "#ffffff",
    outline: "none",
  },
  groupMeta: { borderTop: "1px solid #f3f4f6", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" },
  metaRow: { display: "flex", justifyContent: "space-between", gap: "10px" },
  metaLabel: { color: "#9ca3af", fontSize: "12px", fontWeight: "800" },
  metaValue: { color: "#374151", fontSize: "13px", fontWeight: "800" },
  metaActions: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "2px" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "900",
    borderBottom: "1px solid #e5e7eb",
    padding: "10px 8px",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "10px 8px", fontSize: "13px", color: "#374151", verticalAlign: "top" },
  rowActions: { display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" },
  statusPill: { fontSize: "12px", fontWeight: "900", padding: "4px 10px", borderRadius: "999px", border: "1px solid rgba(17,24,39,0.06)" },
  statusOk: { color: "#047857", background: "#ecfdf5" },
  statusBad: { color: "#b91c1c", background: "#fff1f2" },
  statusPending: { color: "#b45309", background: "#fffbeb" },
  approveBtn: { background: "#059669", color: "#ffffff", border: "none", borderRadius: "10px", padding: "8px 10px", cursor: "pointer", fontSize: "13px", fontWeight: "900" },
  rejectBtn: { background: "#ef4444", color: "#ffffff", border: "none", borderRadius: "10px", padding: "8px 10px", cursor: "pointer", fontSize: "13px", fontWeight: "900" },
  muted: { color: "#6b7280", fontSize: "13px", lineHeight: 1.6 },
  mutedSmall: { color: "#9ca3af", fontSize: "12px", fontWeight: "800" },
  empty: {
    border: "1px dashed #d1d5db",
    borderRadius: "14px",
    padding: "18px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
  },
  emptyTitle: { fontWeight: "900", color: "#111827" },
  emptyHint: { color: "#6b7280", fontSize: "13px", lineHeight: 1.6, margin: 0 },
  loadingWrap: { padding: "12px 0", display: "flex", justifyContent: "center" },
  primaryLink: {
    background: "#4f46e5",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "10px 14px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "900",
    display: "inline-block",
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
  secondaryBtn: {
    background: "#ffffff",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "900",
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
};

export default CreatorDashboardPage;

 
