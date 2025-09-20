"use client";
import { ReactNode } from "react";
import { LocationProvider } from "./LocationContext";
import { RouteProvider } from "./RouteContext";
import { PoiFilterProvider } from "./PoiFilterContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LocationProvider>
      <RouteProvider>
        <PoiFilterProvider>
            {children}
        </PoiFilterProvider>
      </RouteProvider>
    </LocationProvider>
  );
}

