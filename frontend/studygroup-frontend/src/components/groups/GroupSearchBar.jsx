import React, { useEffect, useMemo, useState } from "react";

const GroupSearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search groups by name or description...",
  debounceMs = 350,
  disabled = false,
}) => {
  const [text, setText] = useState(value || "");

  useEffect(() => {
    setText(value || "");
  }, [value]);

  const canDebounce = useMemo(() => typeof onChange === "function", [onChange]);

  useEffect(() => {
    if (!canDebounce) return;
    const t = setTimeout(() => onChange(text), debounceMs);
    return () => clearTimeout(t);
  }, [text, debounceMs, canDebounce, onChange]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") onSubmit(text);
      }}
      style={styles.form}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={styles.input}
      />
      <button type="submit" disabled={disabled} style={styles.btn}>
        Search
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "14px",
    outline: "none",
  },
  btn: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
};

export default GroupSearchBar;

 
