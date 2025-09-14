"use client";

// React + Leaflet
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Marker clustering
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";

// React hooks
import { useCallback, useMemo, useState, useRef, useEffect } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";

// Components & utils
import CurrentLocationMarker from "./CurrentLocationMarker";
import MapBoundsFetcher from "./MapBoundsFetcher";
import { POI } from "../types/POI";
import { RouteData } from "@/types/RouteData";
import { renderPOIMarker } from "../utils/renderPOIMarker";
import MapToolbar from "./toolbar/MapToolbar";
import RouteDisplay from "./RouteDisplay";
import MobileToolbar from "./toolbar/MobileToolbar";

// Context
import { usePoiFilters } from "../context/PoiFilterContext";
//import MapZoomControl from "./MapZoomControl";


export default function Map() {
  const isMobile = useIsMobile();
  const [pois, setPois] = useState<POI[]>([]);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  //const [routeData, setRouteData] = useState<any>(null);
  const [showAdjacentPOI, setShowAdjacentPOI] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]); // Fallback center
  const [mapKey, setMapKey] = useState(0); // Force re-render when center changes
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const { selectedTypes } = usePoiFilters();

  // Ref to access the map instance for programmatic control
  const mapRef = useRef<L.Map | null>(null);

  // Get current location on component mount
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            console.log(`📍 Current location found: (${lat}, ${lng})`);
            
            setCurrentLocation({ lat, lng });
            setMapCenter([lat, lng]);
            setIsLocationLoaded(true);
            setMapKey(prev => prev + 1); // Force map re-render
          },
          (error) => {
            console.warn("⚠️ Could not get current location:", error.message);
            // Fallback to default center if geolocation fails
            setIsLocationLoaded(true);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000 // Cache location for 1 minute
          }
        );
      } else {
        console.warn("⚠️ Geolocation is not supported by this browser");
        setIsLocationLoaded(true);
      }
    };

    getCurrentLocation();
  }, []);

  const handleBboxUpdate = useCallback(
    async ({ south, west, north, east }: { south: number; west: number; north: number; east: number }) => {
      try {
        const res = await fetch(
          `/api/pois?south=${south}&west=${west}&north=${north}&east=${east}`
        );
        const data: POI[] = await res.json();

        setPois(prev => {
          const prevStr = JSON.stringify(prev.map(p => ({ id: p._id, lat: p.lat, lon: p.lon })));
          const newStr = JSON.stringify(data.map(p => ({ id: p._id, lat: p.lat, lon: p.lon })));
          return prevStr !== newStr ? data : prev;
        });
      } catch (err) {
        console.error("❌ Failed fetching POIs:", err);
      }
    },
    []
  );

  // Handler for location search
  const handleLocationSelect = useCallback((lat: number, lng: number, displayName: string) => {
    console.log(`🔍 Moving map to: ${displayName} (${lat}, ${lng})`);
    
    // Update center and force map re-render to new location
    setMapCenter([lat, lng]);
    setMapKey(prev => prev + 1);
    
    // If map instance is available, use setView for smooth transition
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 13, {
        animate: true,
        duration: 1
      });
    }
  }, []);

  // Handler for when current location is found (from toolbar)
  const handleCurrentLocationFound = useCallback((lat: number, lng: number) => {
    setCurrentLocation({ lat, lng });
    setMapCenter([lat, lng]);
    setMapKey(prev => prev + 1);
    
    // If map instance is available, use setView for smooth transition
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15, {
        animate: true,
        duration: 1
      });
    }
  }, []);

  // Handler for when a route is loaded
  const handleRouteLoad = (loadedRouteData: RouteData) => {
    console.log('Route loaded:', loadedRouteData);
    setRouteData(loadedRouteData);
  };

  // Handler for removing the route
  const handleRouteRemove = () => {
    console.log('Route removed');
    setRouteData(null);
    setShowAdjacentPOI(false);
  };

  // Handler for toggling POI visibility along route
  const handlePOIToggle = (show: boolean) => {
    console.log('Adjacent POI visibility:', show);
    setShowAdjacentPOI(show);
  };

  // Filter POIs by type and optionally by proximity to route
  const filteredPois = useMemo(() => {
    let filtered = pois.filter(poi => selectedTypes.includes(poi.type));
    
    // If showAdjacentPOI is enabled and we have a route, 
    // filter POIs to only show those near the route
    if (showAdjacentPOI && routeData?.points) {
      const routePoints = routeData.points;
      filtered = filtered.filter(poi => {
        return routePoints.some((routePoint: { lat: number; lon: number }) => {
          const distance = Math.sqrt(
            Math.pow(poi.lat - routePoint.lat, 2) + 
            Math.pow(poi.lon - routePoint.lon, 2)
          );
          // Show POIs within ~0.01 degrees (roughly 1km) of route
          return distance < 0.01;
        });
      });
    }
    
    return filtered;
  }, [pois, selectedTypes, showAdjacentPOI, routeData]);

  const markers = useMemo(() => filteredPois.map(poi => renderPOIMarker(poi)), [filteredPois]);

  // Don't render map until we've attempted to get location
  if (!isLocationLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Getting your location...</p>
        </div>
      </div>
    );
  }

 return (
    <>
      {/* Toolbar: desktop vs mobile */}
      {isMobile ? (
        <MobileToolbar
            onRouteLoad={handleRouteLoad}
            onRouteRemove={handleRouteRemove}
            onPOIToggle={handlePOIToggle}
            onLocationSelect={handleLocationSelect}
            onCurrentLocationFound={handleCurrentLocationFound}
        />
      ) : (
        <MapToolbar
          onRouteLoad={handleRouteLoad}
          onRouteRemove={handleRouteRemove}
          onPOIToggle={handlePOIToggle}
          onLocationSelect={handleLocationSelect}
        />
      )}

      <MapContainer
        key={mapKey} // Force re-render when location changes
        center={mapCenter}
        zoom={currentLocation ? 15 : 13} // Higher zoom if we have current location
        zoomControl={false}
        className="mapContainer"
        ref={(map) => {
          if (map) {
            mapRef.current = map;
          }}}
        style={{  
            height: '100dvh',
            width: '100%' 
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />

        <MapBoundsFetcher onUpdate={handleBboxUpdate} />

        <MarkerClusterGroup
          maxClusterRadius={(zoom: number) =>
            isMobile
              ? Math.max(40, 100 - zoom * 4) // more spaced clusters for small screens
              : Math.max(20, 80 - zoom * 3) // original desktop config
          }
          disableClusteringAtZoom={16}
          spiderfyOnMaxZoom={true}
        >
          {markers}
        </MarkerClusterGroup>

        <RouteDisplay routeData={routeData} />
        {currentLocation && (
          <CurrentLocationMarker 
            lat={currentLocation.lat} 
            lng={currentLocation.lng} 
          />
        )}
      </MapContainer>
    </>
  );
}
