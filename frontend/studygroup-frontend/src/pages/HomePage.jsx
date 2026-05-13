import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";
import { Users, MessageSquare, FileText, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import "../assets/styles/home.css";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero__content">
          <div className="home-hero__badge">
            <Sparkles size={14} aria-hidden />
            <span>Study groups, discussions &amp; files</span>
          </div>
          <h1 className="home-hero__title" id="home-hero-title">
            Learn better, <span className="home-hero__gradient">together</span>
          </h1>
          <p className="home-hero__sub">
            Find study groups for your subjects, join discussions, and share materials with students who share your goals.
          </p>
          <div className="home-hero__stats" aria-label="Highlights">
            <div className="home-hero__stat">
              <span className="home-hero__stat-num">10K+</span>
              <span className="home-hero__stat-label">Students</span>
            </div>
            <div className="home-hero__stat-div" aria-hidden />
            <div className="home-hero__stat">
              <span className="home-hero__stat-num">500+</span>
              <span className="home-hero__stat-label">Groups</span>
            </div>
            <div className="home-hero__stat-div" aria-hidden />
            <div className="home-hero__stat">
              <span className="home-hero__stat-num">98%</span>
              <span className="home-hero__stat-label">Satisfaction</span>
            </div>
          </div>
          <div className="home-hero__btns">
            <Link to="/groups" className="home-hero__btn--primary">
              Browse groups <ArrowRight size={18} aria-hidden />
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="home-hero__btn--ghost">
                Get started
              </Link>
            )}
            {isAuthenticated && user?.role === ROLES.GROUP_CREATOR && (
              <Link to="/groups/create" className="home-hero__btn--ghost">
                Create a group
              </Link>
            )}
          </div>
        </div>
        <div className="home-hero__illustration" aria-hidden>
          <div className="home-hero__illustration-card">
            <div className="home-hero__illustration-icon">👥</div>
            <p className="home-hero__illustration-text">Join the conversation</p>
          </div>
        </div>
      </section>

      <section className="home-features" aria-labelledby="features-title">
        <div className="home-features__header">
          <span className="home-features__badge">Why StudyGroup</span>
          <h2 className="home-features__title" id="features-title">
            Everything you need to succeed
          </h2>
          <p className="home-features__desc">Tools built for real study sessions — find a group, stay in touch, and keep files organized.</p>
        </div>
        <div className="home-features__grid">
          {FEATURES.map((f, index) => (
            <div key={f.title} className="home-feature-card" style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="home-feature-card__icon">{f.icon}</div>
              <h3 className="home-feature-card__title">{f.title}</h3>
              <p className="home-feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {!isAuthenticated && (
        <section className="home-cta" aria-label="Call to action">
          <div className="home-cta__inner">
            <h2 className="home-cta__title">Ready to start learning?</h2>
            <p className="home-cta__sub">Create a free account and join a group in minutes.</p>
            <Link to="/register" className="home-cta__btn">
              Create a free account <TrendingUp size={18} aria-hidden />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

const FEATURES = [
  {
    icon: <Users size={28} strokeWidth={1.5} />,
    title: "Find your subject",
    desc: "Search groups by subject, location, or meeting time with clear filters.",
  },
  {
    icon: <MessageSquare size={28} strokeWidth={1.5} />,
    title: "Real-time discussions",
    desc: "Chat with group members in the workspace with live messaging.",
  },
  {
    icon: <FileText size={28} strokeWidth={1.5} />,
    title: "Share materials",
    desc: "Upload and download study files in one place for your group.",
  },
];

export default HomePage;
