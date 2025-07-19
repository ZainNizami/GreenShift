import React, { useRef, useEffect } from "react";
import "./GridPopUp.css";

const GridPopUp = ({ data, position, onClose }) => {
  const popupRef = useRef(null); // ✅ always called

  useEffect(() => {
    const popup = popupRef.current;
    if (!popup) return;

    const onMouseDown = (e) => {
      if (!e.target.classList.contains("popup-header")) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = popup.offsetLeft;
      const startTop = popup.offsetTop;

      const onMouseMove = (e) => {
        popup.style.left = `${startLeft + e.clientX - startX}px`;
        popup.style.top = `${startTop + e.clientY - startY}px`;
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    popup.addEventListener("mousedown", onMouseDown);
    return () => popup.removeEventListener("mousedown", onMouseDown);
  }, []);

  // ✅ Safe to conditionally return JSX after hooks
  if (!data || !position) return null;

  return (
    <div
      ref={popupRef}
      className="popup-container"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 1000,
        backgroundColor: "white",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
      }}
    >
      <div className="popup-header">
        <strong>{data.riskLevel} Risk</strong>
        <span className="popup-percent">{(data.riskPercent * 100).toFixed(1)}%</span>
        <button className="popup-close" onClick={onClose}>×</button>
      </div>
      <div className="popup-content">
        <p><strong>Cell ID:</strong> {data.cellId}</p>
        <p><strong>Total Complaints:</strong> {data.totalComplaints}</p>
        <p><strong>Blight Complaints:</strong> {data.blightComplaints}</p>
        <p><strong>Recent Complaints:</strong> {data.recentBlightComplaints}</p>
        <p><strong>Trend:</strong> {data.trend}</p>
        <p><strong>Common Blight:</strong> {data.commonBlight}</p>
      </div>
    </div>
  );
};

export default GridPopUp;
