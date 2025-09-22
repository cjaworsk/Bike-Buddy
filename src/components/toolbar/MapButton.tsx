"use client";
import { useRef, useState } from "react";
import { useRoute } from "@/context/RouteContext";
import { RouteData } from "@/types/RouteData";

export function MapButton() {
  const { loadRoute, removeRoute, routeData, showRouteDisplay, toggleRouteDisplay } = useRoute();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="flex flex-col gap-1">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".gpx"
        onChange={handleFileChange}
        className="file-input-hidden"
      />
      
      {!routeData ? (
        <button
          onClick={handleImportClick}
          className="import-button"
        >
          Import Route
        </button>
      ) : (
        <>
          <button
            onClick={toggleRouteDisplay}
            className={`import-button ${showRouteDisplay ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            {showRouteDisplay ? 'Hide Route' : 'Show Route'}
          </button>
          <button
            onClick={removeRoute}
            className="bg-red-500 text-white px-2 py-1 rounded shadow text-sm hover:bg-red-600"
          >
            Remove Route
          </button>
        </>
      )}
      
      {/* Error display */}
      {error && (
        <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm flex justify-between items-center">
          {error}
          <button onClick={clearError} className="ml-2 text-red-700 hover:text-red-900">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
