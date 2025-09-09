import { useRef, useState, useEffect } from 'react';

interface MapButtonProps {
  onRouteLoad?: (routeData: any) => void;
  onRouteRemove?: () => void;
  onPOIToggle?: (show: boolean) => void;
}

const MapButton = ({ onRouteLoad, onRouteRemove, onPOIToggle }: MapButtonProps) => {
  const [routeData, setRouteData] = useState<any>(null);
  const [showAdjacentPOI, setShowAdjacentPOI] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const parseGPX = (gpxText: string) => {
    const parser = new DOMParser();
    const gpx = parser.parseFromString(gpxText, 'text/xml');
    
    // Get route name
    const routeName = gpx.querySelector('trk name')?.textContent || 
                     gpx.querySelector('rte name')?.textContent || 
                     'Imported Route';
    
    // Get all track points from all segments
    const trackPoints: Array<{lat: number, lon: number}> = [];
    
    // Try tracks first (most common)
    const tracks = gpx.querySelectorAll('trk');
    tracks.forEach(track => {
      const segments = track.querySelectorAll('trkseg');
      segments.forEach(segment => {
        const points = segment.querySelectorAll('trkpt');
        points.forEach(point => {
          const lat = parseFloat(point.getAttribute('lat') || '0');
          const lon = parseFloat(point.getAttribute('lon') || '0');
          if (lat !== 0 && lon !== 0) {
            trackPoints.push({ lat, lon });
          }
        });
      });
    });
    
    // If no tracks, try routes
    if (trackPoints.length === 0) {
      const routes = gpx.querySelectorAll('rte');
      routes.forEach(route => {
        const points = route.querySelectorAll('rtept');
        points.forEach(point => {
          const lat = parseFloat(point.getAttribute('lat') || '0');
          const lon = parseFloat(point.getAttribute('lon') || '0');
          if (lat !== 0 && lon !== 0) {
            trackPoints.push({ lat, lon });
          }
        });
      });
    }
    
    return {
      name: routeName,
      points: trackPoints
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const parsed = parseGPX(text);
      
      if (parsed.points.length === 0) {
        alert('No valid GPS points found in the GPX file');
        return;
      }
      
      setRouteData(parsed);
      onRouteLoad?.(parsed);
    } catch (error) {
      console.error('Error parsing GPX file:', error);
      alert('Error reading GPX file. Please check the file format.');
    }
    
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handlePOIToggle = (checked: boolean) => {
    setShowAdjacentPOI(checked);
    onPOIToggle?.(checked);
  };

  const handleRemoveRoute = () => {
    setRouteData(null);
    setShowAdjacentPOI(false);
    setIsDropdownOpen(false);
    onRouteRemove?.();
    onPOIToggle?.(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="toolbar-container">
    {/* Hidden file input */}
    <input
        ref={fileInputRef}
        type="file"
        accept=".gpx"
        onChange={handleFileUpload}
        className="file-input-hidden"
    />
    
    {/* Import Route Button (only shown when no route is loaded) */}
    {!routeData && (
        <button
        onClick={handleImportClick}
        className="import-button"
        >
        Import Route
        </button>
    )}
    
    {/* Route Name Button with Dropdown (appears after upload) */}
    {routeData && (
        <div className="route-dropdown-container" ref={dropdownRef}>
        <button
            onClick={toggleDropdown}
            className={`route-button ${isDropdownOpen ? "open" : ""}`}
        >
            <span className="route-button-label truncate">{routeData.name}</span>
            <svg 
            className={`dropdown-icon ${isDropdownOpen ? "rotate" : ""}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        
        {/* Dropdown Menu */}
        {isDropdownOpen && (
            <div className="dropdown-menu">
            {/* Show adjacent POI Checkbox */}
            <div className="dropdown-section">
                <div className="checkbox-row">
                <input
                    type="checkbox"
                    id="adjacent-poi"
                    checked={showAdjacentPOI}
                    onChange={(e) => handlePOIToggle(e.target.checked)}
                    className="checkbox-input"
                />
                <label 
                    htmlFor="adjacent-poi" 
                    className="checkbox-label"
                >
                    Show adjacent POI
                </label>
                </div>
            </div>
            
            {/* Remove Route Button */}
            <button
                onClick={handleRemoveRoute}
                className="remove-route-button"
            >
                Remove route
            </button>
            </div>
        )}
        </div>
    )}
    </div>
  );
};

export default MapButton;
