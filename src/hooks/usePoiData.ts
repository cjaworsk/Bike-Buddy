"use client";

import { usePoiFilters } from "@/context/PoiFilterContext";

export function usePoiData() {
  const { pois, setPois } = usePoiFilters();
  return { pois, setPois };
}
