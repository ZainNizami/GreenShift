import React from "react";

const Legend = () => {
  const levels = [
    { color: "#1a9850", label: "80+ (Very High)" },
    { color: "#91cf60", label: "65–79 (High)" },
    { color: "#fee08b", label: "50–64 (Medium)" },
    { color: "#fc8d59", label: "35–49 (Low)" },
    { color: "#d73027", label: "<  (Very Low)" },
    { color: "#cccccc", label: "N/A" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        background: "white",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        zIndex: 1000,
        fontSize: "14px",
      }}
    >
      <strong style={{ display: "block", marginBottom: "6px" }}>Risk of Gentrification</strong>
      {levels.map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: item.color,
              marginRight: 8,
              border: "1px solid #999",
            }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
