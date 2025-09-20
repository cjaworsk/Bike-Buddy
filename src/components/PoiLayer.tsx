"use client";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import { usePoiFilters } from "@/context/PoiFilterContext";
import { renderPOIMarker } from "@/utils/renderPOIMarker";

export function PoiLayer() {
  const { filteredPois } = usePoiFilters();

  return (
    <MarkerClusterGroup chunkedLoading>
      {filteredPois.map((poi) => (
        <Marker
          key={poi._id?.toString() || poi.osmId.toString()}
          position={[poi.lat, poi.lon]}
          icon={renderPOIMarker(poi)}
        >
          <Popup>{poi.name}</Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}
