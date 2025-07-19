import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./GridPopUp.css";

const GridPopUp = ({ data, position, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    if (!popupRef.current) return;
    const popup = popupRef.current;
    popup.style.left = `${position.x + 12}px`;
    popup.style.top = `${position.y + 12}px`;
  }, [position]);

  if (!data || !position) return null;

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
        <span className="popup-title">{data.neighbourhood}</span>
        <button className="popup-close" onClick={onClose}>×</button>
      </div>

      <div className="score-section">
        <span className="score-label">Sustainability Score</span>
        <div className="score-number">
          {Math.round(data.sustainability_score)}
        </div>
      </div>

      <div className="popup-breakdown">
        <h4>Breakdown</h4>
        <ul>
          <li>Green Score = {data.breakdown?.green_score ?? "N/A"}</li>
          <li>Affordability Score = {data.breakdown?.affordability_score ?? "N/A"}</li>
          <li>Permit Score = {data.breakdown?.permit_score ?? "N/A"}</li>
          <li>Completeness Score = {data.breakdown?.completeness_score ?? "N/A"}</li>
        </ul>
      </div>
    </div>,
    document.body
  );
};

export default GridPopUp;
