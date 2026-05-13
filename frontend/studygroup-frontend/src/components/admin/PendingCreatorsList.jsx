import React, { useState } from "react";
import { approveCreator, rejectCreator } from "../../services/adminService";

const PendingCreatorsList = ({ users, onApproved }) => {
  const [processing, setProcessing] = useState(null);

  const pending = (users || []).filter(
    (u) => u.role === "GroupCreator" && !u.isApproved
  );

  const handleApprove = async (userId) => {
    setProcessing(userId);
    try {
      await approveCreator(userId);
      onApproved && onApproved(userId);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Reject this creator registration? Their account will be removed.")) return;
    setProcessing(userId);
    try {
      await rejectCreator(userId);
      onApproved && onApproved(userId);
    } catch (err) {
      alert("Error: " + (err.message || "Reject failed"));
    } finally {
      setProcessing(null);
    }
  };

  if (pending.length === 0) {
    return (
      <div style={{ color: "#9ca3af", fontSize: "14px", padding: "12px 0" }}>
        No pending creator requests.
      </div>
    );
  }

  return (
    <div>
      {pending.map((user) => (
        <div
          key={user.id}
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
            <div style={{ fontWeight: 600, fontSize: "14px" }}>{user.fullName}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>{user.email}</div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button
              onClick={() => handleApprove(user.id)}
              disabled={processing === user.id}
              style={{
                backgroundColor: "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: processing === user.id ? "not-allowed" : "pointer",
                opacity: processing === user.id ? 0.6 : 1,
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {processing === user.id ? "Working…" : "Approve"}
            </button>
            <button
              type="button"
              onClick={() => handleReject(user.id)}
              disabled={processing === user.id}
              style={{
                backgroundColor: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: processing === user.id ? "not-allowed" : "pointer",
                opacity: processing === user.id ? 0.6 : 1,
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingCreatorsList;
