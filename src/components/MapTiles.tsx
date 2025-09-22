// src/components/MapTiles.tsx
import { TileLayer } from "react-leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

type MapTilesProps = {
  provider?: "osm" | "mapbox";
};

export default function MapTiles({ provider = "osm" }: MapTilesProps) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.attributionControl.setPosition('topleft');
      
      // Add custom CSS for rotation
      const style = document.createElement('style');
      style.textContent = `
        .leaflet-control-attribution {
          transform: rotate(90deg);
          transform-origin: left top;
          position: absolute !important;
          left: 20px !important;
          top: 50px !important;
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.8) !important;
          padding: 4px 8px !important;
          border-radius: 3px;
        }
      `;
      document.head.appendChild(style);
      
      // Clean up on unmount
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [map]);

  if (provider === "mapbox") {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
    return (
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
        attribution="Mapbox"
      />
    );
  }
  
  // Default = OSM
  return (
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="OpenStreetMap"
    />
  );
}
