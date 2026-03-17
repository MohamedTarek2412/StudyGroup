import React from "react";

const LoadingSpinner = ({ fullScreen = false, size = 40, color = "#4f46e5" }) => {
  const spinner = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <circle
          cx="25" cy="25" r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray="80"
          strokeDashoffset="60"
          strokeLinecap="round"
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </svg>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,255,255,0.7)", zIndex: 9999,
      }}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner; 
