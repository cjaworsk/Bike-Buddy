// useMapRef.ts
import { useRef, useCallback } from "react";
import L from "leaflet";

export const useMapRef = () => {
  const mapRef = useRef<L.Map | null>(null);

  const setMap = useCallback((map: L.Map | null) => {
    mapRef.current = map;
  }, []);

  const flyTo = useCallback((lat: number, lng: number, zoom?: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], zoom || mapRef.current.getZoom(), { animate: true });
    }
  }, []);

  return { mapRef, setMap, flyTo };
};

