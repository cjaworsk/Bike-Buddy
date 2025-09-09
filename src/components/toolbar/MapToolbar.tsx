"use client";

import { useState, useEffect } from "react";
import SearchBox from "./SearchBox"; // Updated import path
import TypeSelector from "./TypeSelector";
import MapButton from "./MapButton";

interface MapToolbarProps {
  onRouteLoad: (routeData: any) => void;
  onRouteRemove: () => void;
  onPOIToggle: (show: boolean) => void;
  onLocationSelect: (lat: number, lng: number, displayName: string) => void; // New prop
}

export default function MapToolbar({ onRouteLoad, onRouteRemove, onPOIToggle, onLocationSelect }: MapToolbarProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  
  useEffect(() => {
    // Delay toolbar rendering until map is loaded
    const timer = setTimeout(() => setShowToolbar(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!showToolbar) return null;
  
  return (
    <div className="map-toolbar">
      {/* Search Box - takes up available space */}
      <div className="map-toolbar-search">
        <SearchBox onLocationSelect={onLocationSelect} />
      </div>
      
      {/* Type Selector Buttons */}
      <div className="map-toolbar-types">
        <TypeSelector />
      </div>
      
      {/* Import Route Button */}
      <div className="map-toolbar-buttons">
        <MapButton 
          onRouteLoad={onRouteLoad} 
          onRouteRemove={onRouteRemove}
          onPOIToggle={onPOIToggle}
        />
      </div>
    </div>
  );
}
