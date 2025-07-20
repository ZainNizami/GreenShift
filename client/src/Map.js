import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import './components/legend.css';
import Legend from './components/Legend.jsx';
import torontoGridRaw from "./toronto_clipped_grid.geojson";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function Map({ onFeatureClick, onBackgroundClick }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-79.35, 43.7],
      zoom: 11.5,
      pitch: 0,
      bearing: 0,
    });

    window.mapInstance = map;

    // ✅ Safely assign IDs if features exist
    const torontoGrid =
      torontoGridRaw && torontoGridRaw.features
        ? {
            ...torontoGridRaw,
            features: torontoGridRaw.features.map((f, idx) => ({
              ...f,
              id: idx,
            })),
          }
        : torontoGridRaw;

    console.log("Loaded features:", torontoGrid?.features?.length ?? "No features");

    map.on("load", () => {
      // Add source
      map.addSource("torontoGrid", {
        type: "geojson",
        data: torontoGrid,
      });

      // Grid fill layer with hover effect
      map.addLayer({
        id: "grid-layer",
        type: "fill",
        source: "torontoGrid",
        paint: {
          "fill-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#0059b3",
            "#0080ff",
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.6,
            0.3,
          ],
        },
      });

      // Grid outline layer
      map.addLayer({
        id: "grid-outline",
        type: "line",
        source: "torontoGrid",
        paint: {
          "line-color": "#000",
          "line-width": 0.5,
        },
      });

      // ✅ Hover interaction
      let hoveredId = null;

      map.on("mousemove", "grid-layer", (e) => {
        if (e.features.length > 0) {
          if (hoveredId !== null) {
            map.setFeatureState(
              { source: "torontoGrid", id: hoveredId },
              { hover: false }
            );
          }

          hoveredId = e.features[0].id;
          map.setFeatureState(
            { source: "torontoGrid", id: hoveredId },
            { hover: true }
          );
        }
      });

      map.on("mouseleave", "grid-layer", () => {
        if (hoveredId !== null) {
          map.setFeatureState(
            { source: "torontoGrid", id: hoveredId },
            { hover: false }
          );
        }
        hoveredId = null;
      });
    });

    // ✅ Click interaction
    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["grid-layer"],
      });

      if (features.length > 0) {
        const clickedFeature = features[0];
        const { x, y } = e.point;

        onFeatureClick(
          {
            neighbourhood: clickedFeature.properties?.neighbourhood || "Unknown",
            sustainability_score: clickedFeature.properties?.sustainability_score ?? 0,
            risk_level: clickedFeature.properties?.risk_level || "Unknown",
            breakdown: clickedFeature.properties?.breakdown ?? {},
          },
          { x, y }
        );
      } else {
        onBackgroundClick();
      }
    });

    return () => map.remove();
  }, [onFeatureClick, onBackgroundClick]);

  return (
    <div className="map-placeholder" ref={mapContainerRef}>
      <Legend />
    </div>
  );

}

export default Map;

//commit
