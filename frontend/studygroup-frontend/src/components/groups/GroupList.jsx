import React, { useMemo } from "react";
import GroupCard from "./GroupCard";

const GroupList = ({ groups, emptyTitle = "No groups found", emptyHint }) => {
  const items = useMemo(() => (Array.isArray(groups) ? groups : []), [groups]);

  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <h3 style={styles.emptyTitle}>{emptyTitle}</h3>
        {emptyHint ? <p style={styles.emptyHint}>{emptyHint}</p> : null}
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {items.map((g) => (
        <GroupCard key={g.id} group={g} />
      ))}
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
  empty: {
    border: "1px dashed #d1d5db",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "28px 18px",
    textAlign: "center",
  },
  emptyTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "800",
    color: "#111827",
  },
  emptyHint: {
    margin: "6px 0 0",
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: 1.6,
  },
};

export default GroupList;

 
