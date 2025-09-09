import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { POI } from "../types/POI";

export function renderPOIMarker(poi: POI) {
  const icon = L.icon({
    iconUrl:
      poi.type === "toilet"
        ? "/toilet.png"
        : poi.type === "drinking_water"
        ? "/water.png"
        : "/coffee.png",
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

  return (
    <Marker
      key={poi._id?.toString() || `${poi.osmId}`}
      position={[poi.lat, poi.lon]}
      icon={icon}
    >
      <Popup>
        <b>{poi.name}</b>
        <br />
        Type: {poi.type}
      </Popup>
    </Marker>
  );
}

