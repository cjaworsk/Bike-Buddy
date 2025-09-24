"use client";
import { MapContainer } from "react-leaflet";
import { useLocationContext } from "@/context/LocationContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import MapTiles from "./MapTiles";
import CurrentLocationMarker from "./CurrentLocationMarker";
import RouteDisplay from "./RouteDisplay";
import { PoiLayer } from "./PoiLayer";
import MapBoundsFetcher from "./MapBoundsFetcher";
import MapRefHandler from "./MapRefHandler";
import { MapToolbar } from "./toolbar/MapToolbar";
import MobileInterface from "./mobile/MobileInterface";

export default function Map(){
  const { mapCenter } = useLocationContext();
  const isMobile = useIsMobile();

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer
        center={mapCenter}
        zoom={13}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <MapRefHandler />
        <MapTiles />
        <CurrentLocationMarker />
        <RouteDisplay />
        <PoiLayer />
        <MapBoundsFetcher />
        {isMobile ? <MobileInterface /> : <MapToolbar />}
      </MapContainer>
    </div>
  );
}
