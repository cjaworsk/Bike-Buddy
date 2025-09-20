"use client";
import { useRoute } from "@/context/RouteContext";
import { useLocationContext } from "@/context/LocationContext";
import TypeSelector from "@/components/toolbar/TypeSelector";
import SearchBox from "@/components/toolbar/SearchBox";
import { MapButton } from "@/components/toolbar/MapButton";

export function MapToolbar() {
  const { toggleAdjacentPOIs } = useRoute();
  const { onLocationSelect } = useLocationContext();

  return (
    <div className="map-toolbar">
      {/* Import / Manage route */}
      <MapButton />

      {/* Toggle show adjacent POIs */}
      <button
        onClick={toggleAdjacentPOIs}
        className="import-button">
        Toggle Adjacent POIs
      </button>

      {/* Type filter selector */}
      <TypeSelector />

      {/* Search box */}
      <SearchBox onLocationSelect={onLocationSelect} />
    </div>
  );
}

