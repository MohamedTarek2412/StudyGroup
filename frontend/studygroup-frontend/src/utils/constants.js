// Application-wide constants

export const ROLES = {
  ADMIN: "Admin",
  GROUP_CREATOR: "GroupCreator",
  STUDENT: "Student",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.STUDENT]: "Student",
  [ROLES.TUTOR]: "Tutor",
  [ROLES.SUPER_ADMIN]: "Super Admin",
};

export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
};

export const AUTH_STATUS = {
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  LOADING: "loading",
};

export const DATE_FORMATS = {
  DEFAULT: "DD/MM/YYYY",
  WITH_TIME: "DD/MM/YYYY HH:mm",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const API_ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
};

export const STORAGE_KEYS = {
  THEME: "studygroup_theme",
  LANGUAGE: "studygroup_language",
};

export default {
  ROLES,
  ROLE_LABELS,
  TOKEN_TYPES,
  AUTH_STATUS,
  DATE_FORMATS,
  PAGINATION,
  API_ERROR_CODES,
  STORAGE_KEYS,
};

 
