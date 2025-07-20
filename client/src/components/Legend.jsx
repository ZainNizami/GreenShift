import React, { useState } from 'react';
import './legend.css';

const Legend = () => {
  const [open, setOpen] = useState(true);

  // Define dynamic sizing relative to viewport width (vw)
  const boxSize = '2.4vw'; // Adjust this to scale
  const minSize = '18px';  // Fallback minimum size
  const boxStyle = {
    width: `max(${boxSize}, ${minSize})`,
    height: `max(${boxSize}, ${minSize})`,
  };

  return (
    <div className={`custom-legend ${open ? 'open' : 'closed'}`}>
      {open ? (
        <div className="legend-card">
          <div className="legend-header" onClick={() => setOpen(false)}>
            LEGEND <span className="legend-arrow">▲</span>
          </div>

          <div className="legend-row">
            <span className="legend-color red" style={boxStyle} />
            <span className="legend-label">
              Hi Risk<br /><small>(0% - 40%)</small>
            </span>
          </div>
          <div className="legend-row">
            <span className="legend-color yellow" style={boxStyle} />
            <span className="legend-label">
              Medium Risk<br /><small>(41% - 70%)</small>
            </span>
          </div>
          <div className="legend-row">
            <span className="legend-color green" style={boxStyle} />
            <span className="legend-label">
              Low Risk<br /><small>(71% - 100%)</small>
            </span>
          </div>

          <hr className="legend-divider" />
          <div className="legend-footer">
            <em>
              Risks in gentrification of each<br />
              neighborhood in Toronto<br />
              calculated using AI Agents
            </em>
          </div>
        </div>
      ) : (
        <button type="button" className="legend-toggle" onClick={() => setOpen(true)}>
          LEGEND <span className="legend-arrow">▼</span>
        </button>
      )}
    </div>
  );
};

export default Legend;
