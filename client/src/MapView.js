import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./MapView.css";

// 🔑 Step 3: Paste your Mapbox token here
mapboxgl.accessToken = 'pk.eyJ1IjoiemFpbm5pemFtaSIsImEiOiJjbWQ5d29rM28wZDQzMmxwenhnb200dTNoIn0.AGee0VyCn_cEX1o0_41EOw';

const MapView = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [-79.3832, 43.6532], // Toronto
      zoom: 10
    });

    map.on("load", () => {
      const fakeData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              name: "Test Neighborhood",
              score: 0.75
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-79.4, 43.67],
                  [-79.36, 43.67],
                  [-79.36, 43.64],
                  [-79.4, 43.64],
                  [-79.4, 43.67]
                ]
              ]
            }
          }
        ]
      };

      map.addSource("test-data", {
        type: "geojson",
        data: fakeData
      });

      map.addLayer({
        id: "test-fill",
        type: "fill",
        source: "test-data",
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "score"],
            0, "#00FF00",
            0.5, "#FFFF00",
            1, "#FF0000"
          ],
          "fill-opacity": 0.6
        }
      });

      map.addLayer({
        id: "test-outline",
        type: "line",
        source: "test-data",
        paint: {
          "line-color": "#000",
          "line-width": 2
        }
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className="map-container" />;
};

export default MapView;
