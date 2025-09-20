import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaRestroom, FaCoffee } from "react-icons/fa";
import { MdLocalDrink } from "react-icons/md";
import { POI } from "../types/POI";

// Icon components mapping
const iconComponents = {
  toilet: FaRestroom,
  drinking_water: MdLocalDrink,
  cafe: FaCoffee  // Changed from 'coffee' to 'cafe' to match your POI type
};

// Colors for each POI type
const iconColors = {
  toilet: "#007BFF",
  drinking_water: "#20C997", 
  cafe: "#FF8C00"  // Changed from 'coffee' to 'cafe' to match your POI type
};

// Function to create divIcon with React component
export function renderPOIMarker(poi: POI, size: number = 18): L.DivIcon {
  const IconComponent = iconComponents[poi.type as keyof typeof iconComponents] || FaCoffee;
  const color = iconColors[poi.type as keyof typeof iconColors] || iconColors.cafe;
  
  const iconElement = (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
    >
      <IconComponent 
        size={size * 0.6} 
        color="white"
      />
    </div>
  );

  return L.divIcon({
    html: renderToStaticMarkup(iconElement),
    className: 'poi-marker', // Custom CSS class if you need additional styling
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}
