import React, { useState } from "react";
import Map from "./Map";
import GridPopUp from "./components/GridPopUp";
import "./App.css";

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [popupCoords, setPopupCoords] = useState([0, 0]);

  return (
    <div className="app-container">
      <Map
        onFeatureClick={(data, coords) => {
          setPopupData(data);
          setPopupCoords(coords);
          setShowPopup(true);
        }}
        onBackgroundClick={() => setShowPopup(false)}
      />
      {showPopup && popupData && (
        <GridPopUp
          data={popupData}
          onClose={() => setShowPopup(false)}
          position={popupCoords}
        />
      )}
    </div>
  );
}

export default App;
