"use client";
import { useRoute } from "@/context/RouteContext";

export function MapButton() {
  const { loadRoute, removeRoute, routeData } = useRoute();

  const handleImport = () => {
    // TODO: Replace with real import logic
  const dummyRoute = {
     id: "demo",
     coordinates: [
        [37.7749, -122.4194] as [number, number],
        [37.7849, -122.4094] as [number, number],
     ],
    };
    loadRoute(dummyRoute);
  };

  return (
    <div className="flex flex-col gap-1">
      {!routeData ? (
        <button
          onClick={handleImport}
          className="bg-white px-2 py-1 rounded shadow text-sm"
        >
          Import Route
        </button>
      ) : (
        <button
          onClick={removeRoute}
          className="bg-red-500 text-white px-2 py-1 rounded shadow text-sm"
        >
          Remove Route
        </button>
      )}
    </div>
  );
}

