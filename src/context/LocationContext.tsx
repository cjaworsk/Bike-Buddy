"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import L from "leaflet";

interface LocationContextProps {
  currentLocation: { lat: number; lng: number } | null;
  isLocationLoaded: boolean;
  mapCenter: [number, number];
  mapInstance: L.Map | null;
  setMapInstance: (map: L.Map | null) => void;
  onLocationSelect: (lat: number, lng: number, displayName: string) => void;
  onCurrentLocationFound: (lat: number, lng: number) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]); // default: SF
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  // Initial geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("⚠️ Geolocation not supported");
      setIsLocationLoaded(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        console.log(`📍 Location found: ${lat}, ${lng}`);

        setCurrentLocation({ lat, lng });
        setMapCenter([lat, lng]);
        setIsLocationLoaded(true);
      },
      err => {
        console.warn("⚠️ Failed to get location:", err.message);
        setIsLocationLoaded(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Search handler
  const onLocationSelect = useCallback((lat: number, lng: number, displayName: string) => {
    console.log(`📍 Move to: ${displayName} (${lat}, ${lng})`);
    setMapCenter([lat, lng]);
    mapInstance?.setView([lat, lng], 13, { animate: true, duration: 1 });
  }, [mapInstance]);

  // "Current location" button handler
  const onCurrentLocationFound = useCallback((lat: number, lng: number) => {
    setCurrentLocation({ lat, lng });
    setMapCenter([lat, lng]);
    mapInstance?.setView([lat, lng], 15, { animate: true, duration: 1 });
  }, [mapInstance]);

  return (
    <LocationContext.Provider
      value={{ 
        currentLocation, 
        isLocationLoaded, 
        mapCenter, 
        mapInstance, 
        setMapInstance, 
        onLocationSelect, 
        onCurrentLocationFound 
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationContext must be used inside a LocationProvider");
  return ctx;
};
