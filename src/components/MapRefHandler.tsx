import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useLocationContext } from '@/context/LocationContext';

export default function MapRefHandler() {
  const map = useMap();
  const { setMapInstance } = useLocationContext();

  useEffect(() => {
    // Set the map instance in context so other components can use it
    setMapInstance(map);
    
    return () => {
      setMapInstance(null);
    };
  }, [map, setMapInstance]);

  return null;
}
