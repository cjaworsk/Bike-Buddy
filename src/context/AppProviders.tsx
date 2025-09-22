"use client";
import { ReactNode } from "react";
import { LocationProvider } from "./LocationContext";
import { RouteProvider } from "./RouteContext";
import { PoiFilterProvider } from "./PoiFilterContext";
import { MobileUIProvider } from "./MobileUIContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <RouteProvider>
      <PoiFilterProvider>  {/* Must be INSIDE RouteProvider */}
        <LocationProvider>
          <MobileUIProvider>
            {children}
        </MobileUIProvider>
      </LocationProvider>
    </PoiFilterProvider>
  </RouteProvider>
  );
}

