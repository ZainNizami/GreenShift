import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./GridPopUp.css";

const GridPopUp = ({ data, position, onClose }) => {
  const popupRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!popupRef.current || !position) return;

    // Initial position offset from cursor click
    setCoords({ x: position.x + 12, y: position.y + 12 });
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      setCoords({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startDrag = (e) => {
    if (!popupRef.current) return;
    isDragging.current = true;
    const rect = popupRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  if (!data) return null;

  return ReactDOM.createPortal(
    <div
      ref={popupRef}
      className="custom-popup"
      style={{
        position: "fixed",
        left: coords.x,
        top: coords.y,
        zIndex: 1000,
        cursor: isDragging.current ? "grabbing" : "default",
      }}
    >
      <div className="popup-header" onMouseDown={startDrag}>
        <span className="popup-title">{data.neighbourhood}</span>
        <button type="button" className="popup-close" onClick={onClose}>×</button>
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
