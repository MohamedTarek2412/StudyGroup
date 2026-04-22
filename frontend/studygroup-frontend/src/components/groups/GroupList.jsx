import React, { useMemo } from "react";
import GroupCard from "./GroupCard";

const GroupList = ({ groups, emptyTitle = "No groups found", emptyHint }) => {
  const items = useMemo(() => (Array.isArray(groups) ? groups : []), [groups]);

  if (items.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "40px 24px", border: "1px dashed var(--border-color)" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "var(--text-main)" }}>{emptyTitle}</h3>
        {emptyHint && <p style={{ margin: "8px 0 0", fontSize: "14px", color: "var(--text-muted)" }}>{emptyHint}</p>}
      </div>
    );
  }

  return (
    <div className="grid-cols-2">
      {items.map((g) => (
        <GroupCard key={g.id} group={g} />
      ))}
    </div>
  );
};

export default GroupList;
