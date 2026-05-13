import React from "react";
import { formatDate } from "../../utils/formatDate";
import { downloadMaterial, deleteMaterial } from "../../services/materialService";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MaterialsList = ({ materials, groupId, currentUserId, onDeleted }) => {
  const handleDownload = async (mat) => {
    try {
      await downloadMaterial(groupId, mat.id, mat.fileName);
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  const handleDelete = async (mat) => {
    if (!window.confirm(`Delete "${mat.fileName}"?`)) return;
    try {
      await deleteMaterial(groupId, mat.id);
      onDeleted && onDeleted(mat.id);
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  if (!materials || materials.length === 0) {
    return (
      <div style={{ color: "#9ca3af", textAlign: "center", padding: "24px 0", fontSize: "14px" }}>
        No materials uploaded yet.
      </div>
    );
  }

  return (
    <div>
      {materials.map((mat) => (
        <div
          key={mat.id}
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
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#111827" }}>
              📎 {mat.fileName}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
              {formatBytes(mat.fileSizeBytes)} · Downloaded {mat.downloadCount || 0} time{(mat.downloadCount || 0) !== 1 ? 's' : ''} · Uploaded by {mat.uploadedByName} · {formatDate(mat.uploadedAt)}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleDownload(mat)}
              style={btnStyle("#4f46e5")}
            >
              Download
            </button>
            {mat.uploadedById === currentUserId && (
              <button
                onClick={() => handleDelete(mat)}
                style={btnStyle("#ef4444")}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const btnStyle = (bg) => ({
  backgroundColor: bg,
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
});

export default MaterialsList;
