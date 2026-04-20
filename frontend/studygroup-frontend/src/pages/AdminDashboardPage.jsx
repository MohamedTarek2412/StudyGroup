import React, { useState, useEffect } from "react";
import { getPendingGroups, getAllUsers } from "../services/adminService";
import PendingGroupsList from "../components/admin/PendingGroupsList";
import PendingCreatorsList from "../components/admin/PendingCreatorsList";

const TAB = { GROUPS: "groups", CREATORS: "creators", USERS: "users" };

const AdminDashboardPage = () => {
  const [tab, setTab] = useState(TAB.GROUPS);
  const [pendingGroups, setPendingGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getPendingGroups(), getAllUsers()])
      .then(([groups, allUsers]) => {
        setPendingGroups(Array.isArray(groups) ? groups : []);
        setUsers(Array.isArray(allUsers) ? allUsers : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleGroupUpdated = (groupId) => {
    setPendingGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleCreatorApproved = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isApproved: true } : u))
    );
  };

  const tabStyle = (active) => ({
    padding: "10px 20px",
    border: "none",
    borderBottom: active ? "2px solid #4f46e5" : "2px solid transparent",
    backgroundColor: "transparent",
    color: active ? "#4f46e5" : "#6b7280",
    cursor: "pointer",
    fontWeight: active ? 700 : 400,
    fontSize: "14px",
  });

  const pendingCreators = users.filter((u) => u.role === "GroupCreator" && !u.isApproved);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0, color: "#111827" }}>
          🛡️ Admin Dashboard
        </h1>
        <p style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
          Manage pending groups and creator approvals
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: "Pending Groups", count: pendingGroups.length, color: "#f59e0b" },
          { label: "Pending Creators", count: pendingCreators.length, color: "#8b5cf6" },
          { label: "Total Users", count: users.length, color: "#10b981" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: "16px 20px",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              minWidth: "140px",
              backgroundColor: "#fafafa",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 800, color: stat.color }}>{stat.count}</div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #e5e7eb", marginBottom: "20px", display: "flex" }}>
        <button style={tabStyle(tab === TAB.GROUPS)} onClick={() => setTab(TAB.GROUPS)}>
          Pending Groups {pendingGroups.length > 0 && `(${pendingGroups.length})`}
        </button>
        <button style={tabStyle(tab === TAB.CREATORS)} onClick={() => setTab(TAB.CREATORS)}>
          Pending Creators {pendingCreators.length > 0 && `(${pendingCreators.length})`}
        </button>
        <button style={tabStyle(tab === TAB.USERS)} onClick={() => setTab(TAB.USERS)}>
          All Users
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading…</div>
      ) : (
        <>
          {tab === TAB.GROUPS && (
            <PendingGroupsList groups={pendingGroups} onUpdated={handleGroupUpdated} />
          )}
          {tab === TAB.CREATORS && (
            <PendingCreatorsList users={users} onApproved={handleCreatorApproved} />
          )}
          {tab === TAB.USERS && (
            <div>
              {users.map((u) => (
                <div
                  key={u.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px" }}>{u.fullName}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{u.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: "9999px",
                        backgroundColor: u.role === "Admin" ? "#fef3c7" : u.role === "GroupCreator" ? "#ede9fe" : "#f0fdf4",
                        color: u.role === "Admin" ? "#d97706" : u.role === "GroupCreator" ? "#7c3aed" : "#16a34a",
                      }}
                    >
                      {u.role}
                    </span>
                    {u.role === "GroupCreator" && (
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                          backgroundColor: u.isApproved ? "#dcfce7" : "#fee2e2",
                          color: u.isApproved ? "#16a34a" : "#dc2626",
                          fontWeight: 600,
                        }}
                      >
                        {u.isApproved ? "Approved" : "Pending"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
