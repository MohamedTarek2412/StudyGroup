import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import useAuth from "../hooks/useAuth";

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // لو دخل صفحة الـ register وهو أصلاً متسجل، وجهه للـ home
  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div style={styles.page}>
      <RegisterForm />
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

export default RegisterPage; 
