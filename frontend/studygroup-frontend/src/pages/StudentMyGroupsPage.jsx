import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import joinRequestService from "../services/joinRequestService";

const statusStyle = (status) => {
  if (status === "Approved") return { color: "#047857", background: "#ecfdf5" };
  if (status === "Pending") return { color: "#b45309", background: "#fffbeb" };
  if (status === "Rejected") return { color: "#b91c1c", background: "#fff1f2" };
  return { color: "#6b7280", background: "#f3f4f6" };
};

const StudentMyGroupsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await joinRequestService.getMyJoinRequests();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load your groups.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="container mt-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">My groups</h1>
          <p className="page-subtitle">
            Study groups you requested to join. Open the workspace when your request is approved to discuss and
            share files.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/groups" className="btn btn-primary">
            Browse more groups
          </Link>
          <button type="button" onClick={() => load()} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong className="alert-title">Could not load list</strong>
          <span className="alert-desc">{error}</span>
        </div>
      )}

      {items.length === 0 && !error ? (
        <div className="card" style={{ textAlign: "center", padding: "40px 24px", border: "1px dashed var(--border-color)" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "var(--text-main)" }}>
            No join requests yet
          </h3>
          <p style={{ margin: "12px 0 0", fontSize: "14px", color: "var(--text-muted)" }}>
            Browse approved groups and send a request to join one.
          </p>
          <Link to="/groups" className="btn btn-primary mt-4" style={{ display: "inline-flex" }}>
            Browse groups
          </Link>
        </div>
      ) : items.length > 0 ? (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Group</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Requested</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{r.groupName || "—"}</div>
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 800,
                        padding: "4px 10px",
                        borderRadius: "999px",
                        ...statusStyle(r.status),
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td style={tdStyle}>{r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div className="flex gap-2 justify-end flex-wrap">
                      <Link to={`/groups/${r.groupId}`} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "13px" }}>
                        View group
                      </Link>
                      {r.status === "Approved" && (
                        <Link
                          to={`/groups/${r.groupId}/discussion`}
                          className="btn btn-primary"
                          style={{ padding: "6px 12px", fontSize: "13px" }}
                        >
                          Workspace
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

const thStyle = {
  textAlign: "left",
  fontSize: "12px",
  color: "#6b7280",
  fontWeight: 800,
  borderBottom: "1px solid var(--border-color)",
  padding: "10px 8px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px 8px",
  fontSize: "14px",
  color: "var(--text-main)",
  verticalAlign: "middle",
};

export default StudentMyGroupsPage;
