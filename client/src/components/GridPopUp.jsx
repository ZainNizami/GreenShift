import React, { useRef, useEffect } from "react";
import "./GridPopUp.css";

const GridPopUp = ({ data, onClose, wasDraggingRef }) => {
  const popupRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    const popup = popupRef.current;
    const dragBar = dragRef.current;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e) => {
      e.stopPropagation();
      isDragging = true;
      offsetX = e.clientX - popup.getBoundingClientRect().left;
      offsetY = e.clientY - popup.getBoundingClientRect().top;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      popup.style.left = `${e.clientX - offsetX}px`;
      popup.style.top = `${e.clientY - offsetY}px`;
      popup.style.right = "auto";
      popup.style.bottom = "auto";
    };

    const onMouseUp = () => {
      if (wasDraggingRef?.current !== undefined) {
        wasDraggingRef.current = true;
      }
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    dragBar.addEventListener("mousedown", onMouseDown);
    return () => dragBar.removeEventListener("mousedown", onMouseDown);
  }, [wasDraggingRef]);

  return (
    <div ref={popupRef} className="popup-box" style={{ position: "absolute" }}>
      <div ref={dragRef} className="popup-header draggable">
        <span className="popup-title">{data.riskLevel} Risk</span>
        <div className="popup-score">{data.riskPercent.toFixed(1)}%</div>
        <button className="popup-close" onClick={onClose}>×</button>
      </div>
      <div className="popup-body">
        <div><strong>Cell ID:</strong> {data.cellId}</div>
        <div><strong>Total Complaints (avg):</strong> {data.totalComplaints}</div>
        <div><strong>Blight Complaints (avg):</strong> {data.blightComplaints}</div>
        <div><strong>Recent Blight Complaints:</strong> {data.recentBlightComplaints}</div>
        <div><strong>Trend:</strong> {data.trend}</div>
        <div><strong>Most Common Blight:</strong> {data.commonBlight}</div>
      </div>
    </div>
  );
};

export default GridPopUp;
