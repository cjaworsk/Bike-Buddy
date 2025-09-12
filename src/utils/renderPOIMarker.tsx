/*import L from "leaflet";
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
}*/ 
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaRestroom, FaCoffee } from "react-icons/fa";
import { MdLocalDrink } from "react-icons/md";
import { POI } from "../types/POI";

// Icon components mapping
const iconComponents = {
  toilet: FaRestroom,
  drinking_water: MdLocalDrink,
  coffee: FaCoffee
};

// Colors for each POI type
const iconColors = {
  toilet: "#007BFF",
  drinking_water: "#20C997", 
  coffee: "#FF8C00"
};

// Function to create divIcon with React component
function createDivIcon(poi: POI, size: number = 18): L.DivIcon {
  const IconComponent = iconComponents[poi.type as keyof typeof iconComponents] || FaCoffee;
  const color = iconColors[poi.type as keyof typeof iconColors] || iconColors.coffee;
  
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

export function renderPOIMarker(poi: POI) {
  const icon = createDivIcon(poi);
  
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
