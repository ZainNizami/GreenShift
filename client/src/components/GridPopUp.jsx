// components/GridPopUp.jsx
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./GridPopUp.css"; // Style it as needed

const GridPopUp = ({ data, position, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    if (!popupRef.current) return;
    const popup = popupRef.current;
    popup.style.left = `${position.x + 12}px`;
    popup.style.top = `${position.y + 12}px`;
  }, [position]);

  if (!data || !position) return null;

  const breakdown = data.breakdown || {};

  return ReactDOM.createPortal(
    <div
      ref={popupRef}
      className="custom-popup"
      style={{
        position: "fixed",
        zIndex: 1000,
      }}
    >
      <div className="popup-header">
        <span className="popup-title">{data.neighbourhood || "UNKNOWN"}</span>
        <button onClick={onClose}>×</button>
      </div>
      <div className="popup-body">
        <p><strong>Sustainability Score</strong>: {data.sustainability_score ?? 0}</p>
        <div>
          <strong>Breakdown</strong>
          <ul>
            <li>Green Score = {breakdown.green_score ?? "N/A"}</li>
            <li>Affordability Score = {breakdown.affordability_score ?? "N/A"}</li>
            <li>Permit Score = {breakdown.permit_score ?? "N/A"}</li>
            <li>Completeness Score = {breakdown.completeness_score ?? "N/A"}</li>
          </ul>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GridPopUp;
