"use client";
import { useLocationContext } from "@/context/LocationContext";
import { usePoiFilters } from "@/context/PoiFilterContext";
import TypeSelector from "@/components/toolbar/TypeSelector";
import SearchBox from "@/components/toolbar/SearchBox";
import { MapButton } from "@/components/toolbar/MapButton";

export function MapToolbar() {
  const { onLocationSelect } = useLocationContext();
  const { toggleAdjacentPOIs, showAdjacentPOIs } = usePoiFilters();

  return (
    <div className="map-toolbar">
      {/* Import / Manage route */}
      <MapButton />

      {/* Toggle show adjacent POIs */}
      <button
        onClick={toggleAdjacentPOIs}
        className={`import-button ${showAdjacentPOIs ? 'bg-green-500 text-white' : 'bg-white'}`}
      >
        {showAdjacentPOIs ? 'Show All POIs' : 'Show Route POIs'}
      </button>

      {/* Type filter selector */}
      <TypeSelector />

      {/* Search box */}
      <SearchBox onLocationSelect={onLocationSelect} />
    </div>
  );
}
