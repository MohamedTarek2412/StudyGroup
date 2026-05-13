import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../services/authService";
import userService from "../services/userService";
import {
  getAccessToken,
  clearTokens,
  isAuthenticated as isAuthenticatedFromStorage,
} from "../utils/authStorage";
import { isTokenExpired, decodeJwtPayload } from "../utils/jwtHelpers";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrapAuth = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // لو التوكن منتهي نفضيه ونخرج
    if (isTokenExpired(token)) {
      clearTokens();
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // ممكن نستخدم الـ payload لو فيه بيانات كفاية
      const payload = decodeJwtPayload(token);

      if (payload?.user) {
        setUser(payload.user);
        setLoading(false);
        return;
      }

      // أو نجيب البروفايل من الـ API
      const profile = await userService.getProfile();
      setUser(profile);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const login = useCallback(async (credentials) => {
    const { user: loggedInUser } = await authService.login(credentials);
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      // fallback: لو الـ backend مش بيرجع user، نجيب البروفايل
      const profile = await userService.getProfile();
      setUser(profile);
    }
  }, []);

  const register = useCallback(async (payload) => {
    const { user: registeredUser } = await authService.register(payload);
    if (registeredUser) {
      setUser(registeredUser);
    } else {
      const profile = await userService.getProfile();
      setUser(profile);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const isAuthenticated = useMemo(
    () => Boolean(user) && isAuthenticatedFromStorage(),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshUser: bootstrapAuth,
    }),
    [user, loading, isAuthenticated, login, register, logout, bootstrapAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export default AuthContext;

 
