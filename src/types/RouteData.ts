export interface RouteData {
  id: string;
  name?: string; // Make name optional since some places might not have it
  coordinates: [number, number][]; // Array of [lat, lng] tuples
}

// Add route display state interface
export interface RouteContextType {
  routeData: RouteData | null;
  loadRoute: (route: RouteData) => void;
  removeRoute: () => void;
  showAdjacentPOIs: boolean;
  toggleAdjacentPOIs: () => void;
  showRouteDisplay: boolean; // Add this
  toggleRouteDisplay: () => void; // Add this
}
