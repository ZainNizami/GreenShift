import React, { useState, useEffect } from "react";
import Map from "./Map";
import GridPopUp from "./components/GridPopUp";
import "./App.css";

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [popupCoords, setPopupCoords] = useState([0, 0]);
  const [sustainabilityData, setSustainabilityData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/sus")
      .then((res) => res.json())
      .then((json) => setSustainabilityData(json))
      .catch((err) => console.error("Failed to fetch sustainability data", err));
  }, []);

  return (
    <div className="app-container">
      <Map
        onFeatureClick={(data, coords) => {
          console.log("Feature clicked!", data, coords);
          
          setPopupData(data);
          setPopupCoords(coords);
          setShowPopup(true);
        }}
        onBackgroundClick={() => {
          setShowPopup(false);
          setPopupData(null);
        }}
      />

      {showPopup && popupData && (
        <GridPopUp
          data={popupData}
          position={popupCoords}
          onClose={() => {
            setShowPopup(false);
            setPopupData(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
