import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const GroupCard = ({ group }) => {
  const badge = useMemo(() => {
    if (group?.isApproved === true) return { label: "Approved", color: "#059669", bg: "#ecfdf5" };
    if (group?.isApproved === false) return { label: "Pending approval", color: "#b45309", bg: "#fffbeb" };
    return null;
  }, [group?.isApproved]);

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div style={styles.titleWrap}>
          <h3 style={styles.title}>{group?.name || "Untitled group"}</h3>
          {badge && (
            <span style={{ ...styles.badge, color: badge.color, background: badge.bg }}>
              {badge.label}
            </span>
          )}
        </div>

        <div style={styles.metaRight}>
          <span style={styles.metaItem}>Max: {Number.isFinite(group?.maxMembers) ? group.maxMembers : "—"}</span>
        </div>
      </div>

      <div style={styles.subjectRow}>
        <span style={styles.subjectPill}>{group?.subject || "Unknown subject"}</span>
      </div>

      <p style={styles.desc}>
        {group?.description ? group.description : "No description provided."}
      </p>

      <div style={styles.bottomRow}>
        <div style={styles.owner}>
          <span style={styles.ownerLabel}>Owner</span>
          <span style={styles.ownerValue}>{group?.ownerName || "—"}</span>
        </div>

        <Link to={`/groups/${group?.id}`} style={styles.btn}>
          View
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "18px 18px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 1px 0 rgba(17,24,39,0.02)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  titleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
  },
  badge: {
    fontSize: "12px",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "999px",
    border: "1px solid rgba(17,24,39,0.06)",
  },
  metaRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#6b7280",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },
  metaItem: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "4px 8px",
    background: "#f9fafb",
  },
  subjectRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  subjectPill: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#4f46e5",
    background: "#eef2ff",
    borderRadius: "999px",
    padding: "6px 10px",
  },
  desc: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: 1.6,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "2px",
  },
  owner: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: 0,
  },
  ownerLabel: {
    fontSize: "11px",
    color: "#9ca3af",
  },
  ownerValue: {
    fontSize: "13px",
    color: "#374151",
    fontWeight: "600",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "240px",
  },
  btn: {
    background: "#4f46e5",
    color: "#ffffff",
    padding: "9px 14px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
};

export default GroupCard;

 
