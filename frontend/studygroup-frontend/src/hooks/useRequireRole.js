import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

/**
 * يتحقق إن الـ user عنده الـ role المطلوب
 * لو لأ بيعمل redirect
 *
 * @param {string | string[]} requiredRoles - role واحد أو أكتر
 * @param {string} redirectTo - المسار اللي هيروح عليه لو مش عنده الـ role
 */
const useRequireRole = (requiredRoles, redirectTo = "/") => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // لو لسه بيحمل بيانات الـ user، استنى
    if (loading) return;

    // لو مش متسجل، روح صفحة الـ login
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // normalize: خلي requiredRoles دايماً array
    const roles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];

    // تحقق إن الـ user عنده واحد على الأقل من الـ roles المطلوبة
    const userRole = user?.role;
    const hasRole = roles.includes(userRole);

    if (!hasRole) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, isAuthenticated, user, requiredRoles, redirectTo, navigate]);

  return { user, loading, isAuthenticated };
};

export default useRequireRole; 
