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
    <div className="container mt-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Creator Dashboard</h1>
          <p className="page-subtitle">
            Manage your groups and approve/reject join requests.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/groups/create" className="btn btn-primary">
            Create group
          </Link>
          <button type="button" onClick={() => load()} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong className="alert-title">Couldn't load dashboard</strong>
          <span className="alert-desc">{error}</span>
        </div>
      )}

      <div className="grid-cols-2">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "var(--text-main)" }}>My groups</h3>
          </div>

          {groups.length === 0 ? (
            <div style={{ border: "1px dashed var(--border-color)", borderRadius: "var(--radius-lg)", padding: "24px", textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
              <div style={{ fontWeight: "800", color: "var(--text-main)" }}>No groups yet</div>
              <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Create your first group to start accepting join requests.
              </div>
              <Link to="/groups/create" className="btn btn-primary mt-4">
                Create group
              </Link>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Select group</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="form-select"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} {g.isApproved ? "" : "(Pending)"}
                    </option>
                  ))}
                </select>
              </div>

              {selectedGroup && (
                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="flex justify-between">
                    <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "700" }}>Subject</span>
                    <span style={{ color: "var(--text-main)", fontSize: "13px", fontWeight: "700" }}>{selectedGroup.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "700" }}>Status</span>
                    <span style={{ color: "var(--text-main)", fontSize: "13px", fontWeight: "700" }}>
                      {selectedGroup.isApproved ? "Approved" : "Pending approval"}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <Link to={`/groups/${selectedGroupId}`} className="btn btn-secondary">
                      View group
                    </Link>
                    <Link to={`/groups/${selectedGroupId}/discussion`} className="btn btn-primary">
                      Workspace
                    </Link>
                    <Link to={`/groups/${selectedGroupId}/edit`} className="btn btn-secondary">
                      Edit
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "var(--text-main)" }}>Join requests</h3>
            {selectedGroupId && (
              <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--primary)", background: "#eef2ff", borderRadius: "999px", padding: "6px 12px" }}>
                {pendingRequests.length} pending
              </span>
            )}
          </div>

          {!selectedGroupId ? (
            <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Select a group to view join requests.
            </div>
          ) : (
            <>
              {actionError && (
                <div className="alert alert-error">
                  <strong className="alert-title">Action failed</strong>
                  <span className="alert-desc">{actionError}</span>
                </div>
              )}
              {actionSuccess && (
                <div className="alert" style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46" }}>
                  <strong className="alert-title">Success</strong>
                  <span className="alert-desc">{actionSuccess}</span>
                </div>
              )}

              {requestsLoading ? (
                <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
                  <LoadingSpinner />
                </div>
              ) : requests.length === 0 ? (
                <div style={{ border: "1px dashed var(--border-color)", borderRadius: "var(--radius-lg)", padding: "24px", textAlign: "center" }}>
                  <div style={{ fontWeight: "800", color: "var(--text-main)" }}>No join requests</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
                    When students request to join, they will appear here.
                  </div>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Student</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Created</th>
                        <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={tdStyle}>{r.userFullName}</td>
                          <td style={tdStyle}>
                            <span style={{
                              fontSize: "12px", fontWeight: "800", padding: "4px 10px", borderRadius: "999px",
                              ...(r.status === "Approved" ? { color: "#047857", background: "#ecfdf5" } :
                                r.status === "Rejected" ? { color: "#b91c1c", background: "#fff1f2" } :
                                  { color: "#b45309", background: "#fffbeb" })
                            }}>
                              {r.status}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {r.status === "Pending" ? (
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleApprove(r.id)}
                                  className="btn btn-primary"
                                  style={{ background: "var(--success)", padding: "6px 12px", fontSize: "13px" }}
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(r.id)}
                                  className="btn btn-danger"
                                  style={{ padding: "6px 12px", fontSize: "13px" }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "700" }}>No actions</span>
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

const thStyle = {
  textAlign: "left",
  fontSize: "12px",
  color: "#6b7280",
  fontWeight: "800",
  borderBottom: "1px solid var(--border-color)",
  padding: "10px 8px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "10px 8px",
  fontSize: "13px",
  color: "var(--text-main)",
  verticalAlign: "top",
};

export default CreatorDashboardPage;
