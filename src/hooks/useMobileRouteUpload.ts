import { useState } from "react";
import { useRoute } from "@/context/RouteContext";
import { RouteData } from "@/types/RouteData"; // Import the proper type

export function useMobileRouteUpload() {
  const [error, setError] = useState<string | null>(null);
  const { loadRoute } = useRoute();

  const parseGPX = (gpxText: string): { name: string; points: Array<{ lat: number; lon: number }> } => {
    const parser = new DOMParser();
    const gpx = parser.parseFromString(gpxText, "text/xml");

    const routeName =
      gpx.querySelector("trk name")?.textContent ||
      gpx.querySelector("rte name")?.textContent ||
      "Imported Route";

    const points: Array<{ lat: number; lon: number }> = [];

    gpx.querySelectorAll("trkpt, rtept").forEach((point) => {
      const lat = parseFloat(point.getAttribute("lat") || "0");
      const lon = parseFloat(point.getAttribute("lon") || "0");
      if (lat && lon) points.push({ lat, lon });
    });

    return { name: routeName, points };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      if (!file.name.toLowerCase().endsWith(".gpx")) {
        setError("Only GPX files are supported");
        return;
      }

      const parsed = parseGPX(text);
      if (parsed.points.length === 0) {
        setError("No valid GPS points found");
        return;
      }

      // Convert to RouteData format that matches the type
      const routeData: RouteData = {
        id: Date.now().toString(),
        name: parsed.name,
        coordinates: parsed.points.map(p => [p.lat, p.lon] as [number, number])
      };

      loadRoute(routeData);
      e.target.value = "";
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error parsing GPX file");
    }
  };

  const clearError = () => setError(null);

  return { handleFileUpload, error, clearError };
}
