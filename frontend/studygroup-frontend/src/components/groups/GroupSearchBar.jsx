import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

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
      className="flex gap-3 items-center w-full"
    >
      <div style={{ position: "relative", flex: 1 }}>
        <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="form-input"
          style={{ paddingLeft: "38px" }}
        />
      </div>
      <button type="submit" disabled={disabled} className="btn btn-primary">
        Search
      </button>
    </form>
  );
};

export default GroupSearchBar;
