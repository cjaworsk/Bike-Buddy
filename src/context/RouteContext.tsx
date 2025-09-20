"use client";
import React, { createContext, useContext, useState } from "react";
import { RouteData } from "@/types/RouteData";

interface RouteContextType {
  routeData: RouteData | null;
  loadRoute: (route: RouteData) => void;
  removeRoute: () => void;
  showAdjacentPOIs: boolean;
  toggleAdjacentPOIs: () => void;
  showRouteDisplay: boolean;
  toggleRouteDisplay: () => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider = ({ children }: { children: React.ReactNode }) => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [showAdjacentPOIs, setShowAdjacentPOIs] = useState(false);
  const [showRouteDisplay, setShowRouteDisplay] = useState(true);

  const loadRoute = (route: RouteData) => {
    setRouteData(route);
    setShowRouteDisplay(true); // Auto-show when route loads
  };
  
  const removeRoute = () => {
    setRouteData(null);
    setShowRouteDisplay(false);
  };
  
  const toggleAdjacentPOIs = () => setShowAdjacentPOIs((prev) => !prev);
  
  const toggleRouteDisplay = () => {
    console.log('RouteContext toggleRouteDisplay called, current:', showRouteDisplay);
    setShowRouteDisplay((prev) => !prev);
  };

  return (
    <RouteContext.Provider
      value={{
        routeData,
        loadRoute,
        removeRoute,
        showAdjacentPOIs,
        toggleAdjacentPOIs,
        showRouteDisplay,
        toggleRouteDisplay,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  const ctx = useContext(RouteContext);
  if (!ctx) throw new Error("useRoute must be used within RouteProvider");
  return ctx;
};
