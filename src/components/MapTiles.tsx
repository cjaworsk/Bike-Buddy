// src/components/MapTiles.tsx
import { TileLayer } from "react-leaflet";

type MapTilesProps = {
  provider?: "osm" | "mapbox";
};

export default function MapTiles({ provider = "osm" }: MapTilesProps) {
  if (provider === "mapbox") {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
    return (
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
        attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      />
    );
  }

  // Default = OSM
  return (
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    />
  );
}

