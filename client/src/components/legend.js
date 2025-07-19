import React from "react";
import "./legend.css";

function Legend() {
  return (
    <div className="legend-container">
      <div>
        <span className="legend-color" style={{ backgroundColor: "#d73027" }}></span>
        Bad (0–40)
      </div>
      <div>
        <span className="legend-color" style={{ backgroundColor: "#fee08b" }}></span>
        Decent (41–70)
      </div>
      <div>
        <span className="legend-color" style={{ backgroundColor: "#1a9850" }}></span>
        Good (71–100)
      </div>
      <div className="legend-description">
        Risk scores indicate the probability of sustainability degradation based on ML predictions.
      </div>
    </div>
  );
}

export default Legend;
