import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";


const RoleGuard = ({ children, roles, redirectTo = "/" }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const hasRole = allowedRoles.includes(user?.role);

  if (!hasRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RoleGuard; 
