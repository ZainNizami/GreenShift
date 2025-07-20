import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import GridPopUp from "./components/GridPopUp";
import Legend from "./components/Legend";

mapboxgl.accessToken =
  "pk.eyJ1IjoiemFpbm5pemFtaSIsImEiOiJjbWQ5d29rM28wZDQzMmxwenhnb200dTNoIn0.AGee0VyCn_cEX1o0_41EOw";

export default function MapComponent() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [neighbourhoodData, setNeighbourhoodData] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const [geojson, setGeojson] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/sus")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Sustainability API data loaded:", data);
        setNeighbourhoodData(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/toronto_clipped_grid.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ GeoJSON loaded");

        // Inject CLEAN_NAME into each feature
        data.features.forEach((feature) => {
          const raw = feature.properties?.AREA_NAME || "";
          const cleaned = raw.split(" (")[0].trim().toLowerCase();
          feature.properties.CLEAN_NAME = cleaned;
        });

        setGeojson(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!geojson || !neighbourhoodData || !mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-79.3832, 43.6532],
      zoom: 10,
    });
    mapRef.current = map;

    map.on("load", () => {
      const apiNames = new Set(
        neighbourhoodData.map((d) => d.neighbourhood.trim().toLowerCase())
      );

      // Build match expression using CLEAN_NAME
      const matchExpression = [
        "match",
        ["get", "CLEAN_NAME"],
      ];

      geojson.features.forEach((feature) => {
      const cleanName = feature.properties.CLEAN_NAME;

      const match = neighbourhoodData.find(
        (item) => item.neighbourhood.trim().toLowerCase() === cleanName
      );

      const score = match?.sustainability_score;
      let color = "#d2dde0"; // default if not found

      if (typeof score === "number") {
        if (score >= 80) color = "#1a9850";
        else if (score >= 65) color = "#91cf60";
        else if (score >= 50) color = "#fee08b";
        else if (score >= 35) color = "#fc8d59";
        else color = "#d73027";
      }

      matchExpression.push(cleanName, color);
    });

      matchExpression.push("#cccccc"); // fallback

      map.addSource("toronto", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "neighbourhoods",
        type: "fill",
        source: "toronto",
        paint: {
          "fill-color": matchExpression,
          "fill-opacity": 0.4,
        },
      });

      map.addLayer({
        id: "neighbourhoods-hover",
        type: "fill",
        source: "toronto",
        paint: {
          "fill-color": "#66ccff",
          "fill-opacity": 0.6,
        },
        filter: ["==", "AREA_NAME", ""],
      });

      map.addLayer({
        id: "neighbourhoods-outline",
        type: "line",
        source: "toronto",
        paint: {
          "line-color": "#000",
          "line-width": 1,
        },
      });

      map.on("mousemove", "neighbourhoods", (e) => {
        const feature = e.features?.[0];
        const name = feature?.properties?.AREA_NAME;
        map.setFilter("neighbourhoods-hover", ["==", "AREA_NAME", name]);
      });

      map.on("mouseleave", "neighbourhoods", () => {
        map.setFilter("neighbourhoods-hover", ["==", "AREA_NAME", ""]);
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "neighbourhoods", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("click", "neighbourhoods", (e) => {
        const feature = e.features[0];
        const rawName = feature.properties?.AREA_NAME || "";
        const cleanedName = feature.properties?.CLEAN_NAME || "";

        const match = neighbourhoodData.find(
          (item) => item.neighbourhood?.trim().toLowerCase() === cleanedName
        );

        setPopupData(
          match || {
            neighbourhood: rawName,
            sustainability_score: "N/A",
            breakdown: {
              green_score: "N/A",
              affordability_score: "N/A",
              permit_score: "N/A",
              completeness_score: "N/A",
            },
          }
        );

        setPopupPosition({
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY,
        });
      });
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");
  }, [geojson, neighbourhoodData]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      {popupData && popupPosition && (
        <GridPopUp
        data={popupData}
        position={popupPosition}
        onClose={() => setPopupData(null)}
        />
      )}
      <Legend />
    </div>
  );
}
