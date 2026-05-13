import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Users, BookOpen } from "lucide-react";

const GroupCard = ({ group }) => {
  const badge = useMemo(() => {
    if (group?.isApproved === true) return { label: "Approved", color: "#059669", bg: "#ecfdf5" };
    if (group?.isApproved === false) return { label: "Pending", color: "#b45309", bg: "#fffbeb" };
    return null;
  }, [group?.isApproved]);

  return (
    <div className="card card-hover flex-col gap-4">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800" }}>{group?.name || "Untitled group"}</h3>
          {badge && (
            <span style={{ fontSize: "12px", fontWeight: "700", padding: "4px 10px", borderRadius: "999px", background: badge.bg, color: badge.color }}>
              {badge.label}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#4f46e5", background: "#eef2ff", borderRadius: "999px", padding: "4px 10px", display: 'flex', alignItems: 'center', gap: '4px' }}>
          <BookOpen size={14} /> {group?.subject || "Unknown subject"}
        </span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", background: "var(--bg-color)", borderRadius: "999px", padding: "4px 10px", display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={14} /> {group?.location || "TBA"} ({group?.meetingType || "Online"})
        </span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)", background: "var(--bg-color)", borderRadius: "999px", padding: "4px 10px", display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={14} /> {group?.meetingSchedule || "TBA"}
        </span>
      </div>

      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {group?.description ? group.description : "No description provided."}
      </p>

      <div className="flex justify-between items-center mt-4">
        <div className="flex-col">
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>Owner</span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-main)" }}>{group?.ownerName || "—"}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2" style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
            <Users size={16} /> {Number.isFinite(group?.maxMembers) ? `Max: ${group.maxMembers}` : "—"}
          </span>
          <Link to={`/groups/${group?.id}`} className="btn btn-primary">
            View Group
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
 
