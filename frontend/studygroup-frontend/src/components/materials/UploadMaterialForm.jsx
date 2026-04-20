import React, { useRef, useState } from "react";
import { uploadMaterial } from "../../services/materialService";

const UploadMaterialForm = ({ groupId, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.size > 50 * 1024 * 1024) {
      setError("File must be smaller than 50MB.");
      setFile(null);
      return;
    }
    setFile(selected || null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadMaterial(groupId, file);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      onUploaded && onUploaded(result);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px", marginBottom: "16px" }}>
      <div style={{ fontWeight: 600, marginBottom: "10px", fontSize: "14px" }}>Upload Material</div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          style={{ fontSize: "13px" }}
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{
            backgroundColor: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: !file || uploading ? "not-allowed" : "pointer",
            opacity: !file || uploading ? 0.6 : 1,
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
      {error && <div style={{ color: "#ef4444", marginTop: "8px", fontSize: "13px" }}>{error}</div>}
    </div>
  );
};

export default UploadMaterialForm;
