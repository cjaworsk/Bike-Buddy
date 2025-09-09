"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { POIType } from "../types/POI";

interface PoiFilterContextProps {
  selectedTypes: POIType[];
  toggleType: (type: POIType) => void;
}

const PoiFilterContext = createContext<PoiFilterContextProps | undefined>(undefined);

export function PoiFilterProvider({ children }: { children: ReactNode }) {
  const [selectedTypes, setSelectedTypes] = useState<POIType[]>([]);

  const toggleType = (type: POIType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <PoiFilterContext.Provider value={{ selectedTypes, toggleType }}>
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

