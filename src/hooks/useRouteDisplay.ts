import { useState, useEffect } from 'react';
import { useRoute } from '@/context/RouteContext';

export function useRouteDisplay() {
  const [showRouteDisplay, setShowRouteDisplay] = useState(true);
  const { routeData } = useRoute();

  // Auto-show route when a new route is loaded
  useEffect(() => {
    if (routeData) {
      setShowRouteDisplay(true);
    }
  }, [routeData]);

  const toggleRouteDisplay = () => {
    console.log('toggleRouteDisplay called, current state:', showRouteDisplay);
    setShowRouteDisplay(prev => {
      const newState = !prev;
      console.log('Setting showRouteDisplay to:', newState);
      return newState;
    });
  };

  const hideRoute = () => {
    setShowRouteDisplay(false);
  };

  const showRoute = () => {
    setShowRouteDisplay(true);
  };

  console.log('useRouteDisplay state:', { showRouteDisplay, hasRoute: !!routeData });

  return {
    showRouteDisplay,
    toggleRouteDisplay,
    hideRoute,
    showRoute,
    hasRoute: !!routeData
  };
}
