import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

interface Props {
  onUpdate: (params: {
    south: number;
    west: number;
    north: number;
    east: number;
  }) => void;
}

export default function MapBoundsFetcher({ onUpdate }: Props) {
  const map = useMap();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastBoundsRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchBounds = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const bounds = map.getBounds();
        const newBounds = JSON.stringify({
          south: bounds.getSouth(),
          west: bounds.getWest(),
          north: bounds.getNorth(),
          east: bounds.getEast(),
        });

        // Prevent redundant calls
        if (lastBoundsRef.current !== newBounds) {
          lastBoundsRef.current = newBounds;
          onUpdate(JSON.parse(newBounds));
        }
      }, 300);
    };

    map.on("moveend", fetchBounds);

    // initial load
    fetchBounds();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      map.off("moveend", fetchBounds);
    };
  }, [map, onUpdate]);

  return null;
}

