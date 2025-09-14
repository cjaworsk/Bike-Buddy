import L from "leaflet";
import { Marker } from "react-leaflet";

interface CurrentLocationMarkerProps {
  lat: number;
  lng: number;
}

// Create a simple blue dot icon without animations
const createCurrentLocationIcon = (size: number = 12): L.DivIcon => {
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: #4285f4;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      "></div>
    `,
    className: 'current-location-marker',
    iconSize: [size + 4, size + 4],
    iconAnchor: [(size + 4) / 2, (size + 4) / 2],
  });
};

const CurrentLocationMarker: React.FC<CurrentLocationMarkerProps> = ({ lat, lng }) => {
  const icon = createCurrentLocationIcon();

  return (
    <Marker
      position={[lat, lng]}
      icon={icon}
      zIndexOffset={1000}
    />
  );
};

export default CurrentLocationMarker;
