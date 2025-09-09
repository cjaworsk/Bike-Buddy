import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface RouteDisplayProps {
  routeData: {
    name: string;
    points: Array<{lat: number, lon: number}>;
  } | null;
}

const RouteDisplay = ({ routeData }: RouteDisplayProps) => {
  const map = useMap();

  useEffect(() => {
    if (!routeData || routeData.points.length === 0) return;

    const points = routeData.points;
    
    // Create the main route polyline (orange)
    const routeLine = L.polyline(
      points.map(p => [p.lat, p.lon]), 
      {
        color: '#FC5200', // Strava Orange
        weight: 4,
        opacity: 1
      }
    ).addTo(map);

    // Start marker (green dot)
    const startMarker = L.circleMarker([points[0].lat, points[0].lon], {
      radius: 8,
      fillColor: '#22c55e', // Green
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 1
    }).addTo(map);

    // End marker (red dot)
    const endMarker = L.circleMarker([points[points.length - 1].lat, points[points.length - 1].lon], {
      radius: 8,
      fillColor: '#ef4444', // Red
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 1
    }).addTo(map);

    // Fit map bounds to show entire route
    const group = new L.FeatureGroup([routeLine, startMarker, endMarker]);
    map.fitBounds(group.getBounds(), { padding: [20, 20] });

    // Cleanup function
    return () => {
      map.removeLayer(routeLine);
      map.removeLayer(startMarker);
      map.removeLayer(endMarker);
    };
  }, [map, routeData]);

  return null; // This component doesn't render anything directly
};

export default RouteDisplay;
