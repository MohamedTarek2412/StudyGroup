import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";
import groupService from "../services/groupService";
import joinRequestService from "../services/joinRequestService";
import { MapPin, Clock, Users, BookOpen, MessageSquare } from "lucide-react";

const GroupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [myJoinRequest, setMyJoinRequest] = useState(null);
  const [joinStateLoading, setJoinStateLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const joinInFlightRef = useRef(false);

  const isCreator = user?.role === ROLES.GROUP_CREATOR;
  const isStudent = user?.role === ROLES.STUDENT;

  const isOwner = useMemo(() => {
    if (!group?.ownerId || !user?.id) return false;
    return String(group.ownerId).toLowerCase() === String(user.id).toLowerCase();
  }, [group?.ownerId, user?.id]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupService.getGroupById(id);
      setGroup(data);
    } catch (err) {
      setError(err?.message || "Failed to load group.");
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    load();
  }, [id, load]);

  useEffect(() => {
    if (!isStudent || !user?.id || !group || !id) {
      setMyJoinRequest(null);
      return;
    }

    const loadMyJoin = async () => {
      setJoinStateLoading(true);
      try {
        const mine = await joinRequestService.getMyJoinRequests();
        const forGroup = Array.isArray(mine)
          ? mine.find((r) => String(r.groupId).toLowerCase() === String(id).toLowerCase())
          : null;
        setMyJoinRequest(forGroup || null);
      } catch {
        setMyJoinRequest(null);
      } finally {
        setJoinStateLoading(false);
      }
    };

    void loadMyJoin();
  }, [isStudent, user?.id, group, id]);

  // Load group stats
  useEffect(() => {
    if (!id) return;
    setStatsLoading(true);
    groupService
      .getGroupStats(id)
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, [id]);

  // Load members (only if user is a member or owner)
  useEffect(() => {
    if (!id || !user?.id) {
      setMembers(null);
      return;
    }
    
    const canViewMembers = (isStudent && myJoinRequest?.status === "Approved") || isOwner;
    if (!canViewMembers) {
      setMembers(null);
      return;
    }

    setMembersLoading(true);
    groupService
      .getGroupMembers(id)
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .catch(() => setMembers(null))
      .finally(() => setMembersLoading(false));
  }, [id, user?.id, myJoinRequest?.status, isOwner, isStudent]);

  const joinStatus = myJoinRequest?.status;

  const canOpenWorkspace =
    (isStudent && joinStatus === "Approved") || (Boolean(user) && isOwner);

  const handleJoinRequest = async () => {
    if (joinInFlightRef.current) return;
    joinInFlightRef.current = true;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const created = await joinRequestService.createJoinRequest(id);
      setMyJoinRequest(created || { groupId: id, status: "Pending" });
      setActionSuccess("Join request submitted.");
    } catch (err) {
      setActionError(err?.message || "Failed to submit join request.");
    } finally {
      setActionLoading(false);
      joinInFlightRef.current = false;
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Delete this group? This action cannot be undone.");
    if (!ok) return;

    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await groupService.deleteGroup(id);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setActionError(err?.message || "Failed to delete group.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error) {
    return (
      <div className="container mt-6" style={{ textAlign: "center", padding: "40px 0" }}>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: "var(--text-main)" }}>Group not available</h2>
        <p style={{ margin: "10px 0", color: "var(--text-muted)" }}>{error}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={() => load()} className="btn btn-primary">
            Try again
          </button>
          <Link to="/groups" className="btn btn-secondary">
            Back to groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{group?.name}</h1>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#4f46e5", background: "#eef2ff", borderRadius: "999px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <BookOpen size={14} /> {group?.subject}
            </span>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={14} /> {group?.location || "TBA"} ({group?.meetingType || "Online"})
            </span>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={14} /> {group?.meetingSchedule || "TBA"}
            </span>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }} title="Students approved / max students (owner not counted)">
              <Users size={14} /> {group?.memberCount} / {group?.maxMembers} students
            </span>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Owner: <strong>{group?.ownerName}</strong>
            </span>
            {group?.isApproved === false && (
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#b45309", background: "#fffbeb", borderRadius: "999px", padding: "6px 12px" }}>Pending approval</span>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <Link to="/groups" className="btn btn-secondary">
            Back
          </Link>
          {isCreator && isOwner && (
            <>
              <Link to={`/groups/${id}/edit`} className="btn btn-secondary">
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className="btn btn-danger"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "800", color: "var(--text-main)" }}>Description</h3>
        <p style={{ margin: 0, color: "var(--text-muted)", lineHeight: 1.7, fontSize: "15px", whiteSpace: "pre-line" }}>{group?.description}</p>
      </div>

      {user && canOpenWorkspace && (
        <div
          className="card mb-4"
          style={{ border: "1px solid #c7d2fe", background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)" }}
        >
          <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "800", color: "var(--text-main)" }}>
            Group workspace
          </h3>
          <p style={{ margin: "0 0 16px 0", color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 }}>
            Live discussion, upload and download study materials. You must be signed in.
          </p>
          <Link to={`/groups/${id}/discussion`} className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <MessageSquare size={18} />
            Open discussion &amp; files
          </Link>
        </div>
      )}

      {actionError && (
        <div className="alert alert-error">
          <strong className="alert-title">Action failed</strong>
          <span className="alert-desc">{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="alert" style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46" }}>
          <strong className="alert-title">Success</strong>
          <span className="alert-desc">{actionSuccess}</span>
        </div>
      )}

      {stats && (
        <div className="card mb-4">
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "800", color: "var(--text-main)" }}>Group Statistics</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
            <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#111827" }}>{stats.totalMembers}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>Members</div>
            </div>
            <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#111827" }}>{stats.totalDiscussionMessages}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>Messages</div>
            </div>
            <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#111827" }}>{stats.totalMaterials}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>Materials</div>
            </div>
            <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#111827" }}>{stats.totalMaterialDownloads}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>Downloads</div>
            </div>
          </div>
        </div>
      )}

      {members && members.length > 0 && (
        <div className="card mb-4">
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "800", color: "var(--text-main)" }}>Members ({members.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {members.map((member, idx) => (
              <div key={idx} style={{ padding: "12px", backgroundColor: "#f9fafb", borderRadius: "6px", borderLeft: "3px solid #4f46e5" }}>
                <div style={{ fontWeight: "600", fontSize: "14px", color: "#111827" }}>{member.fullName}</div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                  {member.email} · Joined: {new Date(member.joinedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "800", color: "var(--text-main)" }}>Actions</h3>

        {!user ? (
          <div style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--text-main)" }}>Want to join this group?</strong>{" "}
            Sign in or register as a student, then you can send a join request from this page.
            <div className="mt-4 flex gap-2 flex-wrap">
              <Link to="/login" className="btn btn-primary" state={{ from: { pathname: `/groups/${id}` } }}>
                Sign in
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register as student
              </Link>
            </div>
          </div>
        ) : isStudent ? (
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex-col">
              <div style={{ fontWeight: "800", color: "var(--text-main)", fontSize: "15px" }}>Request to join</div>
              <div style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
                Your request will be reviewed by the group creator.
                {joinStatus === "Pending" && " You already have a pending request for this group."}
                {joinStatus === "Approved" && " You are already a member of this group."}
                {joinStateLoading && " Checking your request status…"}
              </div>
            </div>
            <button
              type="button"
              onClick={handleJoinRequest}
              disabled={
                joinStateLoading ||
                actionLoading ||
                group?.isApproved === false ||
                joinStatus === "Pending" ||
                joinStatus === "Approved"
              }
              className="btn btn-primary"
            >
              {joinStatus === "Pending"
                ? "Request pending"
                : joinStatus === "Approved"
                  ? "Already joined"
                  : "Send request"}
            </button>
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 }}>
            Joining is available for students. If you’re a creator, manage requests from your dashboard.
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetailPage;

 
