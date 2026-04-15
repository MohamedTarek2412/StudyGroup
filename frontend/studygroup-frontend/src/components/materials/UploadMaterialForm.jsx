import { useState } from "react";

export default function UploadMaterialForm({ onUpload }) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!title) return;
    onUpload({ title });
    setTitle("");
  };

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Material title"
      />
      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
} 
