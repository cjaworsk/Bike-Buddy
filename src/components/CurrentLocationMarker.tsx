import L from "leaflet";
import { Marker } from "react-leaflet";

interface CurrentLocationMarkerProps {
  lat: number;
  lng: number;
}

// Create a blue dot icon for current location
const createCurrentLocationIcon = (size: number = 16): L.DivIcon => {
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: #4285f4;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          width: ${size + 6}px;
          height: ${size + 6}px;
          background-color: rgba(66, 133, 244, 0.2);
          border-radius: 50%;
          position: absolute;
          top: -3px;
          left: -3px;
          animation: pulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>
    `,
    className: 'current-location-marker',
    iconSize: [size + 12, size + 12], // Account for border and pulse
    iconAnchor: [(size + 12) / 2, (size + 12) / 2],
  });
};

const CurrentLocationMarker: React.FC<CurrentLocationMarkerProps> = ({ lat, lng }) => {
  const icon = createCurrentLocationIcon();

  return (
    <Marker
      position={[lat, lng]}
      icon={icon}
      zIndexOffset={1000} // Keep it above other markers
    />
  );
};

export default CurrentLocationMarker;
