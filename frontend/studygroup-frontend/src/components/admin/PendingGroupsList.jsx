import React, { useState } from "react";
import { approveGroup, rejectGroup } from "../../services/adminService";

const PendingGroupsList = ({ groups, onUpdated }) => {
  const [processing, setProcessing] = useState(null);

  const handleApprove = async (groupId) => {
    setProcessing(groupId + "_approve");
    try {
      await approveGroup(groupId);
      onUpdated && onUpdated(groupId, "approved");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (groupId) => {
    if (!window.confirm("Are you sure you want to reject this group?")) return;
    setProcessing(groupId + "_reject");
    try {
      await rejectGroup(groupId);
      onUpdated && onUpdated(groupId, "rejected");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  if (!groups || groups.length === 0) {
    return (
      <div style={{ color: "#9ca3af", fontSize: "14px", padding: "12px 0" }}>
        No pending groups.
      </div>
    );
  }

  return (
    <div>
      {groups.map((group) => (
        <div
          key={group.id}
          style={{
            padding: "14px 16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            marginBottom: "10px",
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1, marginRight: "16px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px" }}>{group.name}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                Subject: {group.subject} · By: {group.ownerName} · Max: {group.maxMembers} members
              </div>
              {group.description && (
                <div style={{ fontSize: "13px", color: "#374151", marginTop: "6px" }}>
                  {group.description}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={() => handleApprove(group.id)}
                disabled={!!processing}
                style={{
                  backgroundColor: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "7px 14px",
                  cursor: processing ? "not-allowed" : "pointer",
                  opacity: processing ? 0.6 : 1,
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {processing === group.id + "_approve" ? "…" : "Approve"}
              </button>
              <button
                onClick={() => handleReject(group.id)}
                disabled={!!processing}
                style={{
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "7px 14px",
                  cursor: processing ? "not-allowed" : "pointer",
                  opacity: processing ? 0.6 : 1,
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {processing === group.id + "_reject" ? "…" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingGroupsList;
