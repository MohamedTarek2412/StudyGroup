import React, { useMemo } from "react";
import useGroups from "../hooks/useGroups";
import LoadingSpinner from "../components/common/LoadingSpinner";
import GroupList from "../components/groups/GroupList";
import GroupSearchBar from "../components/groups/GroupSearchBar";
import GroupFilters from "../components/groups/GroupFilters";

const BrowseGroupsPage = () => {
  const { groups, loading, error, browseParams, updateBrowseParams, resetBrowseParams, reload } =
    useGroups({ autoLoad: true, initialBrowseParams: { subject: "", search: "" } });

  const subjects = useMemo(() => {
    const list = Array.isArray(groups) ? groups.map((g) => g?.subject).filter(Boolean) : [];
    return Array.from(new Set(list));
  }, [groups]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Browse Groups</h1>
          <p style={styles.subTitle}>
            Find approved study groups by subject or keywords.
          </p>
        </div>
      </div>

      <div style={styles.toolbar}>
        <GroupSearchBar
          value={browseParams.search}
          onChange={(val) => updateBrowseParams({ search: val })}
          onSubmit={() => reload()}
          disabled={loading}
        />

        <GroupFilters
          subject={browseParams.subject}
          onChangeSubject={(val) => updateBrowseParams({ subject: val })}
          subjects={subjects}
          disabled={loading}
          onClear={() => {
            resetBrowseParams();
          }}
        />
      </div>

      <div style={styles.actionsRow}>
        <button
          type="button"
          onClick={() => reload()}
          disabled={loading}
          style={styles.secondaryBtn}
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div style={styles.errorBox}>
          <div style={styles.errorTitle}>Couldn’t load groups</div>
          <div style={styles.errorMsg}>{error}</div>
          <button type="button" onClick={() => reload()} style={styles.primaryBtn}>
            Try again
          </button>
        </div>
      ) : null}

      {loading ? (
        <div style={styles.loadingWrap}>
          <LoadingSpinner />
        </div>
      ) : (
        <GroupList
          groups={groups}
          emptyTitle="No groups match your filters"
          emptyHint="Try clearing filters or searching for a different keyword."
        />
      )}
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "16px",
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "800",
    color: "#111827",
  },
  subTitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.6,
  },
  toolbar: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "14px",
  },
  actionsRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  loadingWrap: {
    padding: "20px 0",
    display: "flex",
    justifyContent: "center",
  },
  errorBox: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  errorTitle: {
    fontWeight: "800",
    color: "#9f1239",
  },
  errorMsg: {
    color: "#9f1239",
    fontSize: "13px",
    lineHeight: 1.6,
  },
  primaryBtn: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
    width: "fit-content",
  },
  secondaryBtn: {
    background: "#ffffff",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
  },
};

export default BrowseGroupsPage;

 
