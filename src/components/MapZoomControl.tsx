// MapZoomControl.tsx
"use client";

import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

interface MapZoomControlProps {
  position?: L.ControlPosition;
}

export default function MapZoomControl({ position = "topright" }: MapZoomControlProps) {
  const map = useMap(); // 👈 only works inside <MapContainer>

  useEffect(() => {
    const zoomControl = L.control.zoom({ position }).addTo(map);

    return () => {
      map.removeControl(zoomControl);
    };
  }, [map, position]);

  return null; // nothing rendered in the DOM
}

