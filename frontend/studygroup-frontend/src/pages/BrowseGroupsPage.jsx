import React, { useMemo } from "react";
import useGroups from "../hooks/useGroups";
import LoadingSpinner from "../components/common/LoadingSpinner";
import GroupList from "../components/groups/GroupList";
import GroupSearchBar from "../components/groups/GroupSearchBar";
import GroupFilters from "../components/groups/GroupFilters";

const BrowseGroupsPage = () => {
  const { groups, loading, error, browseParams, updateBrowseParams, resetBrowseParams, reload } =
    useGroups({ autoLoad: true, initialBrowseParams: { subject: "", search: "", location: "", meetingTime: "" } });

  const subjects = useMemo(() => {
    const list = Array.isArray(groups) ? groups.map((g) => g?.subject).filter(Boolean) : [];
    return Array.from(new Set(list));
  }, [groups]);

  return (
    <div className="container mt-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Groups</h1>
          <p className="page-subtitle">
            Find approved study groups by subject, location, time, or keywords.
          </p>
        </div>
      </div>

      <div className="card mb-4" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <GroupSearchBar
          value={browseParams.search}
          onChange={(val) => updateBrowseParams({ search: val })}
          onSubmit={() => reload()}
          disabled={loading}
        />

        <GroupFilters
          subject={browseParams.subject}
          onChangeSubject={(val) => updateBrowseParams({ subject: val })}
          location={browseParams.location}
          onChangeLocation={(val) => updateBrowseParams({ location: val })}
          meetingTime={browseParams.meetingTime}
          onChangeMeetingTime={(val) => updateBrowseParams({ meetingTime: val })}
          subjects={subjects}
          disabled={loading}
          onClear={() => {
            resetBrowseParams();
          }}
        />
      </div>

      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => reload()}
          disabled={loading}
          className="btn btn-secondary"
        >
          Refresh Results
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <div className="alert-title">Couldn’t load groups</div>
          <div className="alert-desc">{error}</div>
          <button type="button" onClick={() => reload()} className="btn btn-primary mt-4" style={{width: 'fit-content'}}>
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
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

export default BrowseGroupsPage;
 
