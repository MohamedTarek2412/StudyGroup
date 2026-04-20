import React, { useMemo } from "react";

const GroupFilters = ({
  subject,
  onChangeSubject,
  subjects = [],
  disabled = false,
  onClear,
}) => {
  const options = useMemo(() => {
    const base = Array.isArray(subjects) ? subjects.filter(Boolean) : [];
    const unique = Array.from(new Set(base.map((s) => String(s).trim()).filter(Boolean)));
    unique.sort((a, b) => a.localeCompare(b));
    return unique;
  }, [subjects]);

  return (
    <div style={styles.wrap}>
      <label style={styles.label}>
        Subject
        <select
          value={subject || ""}
          onChange={(e) => onChangeSubject?.(e.target.value)}
          disabled={disabled}
          style={styles.select}
        >
          <option value="">All</option>
          {options.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => onClear?.()}
        disabled={disabled}
        style={styles.clearBtn}
      >
        Clear
      </button>
    </div>
  );
};

const styles = {
  wrap: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#374151",
    minWidth: "220px",
  },
  select: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "14px",
    background: "#ffffff",
    outline: "none",
  },
  clearBtn: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151",
    whiteSpace: "nowrap",
  },
};

export default GroupFilters;

 
