import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import groupService from "../services/groupService";

const DEFAULT_BROWSE_PARAMS = { subject: "", search: "" };

export default function useGroups(options = {}) {
  const { initialBrowseParams = DEFAULT_BROWSE_PARAMS, autoLoad = true } = options;

  const [browseParams, setBrowseParams] = useState(() => ({
    subject: initialBrowseParams?.subject || "",
    search: initialBrowseParams?.search || "",
  }));

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lastRequestId = useRef(0);

  const canLoad = useMemo(() => autoLoad !== false, [autoLoad]);

  const loadGroups = useCallback(
    async (overrideParams) => {
      const requestId = ++lastRequestId.current;
      setLoading(true);
      setError(null);

      try {
        const params = overrideParams || browseParams;
        const data = await groupService.browseGroups(params);
        if (requestId !== lastRequestId.current) return;
        setGroups(Array.isArray(data) ? data : []);
      } catch (err) {
        if (requestId !== lastRequestId.current) return;
        setError(err?.message || "Failed to load groups.");
        setGroups([]);
      } finally {
        if (requestId === lastRequestId.current) setLoading(false);
      }
    },
    [browseParams]
  );

  useEffect(() => {
    if (!canLoad) return;
    loadGroups();
  }, [canLoad, loadGroups]);

  const updateBrowseParams = useCallback((patch) => {
    setBrowseParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetBrowseParams = useCallback(() => {
    setBrowseParams({ ...DEFAULT_BROWSE_PARAMS });
  }, []);

  return {
    groups,
    loading,
    error,
    browseParams,
    setBrowseParams,
    updateBrowseParams,
    resetBrowseParams,
    reload: loadGroups,
  };
}

 
