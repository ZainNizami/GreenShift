import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import torontoGrid from "./toronto_clipped_grid.geojson";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function Map({ onFeatureClick, onBackgroundClick }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-79.3832, 43.6532],
      zoom: 10,
    });

    window.mapInstance = map;

    map.on("load", () => {
      map.addSource("torontoGrid", {
        type: "geojson",
        data: torontoGrid,
      });

      map.addLayer({
        id: "grid-layer",
        type: "fill",
        source: "torontoGrid",
        paint: {
          "fill-color": "#0080ff",
          "fill-opacity": 0.3,
        },
      });

      map.addLayer({
        id: "grid-outline",
        type: "line",
        source: "torontoGrid",
        paint: {
          "line-color": "#000",
          "line-width": 0.5,
        },
      });
    });

    map.on("click", (e) => {
      console.log("Map clicked", e.point); 

      const features = map.queryRenderedFeatures(e.point, {
        layers: ["grid-layer"],
      });

      console.log("Features:", features);

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
      <div className="legend-box">
        <h4>Risk Levels</h4>
        <div><span className="legend-color red"></span> 0–40: Bad</div>
        <div><span className="legend-color yellow"></span> 41–70: Decent</div>
        <div><span className="legend-color green"></span> 71–100: Good</div>
      </div>
    </div>
  );
}

export default Map;
