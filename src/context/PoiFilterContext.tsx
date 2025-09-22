"use client";

import { createContext, useContext, useState, useRef, ReactNode, useCallback, useEffect } from "react";
import { POI, POIType } from "../types/POI";
import { RouteData } from "../types/RouteData";
import { useRoute } from "./RouteContext";

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
  
  // Adjacent POI filtering
  showAdjacentPOIs: boolean;
  toggleAdjacentPOIs: () => void;
  
  // Filtered POIs (computed)
  filteredPois: POI[];
}

const PoiFilterContext = createContext<PoiFilterContextProps | undefined>(undefined);

// Helper function to calculate distance between two points using Haversine formula
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in meters
}

// Helper function to calculate distance from point to line segment
function pointToLineDistance(
  pointLat: number, 
  pointLon: number, 
  lineLat1: number, 
  lineLon1: number, 
  lineLat2: number, 
  lineLon2: number
): number {
  // Convert to approximate cartesian coordinates (good enough for short distances)
  const A = pointLat - lineLat1;
  const B = pointLon - lineLon1;
  const C = lineLat2 - lineLat1;
  const D = lineLon2 - lineLon1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  let param = -1;
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;
  
  if (param < 0) {
    xx = lineLat1;
    yy = lineLon1;
  } else if (param > 1) {
    xx = lineLat2;
    yy = lineLon2;
  } else {
    xx = lineLat1 + param * C;
    yy = lineLon1 + param * D;
  }

  return haversineDistance(pointLat, pointLon, xx, yy);
}

// Helper function to check if POI is near route
function isNearRoute(poi: POI, route: RouteData | null, toleranceMeters = 200): boolean {
  if (!route || !route.coordinates || route.coordinates.length < 2) {
    return false;
  }

  let minDistance = Infinity;
  
  // Check distance to each line segment of the route
  for (let i = 0; i < route.coordinates.length - 1; i++) {
    const [lat1, lon1] = route.coordinates[i];
    const [lat2, lon2] = route.coordinates[i + 1];
    
    const distance = pointToLineDistance(poi.lat, poi.lon, lat1, lon1, lat2, lon2);
    minDistance = Math.min(minDistance, distance);
    
    // Early exit if we're already within tolerance
    if (minDistance <= toleranceMeters) {
      return true;
    }
  }
  
  return minDistance <= toleranceMeters;
}

export function PoiFilterProvider({ children }: { children: ReactNode }) {
  // POI data state
  const [pois, setPois] = useState<POI[]>([]);
  
  // Filter state
  const [activeTypes, setActiveTypes] = useState<POIType[]>(['toilet', 'drinking_water', 'cafe']);
  
  // Adjacent POI filtering state (managed here, not in RouteContext)
  const [showAdjacentPOIs, setShowAdjacentPOIs] = useState(false);
  
  // Get route data from RouteContext (only routeData)
  const { routeData } = useRoute();
  
  console.log('PoiFilterProvider render - showAdjacentPOIs:', showAdjacentPOIs, 'hasRoute:', !!routeData);
  
  // Track showAdjacentPOIs changes
  useEffect(() => {
    console.log('showAdjacentPOIs changed to:', showAdjacentPOIs);
  }, [showAdjacentPOIs]);
  
  const toggleAdjacentPOIs = () => {
    console.log('PoiFilterContext toggleAdjacentPOIs called, current:', showAdjacentPOIs);
    setShowAdjacentPOIs(prev => !prev);
  };


const prevBboxRef = useRef<BoundingBox | null>(null);

const fetchPois = useCallback(async (bbox: BoundingBox) => {
  try {
    const prevBbox = prevBboxRef.current;

    const params = new URLSearchParams({
      south: bbox.south.toString(),
      west: bbox.west.toString(),
      north: bbox.north.toString(),
      east: bbox.east.toString(),
    });

    if (prevBbox) {
      params.set("prevSouth", prevBbox.south.toString());
      params.set("prevWest", prevBbox.west.toString());
      params.set("prevNorth", prevBbox.north.toString());
      params.set("prevEast", prevBbox.east.toString());
    }

    const response = await fetch(`/api/pois-diff?${params}`);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${response.statusText} - ${errorBody}`
      );
    }

    const { added, removed } = await response.json();
    console.log(
      `POI diff -> added: ${added.length}, removed: ${removed.length}`
    );

    setPois((prev) => {
      const removedIds = new Set(removed.map((p: POI) => p._id?.toString()));
      const filtered = prev.filter(
        (p) => !removedIds.has(p._id?.toString())
      );
      return [...filtered, ...added];
    });

    prevBboxRef.current = bbox; // update for next call
  } catch (error) {
    console.error("Error fetching POIs:", error);
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
    if (showAdjacentPOIs) {
      const isAdjacent = isNearRoute(currentPoi, routeData, 200); // 200m tolerance
      if (!isAdjacent) {
        console.log(`POI ${currentPoi.name} is too far from route, filtering out`);
        return false;
      } else {
        console.log(`POI ${currentPoi.name} is within 200m of route, keeping`);
      }
    }
    
    return true;
  });

  // Log filtering results when adjacent POI filter is active
  if (showAdjacentPOIs && routeData) {
    console.log(`Route filtering: ${filteredPois.length} POIs within 200m of ${pois.length} total POIs`);
  }

  return (
    <PoiFilterContext.Provider value={{ 
      pois, 
      setPois, 
      fetchPois,
      activeTypes, 
      toggleType,
      showAdjacentPOIs,
      toggleAdjacentPOIs,
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
