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
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["grid-layer"],
      });

      if (features.length > 0) {
        const clickedFeature = features[0];
        const { lng, lat } = e.lngLat;

        onFeatureClick(
          {
            cellId: clickedFeature.properties?.cellId || 3993,
            totalComplaints: 1.3,
            blightComplaints: 0.2,
            recentBlightComplaints: 0.5,
            trend: "Increasing",
            commonBlight: "Litter / Sidewalk & Blvd / Pick Up Request",
            riskLevel: "Very Low",
            riskPercent: 0.9,
          },
          [lng, lat]
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
