"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { POI, POIType } from "../types/POI";
import { RouteData } from "../types/RouteData"; // Add this import
import { useRoute } from "./RouteContext"; // Import useRoute

interface BoundingBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

interface PoiFilterContextProps {
  // POI data
  pois: POI[];
  setPois: React.Dispatch<React.SetStateAction<POI[]>>;
  fetchPois: (bbox: BoundingBox) => Promise<void>;
  
  // Filtering
  activeTypes: POIType[];
  toggleType: (type: POIType) => void;
  
  // Filtered POIs (computed)
  filteredPois: POI[];
}

const PoiFilterContext = createContext<PoiFilterContextProps | undefined>(undefined);

// Helper function to check if POI is near route
function isNearRoute(poi: POI, route: RouteData | null, toleranceMeters = 200): boolean {
  if (!route) return false;
  
  // TODO: implement real geometry check
  // For now, just return true as placeholder
  console.log(`Checking if POI is within ${toleranceMeters}m of route`);
  return true;
}

export function PoiFilterProvider({ children }: { children: ReactNode }) {
  // POI data state
  const [pois, setPois] = useState<POI[]>([]);
  
  // Filter state
  const [activeTypes, setActiveTypes] = useState<POIType[]>(['toilet', 'drinking_water', 'cafe']);
  const [showAdjacentPOIs, setShowAdjacentPOIs] = useState(false);
  
  // Get route data from RouteContext instead of local state
  const { routeData, showAdjacentPOIs: routeShowAdjacentPOIs, toggleAdjacentPOIs: routeToggleAdjacentPOIs } = useRoute();

  // Fetch POIs function
  const fetchPois = useCallback(async (bbox: BoundingBox) => {
    try {
      const params = new URLSearchParams({
        south: bbox.south.toString(),
        west: bbox.west.toString(),
        north: bbox.north.toString(),
        east: bbox.east.toString(),
        limit: '1000'
      });

      console.log('Fetching POIs with:', `/api/pois?${params}`);
      const response = await fetch(`/api/pois?${params}`);
      
      if (!response.ok) {
        // Get the actual error message from the server
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorBody = await response.text();
          console.error('Server error response:', errorBody);
          errorMessage += ` - ${errorBody}`;
        } catch (e) {
          console.error('Could not read error response body');
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('POIs fetched:', data.length);
      setPois(data);
    } catch (error) {
      console.error('Error fetching POIs:', error);
      // Don't clear POIs on error - just log it for now during development
    }
  }, []);

  // Filter functions
  const toggleType = (type: POIType) => {
    setActiveTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Compute filtered POIs
  const filteredPois = pois.filter(currentPoi => {
    // Filter by active types
    if (!activeTypes.includes(currentPoi.type)) return false;
    
    // Filter by route adjacency if enabled
    if (showAdjacentPOIs && !isNearRoute(currentPoi, routeData)) return false;
    
    return true;
  });

  return (
    <PoiFilterContext.Provider value={{ 
      pois, 
      setPois, 
      fetchPois,
      activeTypes, 
      toggleType,
      filteredPois
    }}>
      {children}
    </PoiFilterContext.Provider>
  );
}

export function usePoiFilters() {
  const context = useContext(PoiFilterContext);
  if (!context) {
    throw new Error("usePoiFilters must be used within a PoiFilterProvider");
  }
  return context;
}

// Legacy hook for backward compatibility (you can remove this once you update all references)
export function usePois() {
  const context = usePoiFilters();
  return {
    pois: context.pois,
    setPois: context.setPois,
    fetchPois: context.fetchPois
  };
}
