import React, { useMemo } from "react";

const GroupFilters = ({
  subject,
  onChangeSubject,
  location,
  onChangeLocation,
  meetingTime,
  onChangeMeetingTime,
  creatorName,
  onChangeCreatorName,
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
    <div className="flex gap-4 items-center" style={{ flexWrap: "wrap", width: "100%" }}>
      <div className="form-group" style={{ margin: 0, flex: 1, minWidth: "150px" }}>
        <select
          value={subject || ""}
          onChange={(e) => onChangeSubject?.(e.target.value)}
          disabled={disabled}
          className="form-select"
        >
          <option value="">All Subjects</option>
          {options.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group" style={{ margin: 0, flex: 1, minWidth: "150px" }}>
        <input
          placeholder="Filter by Location..."
          value={location || ""}
          onChange={(e) => onChangeLocation?.(e.target.value)}
          disabled={disabled}
          className="form-input"
        />
      </div>

      <div className="form-group" style={{ margin: 0, flex: 1, minWidth: "150px" }}>
        <input
          placeholder="Filter by Time..."
          value={meetingTime || ""}
          onChange={(e) => onChangeMeetingTime?.(e.target.value)}
          disabled={disabled}
          className="form-input"
        />
      </div>

      <div className="form-group" style={{ margin: 0, flex: 1, minWidth: "150px" }}>
        <input
          placeholder="Filter by Creator..."
          value={creatorName || ""}
          onChange={(e) => onChangeCreatorName?.(e.target.value)}
          disabled={disabled}
          className="form-input"
        />
      </div>

      <button
        type="button"
        onClick={() => onClear?.()}
        disabled={disabled}
        className="btn btn-secondary"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default GroupFilters;
 
