import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import groupService from "../services/groupService";

const DEFAULT_BROWSE_PARAMS = { subject: "", search: "", location: "", meetingTime: "" };
const DEFAULT_DEBOUNCE_MS = 400;

export default function useGroups(options = {}) {
  const {
    initialBrowseParams = DEFAULT_BROWSE_PARAMS,
    autoLoad = true,
    debounceMs = DEFAULT_DEBOUNCE_MS,
  } = options;

  const [browseParams, setBrowseParams] = useState(() => ({
    subject: initialBrowseParams?.subject || "",
    search: initialBrowseParams?.search || "",
    location: initialBrowseParams?.location || "",
    meetingTime: initialBrowseParams?.meetingTime || "",
  }));

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lastRequestId = useRef(0);
  const lastLoadedKey = useRef("");

  const canLoad = useMemo(() => autoLoad !== false, [autoLoad]);

  const makeKey = useCallback((params) => {
    const p = params || {};
    // stable key so we can dedupe identical requests
    return JSON.stringify({
      subject: p.subject || "",
      search: p.search || "",
      location: p.location || "",
      meetingTime: p.meetingTime || "",
    });
  }, []);

  const loadGroups = useCallback(async (overrideParams) => {
      const requestId = ++lastRequestId.current;
      setLoading(true);
      setError(null);

      try {
        const params = overrideParams || browseParams;
        lastLoadedKey.current = makeKey(params);
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
    }, [browseParams, makeKey]);

  useEffect(() => {
    if (!canLoad) return;
    const key = makeKey(browseParams);
    if (key === lastLoadedKey.current) return;

    const t = setTimeout(() => {
      loadGroups(browseParams);
    }, debounceMs);

    return () => clearTimeout(t);
  }, [canLoad, browseParams, loadGroups, makeKey, debounceMs]);

  const updateBrowseParams = useCallback((patch) => {
    setBrowseParams((prev) => {
      const next = { ...prev, ...patch };
      // avoid re-render + re-fetch if nothing changed
      if (makeKey(prev) === makeKey(next)) return prev;
      return next;
    });
  }, [makeKey]);

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

 
