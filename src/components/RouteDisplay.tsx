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

  console.log('RouteDisplay render:', { 
    showRouteDisplay, 
    hasRouteData: !!routeData, 
    coordsLength: routeData?.coordinates?.length 
  });

  useEffect(() => {
    console.log('RouteDisplay useEffect triggered:', { showRouteDisplay, hasRouteData: !!routeData });

    // Clean up existing layers first
    const cleanupLayers = () => {
      if (layersRef.current.routeLine) {
        console.log('Removing route line');
        map.removeLayer(layersRef.current.routeLine);
        layersRef.current.routeLine = undefined;
      }
      if (layersRef.current.startMarker) {
        console.log('Removing start marker');
        map.removeLayer(layersRef.current.startMarker);
        layersRef.current.startMarker = undefined;
      }
      if (layersRef.current.endMarker) {
        console.log('Removing end marker');
        map.removeLayer(layersRef.current.endMarker);
        layersRef.current.endMarker = undefined;
      }
    };

    // Always clean up first
    cleanupLayers();

    // Only add layers if we should show the route and have route data
    if (showRouteDisplay && routeData && routeData.coordinates && routeData.coordinates.length > 0) {
      console.log('Creating route display elements');
      const coordinates = routeData.coordinates;

      // Create and store new layers
      layersRef.current.routeLine = L.polyline(coordinates, {
        color: '#FC5200', 
        weight: 4, 
        opacity: 1 
      }).addTo(map);
      console.log('Added route line to map');

      layersRef.current.startMarker = L.circleMarker(coordinates[0], {
        radius: 8,
        fillColor: '#22c55e',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map);
      console.log('Added start marker to map');

      layersRef.current.endMarker = L.circleMarker(coordinates[coordinates.length - 1], {
        radius: 8,
        fillColor: '#ef4444',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map);
      console.log('Added end marker to map');

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
