import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // لو دخل صفحة الـ login وهو أصلاً متسجل، وجهه للـ home
  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div style={styles.page}>
      <LoginForm />
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
    padding: "24px 16px",
  },
};

export default LoginPage; 
