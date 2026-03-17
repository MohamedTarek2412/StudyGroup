import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={styles.page}>

      {/* ─── Hero ─────────────────────────────────── */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Learn better, <span style={styles.heroAccent}>together</span>
        </h1>
        <p style={styles.heroSub}>
          Find study groups for your subjects, join discussions, and share
          materials with students who share your goals.
        </p>

        <div style={styles.heroBtns}>
          <Link to="/groups" style={styles.btnPrimary}>
            Browse Groups
          </Link>
          {!isAuthenticated && (
            <Link to="/register" style={styles.btnOutline}>
              Get Started
            </Link>
          )}
          {isAuthenticated && user?.role === ROLES.GROUP_CREATOR && (
            <Link to="/groups/create" style={styles.btnOutline}>
              Create a Group
            </Link>
          )}
        </div>
      </section>

      {/* ─── Features ─────────────────────────────── */}
      <section style={styles.features}>
        {FEATURES.map((f) => (
          <div key={f.title} style={styles.card}>
            <div style={styles.cardIcon}>{f.icon}</div>
            <h3 style={styles.cardTitle}>{f.title}</h3>
            <p style={styles.cardDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ─── CTA (guests only) ────────────────────── */}
      {!isAuthenticated && (
        <section style={styles.cta}>
          <h2 style={styles.ctaTitle}>Ready to start learning?</h2>
          <p style={styles.ctaSub}>
            Join thousands of students already using StudyGroup.
          </p>
          <Link to="/register" style={styles.btnPrimary}>
            Create a free account
          </Link>
        </section>
      )}

    </div>
  );
};

const FEATURES = [
  {
    icon: "📚",
    title: "Find your subject",
    desc: "Search groups by subject, location, or meeting time.",
  },
  {
    icon: "💬",
    title: "Real-time discussions",
    desc: "Chat with group members instantly using live messaging.",
  },
  {
    icon: "📁",
    title: "Share materials",
    desc: "Upload and access study files shared by group members.",
  },
];

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "64px",
    paddingBottom: "48px",
  },
  hero: {
    textAlign: "center",
    padding: "64px 16px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#111827",
    margin: 0,
    lineHeight: 1.2,
  },
  heroAccent: {
    color: "#4f46e5",
  },
  heroSub: {
    fontSize: "17px",
    color: "#6b7280",
    maxWidth: "520px",
    lineHeight: 1.6,
    margin: 0,
  },
  heroBtns: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  btnPrimary: {
    background: "#4f46e5",
    color: "#ffffff",
    padding: "12px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
  },
  btnOutline: {
    background: "#ffffff",
    color: "#4f46e5",
    padding: "12px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    border: "1px solid #4f46e5",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  cardIcon: {
    fontSize: "28px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },
  cardDesc: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.6,
  },
  cta: {
    background: "#eef2ff",
    borderRadius: "16px",
    padding: "48px 32px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  ctaTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
    color: "#111827",
  },
  ctaSub: {
    margin: 0,
    fontSize: "15px",
    color: "#6b7280",
  },
};

export default HomePage; 
