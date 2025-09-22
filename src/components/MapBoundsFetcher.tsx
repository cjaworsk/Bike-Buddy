// MapBoundsFetcher.tsx
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { usePoiFilters } from "@/context/PoiFilterContext";

export default function MapBoundsFetcher({ debounceMs = 300 }: { debounceMs?: number }) {
  const map = useMap();
  const { fetchPois } = usePoiFilters();
  const timer = useRef<number | null>(null);
  //const prevBboxRef = useRef<any>(null);

  useEffect(() => {
    const handle = () => {
    if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        const bounds = map.getBounds();
        const bbox = {
            south: bounds.getSouth(),
            west: bounds.getWest(),
            north: bounds.getNorth(),
            east: bounds.getEast(),
        };
        fetchPois(bbox);  // ✅ only pass newBbox now
      }, debounceMs);    
    };

    map.on("moveend", handle);
    map.on("zoomend", handle);
    handle(); // initial fetch

    return () => {
      map.off("moveend", handle);
      map.off("zoomend", handle);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [map, fetchPois, debounceMs]);

  return null;
}

