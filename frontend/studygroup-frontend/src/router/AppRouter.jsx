import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";

import ProtectedRoute from "../components/common/ProtectedRoute";
import RoleGuard from "../components/common/RoleGuard";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import { ROLES } from "../utils/constants";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import BrowseGroupsPage from "../pages/BrowseGroupsPage";
import GroupDetailPage from "../pages/GroupDetailPage";
import GroupDiscussionPage from "../pages/GroupDiscussionPage";
import CreatorDashboardPage from "../pages/CreatorDashboardPage";
import CreateGroupPage from "../pages/CreateGroupPage";
import EditGroupPage from "../pages/EditGroupPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>

          <div style={styles.layout}>
            <Navbar />

            <main style={styles.main}>
              <Routes>

                {/* ─── Public routes ──────────────────────────── */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* ─── Student routes (login required) ────────── */}
                <Route
                  path="/groups"
                  element={
                    <ProtectedRoute>
                      <BrowseGroupsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/groups/:id"
                  element={
                    <ProtectedRoute>
                      <GroupDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/groups/:id/discussion"
                  element={
                    <ProtectedRoute>
                      <GroupDiscussionPage />
                    </ProtectedRoute>
                  }
                />

                {/* ─── Group Creator routes ────────────────────── */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleGuard roles={ROLES.GROUP_CREATOR}>
                        <CreatorDashboardPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/groups/create"
                  element={
                    <ProtectedRoute>
                      <RoleGuard roles={ROLES.GROUP_CREATOR}>
                        <CreateGroupPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/groups/:id/edit"
                  element={
                    <ProtectedRoute>
                      <RoleGuard roles={ROLES.GROUP_CREATOR}>
                        <EditGroupPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                {/* ─── Admin routes ────────────────────────────── */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <RoleGuard roles={ROLES.ADMIN}>
                        <AdminDashboardPage />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                {/* ─── 404 ─────────────────────────────────────── */}
                <Route path="*" element={<NotFoundPage />} />

              </Routes>
            </main>

            <Footer />
          </div>

        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

const styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    flex: 1,
    maxWidth: "1100px",
    width: "100%",
    margin: "0 auto",
    padding: "24px 16px",
  },
};

export default AppRouter; 
