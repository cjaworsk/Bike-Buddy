import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet'; 
import L from 'leaflet'; 
import { useRoute } from '@/context/RouteContext';

const RouteDisplay = () => {
  const { routeData, showRouteDisplay } = useRoute(); // Get both from same context
  const map = useMap();
  const layersRef = useRef<{
    routeLine?: L.Polyline;
    startMarker?: L.CircleMarker;
    endMarker?: L.CircleMarker;
  }>({});

  useEffect(() => {

    // Clean up existing layers first
    const cleanupLayers = () => {
      if (layersRef.current.routeLine) {
        map.removeLayer(layersRef.current.routeLine);
        layersRef.current.routeLine = undefined;
      }
      if (layersRef.current.startMarker) {
        map.removeLayer(layersRef.current.startMarker);
        layersRef.current.startMarker = undefined;
      }
      if (layersRef.current.endMarker) {
        map.removeLayer(layersRef.current.endMarker);
        layersRef.current.endMarker = undefined;
      }
    };

    // Always clean up first
    cleanupLayers();

    // Only add layers if we should show the route and have route data
    if (showRouteDisplay && routeData && routeData.coordinates && routeData.coordinates.length > 0) {
      const coordinates = routeData.coordinates;

      // Create and store new layers
      layersRef.current.routeLine = L.polyline(coordinates, {
        color: '#FC5200', 
        weight: 4, 
        opacity: 1 
      }).addTo(map);

      layersRef.current.startMarker = L.circleMarker(coordinates[0], {
        radius: 8,
        fillColor: '#22c55e',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map);

      layersRef.current.endMarker = L.circleMarker(coordinates[coordinates.length - 1], {
        radius: 8,
        fillColor: '#ef4444',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map);

      // Only fit bounds when route first loads
      const group = new L.FeatureGroup([
        layersRef.current.routeLine, 
        layersRef.current.startMarker, 
        layersRef.current.endMarker
      ]);
      map.fitBounds(group.getBounds(), { padding: [20, 20] });
    } else {
      console.log('Not showing route - showRouteDisplay:', showRouteDisplay, 'hasData:', !!routeData);
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up route display elements on unmount');
      cleanupLayers();
    };
  }, [map, routeData, showRouteDisplay]);

  return null;
};

export default RouteDisplay;
