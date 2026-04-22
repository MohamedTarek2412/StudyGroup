const isBrowser = typeof window !== "undefined";

const DEFAULT_STORAGE = isBrowser ? window.localStorage : null;

// Centralized keys to avoid typos across the app
export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: "studygroup_access_token",
  REFRESH_TOKEN: "studygroup_refresh_token",
};

// Used by long-lived client features (e.g. SignalR) to re-bind when tokens change
export const AUTH_TOKENS_CHANGED_EVENT = "studygroup:auth-tokens-changed";

const safeStorageOp = (operation, fallback = null) => {
  if (!DEFAULT_STORAGE) return fallback;

  try {
    return operation(DEFAULT_STORAGE);
  } catch {
    // Could be disabled storage / quota exceeded / private mode, etc.
    return fallback;
  }
};

export const setTokens = ({ accessToken, refreshToken }) => {
  if (!accessToken && !refreshToken) return;

  safeStorageOp((storage) => {
    if (accessToken) {
      storage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    }
    if (refreshToken) {
      storage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  });

  if (isBrowser) {
    try {
      window.dispatchEvent(new Event(AUTH_TOKENS_CHANGED_EVENT));
    } catch {
      // ignore
    }
  }
};

export const getAccessToken = () =>
  safeStorageOp(
    (storage) => storage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN),
    null
  );

export const getRefreshToken = () =>
  safeStorageOp(
    (storage) => storage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN),
    null
  );

export const clearTokens = () => {
  safeStorageOp((storage) => {
    storage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    storage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
  });

  if (isBrowser) {
    try {
      window.dispatchEvent(new Event(AUTH_TOKENS_CHANGED_EVENT));
    } catch {
      // ignore
    }
  }
};

export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  return Boolean(accessToken);
};

// For tests or advanced scenarios (e.g. using sessionStorage)
export const createAuthStorage = (storage) => {
  const get = (key) => {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  };

  const set = (key, value) => {
    try {
      storage.setItem(key, value);
    } catch {
      // ignore
    }
  };

  const remove = (key) => {
    try {
      storage.removeItem(key);
    } catch {
      // ignore
    }
  };

  return {
    getAccessToken: () => get(TOKEN_STORAGE_KEYS.ACCESS_TOKEN),
    getRefreshToken: () => get(TOKEN_STORAGE_KEYS.REFRESH_TOKEN),
    setTokens: ({ accessToken, refreshToken }) => {
      if (accessToken) set(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) set(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    },
    clearTokens: () => {
      remove(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
      remove(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
    },
  };
};

export default {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isAuthenticated,
  TOKEN_STORAGE_KEYS,
};

 
