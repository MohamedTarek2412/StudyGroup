import React from "react";

const LoadingSpinner = ({ fullScreen = false, size = 40, color = "#4f46e5" }) => {
  const spinner = (
    <div style={spinnerStyles.container}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={spinnerStyles.svg}
      >
        <circle
          cx="25" cy="25" r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80"
          strokeDashoffset="60"
        />
      </svg>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={spinnerStyles.fullscreen}>
        <div style={spinnerStyles.card}>
          {spinner}
          <p style={spinnerStyles.text}>Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

const spinnerStyles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    animation: "spin 0.8s linear infinite",
  },
  fullscreen: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(4px)",
    zIndex: 9999,
  },
  card: {
    background: "#ffffff",
    padding: "32px 48px",
    borderRadius: "24px",
    boxShadow: "0 20px 35px -10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  text: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
  },
};

// Add global animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default LoadingSpinner;