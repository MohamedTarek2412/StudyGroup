import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDiscussion } from "../hooks/useDiscussion";
import { getMaterials } from "../services/materialService";
import MessageList from "../components/discussion/MessageList";
import MessageInput from "../components/discussion/MessageInput";
import MaterialsList from "../components/materials/MaterialsList";
import UploadMaterialForm from "../components/materials/UploadMaterialForm";

const TAB = { DISCUSSION: "discussion", MATERIALS: "materials" };

const GroupDiscussionPage = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, loading, error, connected, sendMessage, deleteMessage } = useDiscussion(groupId);

  const [tab, setTab] = useState(TAB.DISCUSSION);
  const [materials, setMaterials] = useState([]);
  const [matsLoading, setMatsLoading] = useState(false);
  const [matsError, setMatsError] = useState(null);
  const [sending, setSending] = useState(false);

  // Load materials when tab switches
  useEffect(() => {
    if (tab !== TAB.MATERIALS) return;
    setMatsLoading(true);
    getMaterials(groupId)
      .then((data) => setMaterials(Array.isArray(data) ? data : []))
      .catch((err) => setMatsError(err.message))
      .finally(() => setMatsLoading(false));
  }, [tab, groupId]);

  const handleSend = async (content) => {
    setSending(true);
    try {
      await sendMessage(content);
    } catch (err) {
      alert("Failed to send: " + err.message);
    } finally {
      setSending(false);
    }
  };

  const handleMaterialUploaded = (newMat) => {
    setMaterials((prev) => [newMat, ...prev]);
  };

  const handleMaterialDeleted = (matId) => {
    setMaterials((prev) => prev.filter((m) => m.id !== matId));
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
    transition: "all 0.15s",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <button
            onClick={() => navigate(`/groups/${groupId}`)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#4f46e5", fontSize: "13px", padding: 0, marginBottom: "4px" }}
          >
            ← Back to group
          </button>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Group Workspace</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: connected ? "#10b981" : "#f59e0b", display: "inline-block" }} />
          <span style={{ fontSize: "12px", color: "#6b7280" }}>{connected ? "Live" : "Connecting…"}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
        <button style={tabStyle(tab === TAB.DISCUSSION)} onClick={() => setTab(TAB.DISCUSSION)}>
          💬 Discussion
        </button>
        <button style={tabStyle(tab === TAB.MATERIALS)} onClick={() => setTab(TAB.MATERIALS)}>
          📁 Materials
        </button>
      </div>

      {/* Content */}
      {tab === TAB.DISCUSSION && (
        <>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading && (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading messages…</div>
            )}
            {error && (
              <div style={{ textAlign: "center", padding: "24px", color: "#ef4444" }}>{error}</div>
            )}
            {!loading && !error && (
              <MessageList
                messages={messages}
                currentUserId={user?.id}
                onDelete={deleteMessage}
              />
            )}
          </div>
          <MessageInput onSend={handleSend} disabled={sending} />
        </>
      )}

      {tab === TAB.MATERIALS && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          <UploadMaterialForm groupId={groupId} onUploaded={handleMaterialUploaded} />
          {matsLoading && <div style={{ color: "#9ca3af", fontSize: "14px" }}>Loading materials…</div>}
          {matsError && <div style={{ color: "#ef4444", fontSize: "14px" }}>{matsError}</div>}
          {!matsLoading && (
            <MaterialsList
              materials={materials}
              groupId={groupId}
              currentUserId={user?.id}
              onDeleted={handleMaterialDeleted}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GroupDiscussionPage;
