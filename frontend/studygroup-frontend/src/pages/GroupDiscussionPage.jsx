import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useDiscussion from "../hooks/useDiscussion";
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

  return (
    <div className="group-workspace">
      <header className="group-workspace__header">
        <div>
          <button type="button" onClick={() => navigate(`/groups/${groupId}`)} className="group-workspace__back">
            ← Back to group
          </button>
          <h1 className="group-workspace__title">Group workspace</h1>
        </div>
        <div className="group-workspace__status" aria-live="polite">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: connected ? "var(--success)" : "var(--warning)",
              display: "inline-block",
            }}
          />
          {connected ? "Live" : "Connecting…"}
        </div>
      </header>

      <div className="group-workspace__tabs" role="tablist" aria-label="Workspace sections">
        <button
          type="button"
          role="tab"
          aria-selected={tab === TAB.DISCUSSION}
          className={`group-workspace__tab${tab === TAB.DISCUSSION ? " group-workspace__tab--active" : ""}`}
          onClick={() => setTab(TAB.DISCUSSION)}
        >
          Discussion
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === TAB.MATERIALS}
          className={`group-workspace__tab${tab === TAB.MATERIALS ? " group-workspace__tab--active" : ""}`}
          onClick={() => setTab(TAB.MATERIALS)}
        >
          Materials
        </button>
      </div>

      {tab === TAB.DISCUSSION && (
        <div className="group-workspace__body" style={{ display: "flex", flexDirection: "column" }}>
          <div className="group-workspace__scroll">
            {loading && <div className="workspace-placeholder">Loading messages…</div>}
            {error && <div className="workspace-placeholder workspace-placeholder--error">{error}</div>}
            {!loading && !error && (
              <MessageList messages={messages} currentUserId={user?.id} onDelete={deleteMessage} />
            )}
          </div>
          <MessageInput onSend={handleSend} disabled={sending} />
        </div>
      )}

      {tab === TAB.MATERIALS && (
        <div className="group-workspace__body">
          <div className="group-workspace__panel-pad">
            <UploadMaterialForm groupId={groupId} onUploaded={handleMaterialUploaded} />
            {matsLoading && <p className="workspace-muted">Loading materials…</p>}
            {matsError && <p className="workspace-placeholder--error" style={{ marginTop: 8 }}>{matsError}</p>}
            {!matsLoading && (
              <MaterialsList
                materials={materials}
                groupId={groupId}
                currentUserId={user?.id}
                onDeleted={handleMaterialDeleted}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDiscussionPage;
